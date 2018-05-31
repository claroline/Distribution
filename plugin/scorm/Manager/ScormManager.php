<?php


/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\ScormBundle\Manager;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Manager\Resource\ResourceEvaluationManager;
use Claroline\ScormBundle\Entity\Sco;
use Claroline\ScormBundle\Entity\Scorm;
use Claroline\ScormBundle\Entity\Scorm12Resource;
use Claroline\ScormBundle\Entity\Scorm12Sco;
use Claroline\ScormBundle\Entity\Scorm12ScoTracking;
use Claroline\ScormBundle\Entity\Scorm2004Resource;
use Claroline\ScormBundle\Entity\Scorm2004Sco;
use Claroline\ScormBundle\Entity\Scorm2004ScoTracking;
use Claroline\ScormBundle\Entity\ScormResource;
use Claroline\ScormBundle\Entity\ScoTracking;
use Claroline\ScormBundle\Library\Scorm12;
use Claroline\ScormBundle\Library\Scorm2004;
use Claroline\ScormBundle\Library\ScormLib;
use Claroline\ScormBundle\Listener\Exception\InvalidScormArchiveException;
use JMS\DiExtraBundle\Annotation as DI;
use Ramsey\Uuid\Uuid;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * @DI\Service("claroline.manager.scorm_manager")
 */
class ScormManager
{
    /** @var string */
    private $filesDir;
    /** @var Scorm12 */
    private $libsco12;
    /** @var Scorm2004 */
    private $libsco2004;
    /** @var ObjectManager */
    private $om;
    /** @var ResourceEvaluationManager */
    private $resourceEvalManager;
    /** @var ScormLib */
    private $scormLib;
    /** @var string */
    private $uploadDir;

    private $scormResourcesPath;

    private $scorm12ResourceRepo;
    private $scorm12ScoTrackingRepo;
    private $scorm2004ResourceRepo;
    private $scorm2004ScoTrackingRepo;
    private $logRepo;

    /**
     * Constructor.
     *
     * @DI\InjectParams({
     *     "filesDir"            = @DI\Inject("%claroline.param.files_directory%"),
     *     "libsco12"            = @DI\Inject("claroline.library.scorm_12"),
     *     "libsco2004"          = @DI\Inject("claroline.library.scorm_2004"),
     *     "om"                  = @DI\Inject("claroline.persistence.object_manager"),
     *     "resourceEvalManager" = @DI\Inject("claroline.manager.resource_evaluation_manager"),
     *     "scormLib"            = @DI\Inject("claroline.library.scorm"),
     *     "uploadDir"           = @DI\Inject("%claroline.param.uploads_directory%")
     * })
     *
     * @param string                    $filesDir
     * @param Scorm12                   $libsco12
     * @param Scorm2004                 $libsco2004
     * @param ObjectManager             $om
     * @param ResourceEvaluationManager $resourceEvalManager
     * @param ScormLib                  $scormLib
     * @param string                    $uploadDir
     */
    public function __construct(
        $filesDir,
        Scorm12 $libsco12,
        Scorm2004 $libsco2004,
        ObjectManager $om,
        ResourceEvaluationManager $resourceEvalManager,
        ScormLib $scormLib,
        $uploadDir
    ) {
        $this->filesDir = $filesDir;
        $this->libsco12 = $libsco12;
        $this->libsco2004 = $libsco2004;
        $this->om = $om;
        $this->resourceEvalManager = $resourceEvalManager;
        $this->scormLib = $scormLib;
        $this->uploadDir = $uploadDir;

        $this->scormResourcesPath = $uploadDir.'/scormresources/';

        $this->scorm12ResourceRepo = $om->getRepository('ClarolineScormBundle:Scorm12Resource');
        $this->scorm12ScoTrackingRepo = $om->getRepository('ClarolineScormBundle:Scorm12ScoTracking');
        $this->scorm2004ResourceRepo = $om->getRepository('ClarolineScormBundle:Scorm2004Resource');
        $this->scorm2004ScoTrackingRepo = $om->getRepository('ClarolineScormBundle:Scorm2004ScoTracking');
        $this->logRepo = $om->getRepository('ClarolineCoreBundle:Log\Log');
    }

    public function createScorm($tmpFile, $name)
    {
        $scorm = new Scorm();
        $scorm->setName($name);
        $hashName = Uuid::uuid4()->toString().'.zip';
        $scorm->setFilePath($hashName);
        $scos = $this->generateScos($scorm, $tmpFile);

        if (count($scos) > 0) {
            $this->om->persist($scorm);
            $this->persistScos($scorm, $scos);
        } else {
            throw new InvalidScormArchiveException('no_sco_in_scorm_archive_message');
        }

        $this->unzipScormArchive($tmpFile, $hashName);
        // Move Scorm archive in the files directory
        $tmpFile->move($this->filesDir, $hashName);

        return $scorm;
    }

    public function generateScos(Scorm $scorm, \SplFileInfo $file)
    {
        $contents = '';
        $zip = new \ZipArchive();

        $zip->open($file);
        $stream = $zip->getStream('imsmanifest.xml');

        while (!feof($stream)) {
            $contents .= fread($stream, 2);
        }
        $dom = new \DOMDocument();

        if (!$dom->loadXML($contents)) {
            throw new InvalidScormArchiveException('cannot_load_imsmanifest_message');
        }

        $scormVersionElements = $dom->getElementsByTagName('schemaversion');

        if ($scormVersionElements->length === 1) {
            switch ($scormVersionElements->item(0)->textContent) {
                case '1.2':
                    $scorm->setVersion(Scorm::SCORM_12);
                    break;
                case 'CAM 1.3':
                case '2004 3rd Edition':
                case '2004 4th Edition':
                    $scorm->setVersion(Scorm::SCORM_2004);
                    break;
                default:
                    throw new InvalidScormArchiveException('invalid_scorm_version_message');
            }
        } else {
            throw new InvalidScormArchiveException('invalid_scorm_version_message');
        }

        $scos = $this->scormLib->parseOrganizationsNode($dom);

        return $scos;
    }

    /**
     * Associates SCORM resource to SCOs and persists them.
     * As array $scos can also contain an array of scos
     * this method is call recursively when an element is an array.
     *
     * @param Scorm $scorm
     * @param array $scos
     */
    private function persistScos(Scorm $scorm, array $scos)
    {
        foreach ($scos as $sco) {
            if (is_array($sco)) {
                $this->persistScos($scorm, $sco);
            } else {
                $sco->setScorm($scorm);
                $this->om->persist($sco);
            }
        }
    }

    /**
     * Unzip a given ZIP file into the web resources directory.
     *
     * @param \SplFileInfo $file
     * @param string       $hashName name of the destination directory
     */
    private function unzipScormArchive(\SplFileInfo $file, $hashName)
    {
        $zip = new \ZipArchive();
        $zip->open($file);
        $destinationDir = $this->scormResourcesPath.$hashName;
        if (!file_exists($destinationDir)) {
            mkdir($destinationDir, 0777, true);
        }
        $zip->extractTo($destinationDir);
        $zip->close();
    }

    public function createScoTracking(Sco $sco, User $user = null)
    {
        $version = $sco->getScorm()->getVersion();
        $scoTracking = new ScoTracking();
        $scoTracking->setSco($sco);

        switch ($version) {
            case Scorm::SCORM_12 :
                $scoTracking->setLessonStatus('not attempted');
                $scoTracking->setSuspendData('');
                $scoTracking->setEntry('ab-initio');
                $scoTracking->setLessonLocation('');
                $scoTracking->setCredit('no-credit');
                $scoTracking->setTotalTimeInt(0);
                $scoTracking->setSessionTime(0);
                $scoTracking->setLessonMode('normal');
                $scoTracking->setExitMode('');
                $scoTracking->setBestLessonStatus('not attempted');

                if (is_null($sco->getPrerequisites())) {
                    $scoTracking->setIsLocked(false);
                } else {
                    $scoTracking->setIsLocked(true);
                }
                break;
            case Scorm::SCORM_2004 :
                $scoTracking->setTotalTimeString('PT0S');
                $scoTracking->setCompletionStatus('unknown');
                $scoTracking->setLessonStatus('unknown');
                break;
        }
        if (!empty($user)) {
            $scoTracking->setUser($user);
            $this->om->persist($scoTracking);
            $this->om->flush();
        }

        return $scoTracking;
    }


    /***************
     * Old methods *
     ***************/

    public function persistScorm12(Scorm12Resource $scorm)
    {
        $this->om->persist($scorm);
        $this->om->flush();
    }

    public function persistScorm2004(Scorm2004Resource $scorm)
    {
        $this->om->persist($scorm);
        $this->om->flush();
    }

    public function createScormResource($tmpFile, $name, $version)
    {
        //use the workspace as a prefix tor the uploadpath later
        if ('1.2' === $version) {
            $scormResource = new Scorm12Resource();
        } else {
            $scormResource = new Scorm2004Resource();
        }
        $scormResource->setName($name);
        $hashName = Uuid::uuid4()->toString().'.zip';
        $scormResource->setHashName($hashName);
        $scos = $this->generateScosFromScormArchive($tmpFile, $version);

        if (count($scos) > 0) {
            $this->om->persist($scormResource);
            $this->persistOldScos($scormResource, $scos);
        } else {
            throw new InvalidScormArchiveException('no_sco_in_scorm_archive_message');
        }

        $this->unzipScormArchive($tmpFile, $hashName);
        // Move Scorm archive in the files directory
        $tmpFile->move($this->filesDir, $hashName);

        return $scormResource;
    }

    public function createScorm12ScoTracking(User $user, Scorm12Sco $sco)
    {
        $scoTracking = new Scorm12ScoTracking();
        $scoTracking->setUser($user);
        $scoTracking->setSco($sco);
        $scoTracking->setLessonStatus('not attempted');
        $scoTracking->setSuspendData('');
        $scoTracking->setEntry('ab-initio');
        $scoTracking->setLessonLocation('');
        $scoTracking->setCredit('no-credit');
        $scoTracking->setTotalTime(0);
        $scoTracking->setSessionTime(0);
        $scoTracking->setLessonMode('normal');
        $scoTracking->setExitMode('');
        $scoTracking->setBestLessonStatus('not attempted');

        if (is_null($sco->getPrerequisites())) {
            $scoTracking->setIsLocked(false);
        } else {
            $scoTracking->setIsLocked(true);
        }
        $this->om->persist($scoTracking);
        $this->om->flush();

        return $scoTracking;
    }

    public function createEmptyScorm12ScoTracking(Scorm12Sco $sco)
    {
        $scoTracking = new Scorm12ScoTracking();
        $scoTracking->setSco($sco);
        $scoTracking->setLessonStatus('not attempted');
        $scoTracking->setSuspendData('');
        $scoTracking->setEntry('ab-initio');
        $scoTracking->setLessonLocation('');
        $scoTracking->setCredit('no-credit');
        $scoTracking->setTotalTime(0);
        $scoTracking->setSessionTime(0);
        $scoTracking->setLessonMode('normal');
        $scoTracking->setExitMode('');
        $scoTracking->setBestLessonStatus('not attempted');

        if (is_null($sco->getPrerequisites())) {
            $scoTracking->setIsLocked(false);
        } else {
            $scoTracking->setIsLocked(true);
        }

        return $scoTracking;
    }

    public function updateScorm12ScoTracking(Scorm12ScoTracking $scoTracking)
    {
        $this->om->persist($scoTracking);
        $this->om->flush();
    }

    public function createScorm2004ScoTracking(User $user, Scorm2004Sco $sco)
    {
        $scoTracking = new Scorm2004ScoTracking();
        $scoTracking->setUser($user);
        $scoTracking->setSco($sco);
        $scoTracking->setTotalTime('PT0S');
        $scoTracking->setCompletionStatus('unknown');
        $scoTracking->setSuccessStatus('unknown');
        $this->om->persist($scoTracking);
        $this->om->flush();

        return $scoTracking;
    }

    public function createEmptyScorm2004ScoTracking(Scorm2004Sco $sco)
    {
        $scoTracking = new Scorm2004ScoTracking();
        $scoTracking->setSco($sco);
        $scoTracking->setTotalTime('PT0S');
        $scoTracking->setCompletionStatus('unknown');
        $scoTracking->setSuccessStatus('unknown');

        return $scoTracking;
    }

    public function updateScorm2004ScoTracking(Scorm2004ScoTracking $scoTracking)
    {
        $this->om->persist($scoTracking);
        $this->om->flush();
    }

    public function formatSessionTime($sessionTime)
    {
        $formattedValue = 'PT0S';
        $generalPattern = '/^P([0-9]+Y)?([0-9]+M)?([0-9]+D)?T([0-9]+H)?([0-9]+M)?([0-9]+S)?$/';
        $decimalPattern = '/^P([0-9]+Y)?([0-9]+M)?([0-9]+D)?T([0-9]+H)?([0-9]+M)?[0-9]+\.[0-9]{1,2}S$/';

        if ('PT' !== $sessionTime) {
            if (preg_match($generalPattern, $sessionTime)) {
                $formattedValue = $sessionTime;
            } elseif (preg_match($decimalPattern, $sessionTime)) {
                $formattedValue = preg_replace(['/\.[0-9]+S$/'], ['S'], $sessionTime);
            }
        }

        return $formattedValue;
    }

    public function generateScorm12Evaluation(Scorm12ScoTracking $scoTracking)
    {
        $status = $scoTracking->getLessonStatus();

        switch ($status) {
            case 'passed':
            case 'failed':
            case 'completed':
            case 'incomplete':
                break;
            case 'not attempted':
                $status = 'not_attempted';
                break;
            case 'browsed':
                $status = 'opened';
                break;
            default:
                $status = 'unknown';
        }
        $this->resourceEvalManager->createResourceEvaluation(
            $scoTracking->getSco()->getScormResource()->getResourceNode(),
            $scoTracking->getUser(),
            new \DateTime(),
            $status,
            $scoTracking->getScoreRaw(),
            $scoTracking->getScoreMin(),
            $scoTracking->getScoreMax(),
            null,
            null,
            $scoTracking->getSessionTime() ? $scoTracking->getSessionTime() / 100 : $scoTracking->getSessionTime()
        );
    }

    public function generateScorm2004Evaluation(
        ResourceNode $node,
        User $user,
        $completionStatus = null,
        $successStatus = null,
        $score = null,
        $scoreMin = null,
        $scoreMax = null,
        $sessionTime = null
    ) {
        switch ($completionStatus) {
            case 'incomplete':
                $status = $completionStatus;
                break;
            case 'completed':
                if (in_array($successStatus, ['passed', 'failed'])) {
                    $status = $successStatus;
                } else {
                    $status = $completionStatus;
                }
                break;
            case 'not attempted':
                $status = 'not_attempted';
                break;
            default:
                $status = 'unknown';
        }
        $duration = null;

        if (!is_null($sessionTime)) {
            $time = new \DateInterval($sessionTime);
            $computedTime = new \DateTime();
            $computedTime->setTimestamp(0);
            $computedTime->add($time);
            $duration = $computedTime->getTimestamp();
        }
        $this->resourceEvalManager->createResourceEvaluation(
            $node,
            $user,
            new \DateTime(),
            $status,
            $score,
            $scoreMin,
            $scoreMax,
            null,
            null,
            $duration
        );
    }

    /***********************************************
     * Access to Scorm12ResourceRepository methods *
     ***********************************************/

    public function getNbScorm12WithHashName($hashName)
    {
        return $this->scorm12ResourceRepo->getNbScormWithHashName($hashName);
    }

    /**************************************************
     * Access to Scorm12ScoTrackingRepository methods *
     **************************************************/

    public function getScorm12TrackingsByResource(Scorm12Resource $resource)
    {
        return $this->scorm12ScoTrackingRepo->findTrackingsByResource($resource);
    }

    public function getAllScorm12ScoTrackingsByUserAndResource(User $user, Scorm12Resource $resource)
    {
        return $this->scorm12ScoTrackingRepo->findAllTrackingsByUserAndResource($user, $resource);
    }

    public function getScorm12ScoTrackingByUserAndSco(User $user, Scorm12Sco $sco)
    {
        return $this->scorm12ScoTrackingRepo->findOneBy(['user' => $user->getId(), 'sco' => $sco->getId()]);
    }

    /*************************************************
     * Access to Scorm2004ResourceRepository methods *
     *************************************************/

    public function getNbScorm2004WithHashName($hashName)
    {
        return $this->scorm2004ResourceRepo->getNbScormWithHashName($hashName);
    }

    /****************************************************
     * Access to Scorm2004ScoTrackingRepository methods *
     ****************************************************/

    public function getScorm2004TrackingsByResource(Scorm2004Resource $resource)
    {
        return $this->scorm2004ScoTrackingRepo->findTrackingsByResource($resource);
    }

    public function getAllScorm2004ScoTrackingsByUserAndResource(User $user, Scorm2004Resource $resource)
    {
        return $this->scorm2004ScoTrackingRepo->findAllTrackingsByUserAndResource($user, $resource);
    }

    public function getScorm2004ScoTrackingByUserAndSco(User $user, Scorm2004Sco $sco)
    {
        return $this->scorm2004ScoTrackingRepo->findOneBy(['user' => $user->getId(), 'sco' => $sco->getId()]);
    }

    /***********************************
     * Access to LogRepository methods *
     ***********************************/

    public function getScoLastSessionDate(User $user, ResourceNode $resourceNode, $type, $scoId)
    {
        $lastSessionDate = null;

        switch ($type) {
            case 'scorm12':
                $action = 'resource-scorm_12-sco_result';
                break;
            case 'scorm2004':
                $action = 'resource-scorm_2004-sco_result';
                break;
            default:
                $action = null;
        }

        $logs = $this->logRepo->findBy(['action' => $action, 'receiver' => $user, 'resourceNode' => $resourceNode], ['dateLog' => 'desc']);

        foreach ($logs as $log) {
            $details = $log->getDetails();

            if (!isset($details['scoId']) || intval($details['scoId']) === intval($scoId)) {
                $lastSessionDate = $log->getDateLog();
                break;
            }
        }

        return $lastSessionDate;
    }

    public function getScormTrackingDetails(User $user, ResourceNode $resourceNode, $type = 'scorm12')
    {
        switch ($type) {
            case 'scorm12':
                $action = 'resource-scorm_12-sco_result';
                break;
            case 'scorm2004':
                $action = 'resource-scorm_2004-sco_result';
                break;
            default:
                $action = null;
        }

        return $this->logRepo->findBy(['action' => $action, 'receiver' => $user, 'resourceNode' => $resourceNode], ['dateLog' => 'desc']);
    }

    public function generateScosFromScormArchive(\SplFileInfo $file, $version)
    {
        return '1.2' === $version ? $this->generateScos12FromScormArchive($file) : $this->generateScos2004FromScormArchive($file);
    }

    /**
     * Parses imsmanifest.xml file of a Scorm archive and
     * creates Scos defined in it.
     *
     * @param SplFileInfo $file
     *
     * @return array of Scorm resources
     */
    private function generateScos12FromScormArchive(\SplFileInfo $file)
    {
        $contents = '';
        $zip = new \ZipArchive();

        $zip->open($file);
        $stream = $zip->getStream('imsmanifest.xml');

        while (!feof($stream)) {
            $contents .= fread($stream, 2);
        }
        $dom = new \DOMDocument();

        if (!$dom->loadXML($contents)) {
            throw new InvalidScormArchiveException('cannot_load_imsmanifest_message');
        }

        $scormVersionElements = $dom->getElementsByTagName('schemaversion');

        if ($scormVersionElements->length > 0
            && '1.2' !== $scormVersionElements->item(0)->textContent) {
            throw new InvalidScormArchiveException('invalid_scorm_version_12_message');
        }

        $scos = $this->libsco12->parseOrganizationsNode($dom);

        return $scos;
    }

    /**
     * Parses imsmanifest.xml file of a Scorm archive and
     * creates Scos defined in it.
     *
     * @param UploadedFile $file
     *
     * @return array of Scorm resources
     */
    private function generateScos2004FromScormArchive(UploadedFile $file)
    {
        $contents = '';
        $zip = new \ZipArchive();
        $zip->open($file);
        $stream = $zip->getStream('imsmanifest.xml');
        while (!feof($stream)) {
            $contents .= fread($stream, 2);
        }
        $dom = new \DOMDocument();
        if (!$dom->loadXML($contents)) {
            throw new InvalidScormArchiveException('cannot_load_imsmanifest_message');
        }
        $scormVersionElements = $dom->getElementsByTagName('schemaversion');
        if ($scormVersionElements->length > 0
            && 'CAM 1.3' !== $scormVersionElements->item(0)->textContent
            && '2004 3rd Edition' !== $scormVersionElements->item(0)->textContent
            && '2004 4th Edition' !== $scormVersionElements->item(0)->textContent) {
            throw new InvalidScormArchiveException('invalid_scorm_version_2004_message');
        }

        $scos = $this->libsco2004->parseOrganizationsNode($dom);

        return $scos;
    }

    /**
     * Associates SCORM resource to SCOs and persists them.
     * As array $scos can also contain an array of scos
     * this method is call recursively when an element is an array.
     *
     * @param Scorm12Resource $scormResource
     * @param array           $scos          Array of Scorm12Sco
     */
    private function persistOldScos(ScormResource $scormResource, array $scos)
    {
        foreach ($scos as $sco) {
            if (is_array($sco)) {
                $this->persistOldScos($scormResource, $sco);
            } else {
                $sco->setScormResource($scormResource);
                $this->om->persist($sco);
            }
        }
    }
}
