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
use Claroline\CoreBundle\Entity\Resource\ResourceRights;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Manager\Resource\ResourceEvaluationManager;
use Claroline\CoreBundle\Manager\ResourceManager;
use Claroline\ScormBundle\Entity\Sco;
use Claroline\ScormBundle\Entity\Scorm;
use Claroline\ScormBundle\Entity\Scorm12Resource;
use Claroline\ScormBundle\Entity\Scorm12Sco;
use Claroline\ScormBundle\Entity\Scorm12ScoTracking;
use Claroline\ScormBundle\Entity\Scorm2004Resource;
use Claroline\ScormBundle\Entity\Scorm2004Sco;
use Claroline\ScormBundle\Entity\Scorm2004ScoTracking;
use Claroline\ScormBundle\Entity\ScoTracking;
use Claroline\ScormBundle\Library\Scorm12;
use Claroline\ScormBundle\Library\Scorm2004;
use Claroline\ScormBundle\Library\ScormLib;
use Claroline\ScormBundle\Manager\Exception\InvalidScormArchiveException;
use Claroline\ScormBundle\Serializer\ScoSerializer;
use Claroline\ScormBundle\Serializer\ScoTrackingSerializer;
use JMS\DiExtraBundle\Annotation as DI;
use Ramsey\Uuid\Uuid;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * @DI\Service("claroline.manager.scorm_manager")
 */
class ScormManager
{
    /** @var Filesystem */
    private $fileSystem;
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
    /** @var ResourceManager */
    private $resourceManager;
    /** @var ScormLib */
    private $scormLib;
    /** @var ScoSerializer */
    private $scoSerializer;
    /** @var ScoTrackingSerializer */
    private $scoTrackingSerializer;
    /** @var string */
    private $uploadDir;

    private $scormResourcesPath;

    private $scoTrackingRepo;
    private $scorm12ResourceRepo;
    private $scorm12ScoTrackingRepo;
    private $scorm2004ResourceRepo;
    private $scorm2004ScoTrackingRepo;
    private $shortcutRepo;
    private $logRepo;

    /**
     * Constructor.
     *
     * @DI\InjectParams({
     *     "fileSystem"            = @DI\Inject("filesystem"),
     *     "filesDir"              = @DI\Inject("%claroline.param.files_directory%"),
     *     "libsco12"              = @DI\Inject("claroline.library.scorm_12"),
     *     "libsco2004"            = @DI\Inject("claroline.library.scorm_2004"),
     *     "om"                    = @DI\Inject("claroline.persistence.object_manager"),
     *     "resourceEvalManager"   = @DI\Inject("claroline.manager.resource_evaluation_manager"),
     *     "resourceManager"       = @DI\Inject("claroline.manager.resource_manager"),
     *     "scormLib"              = @DI\Inject("claroline.library.scorm"),
     *     "scoSerializer"         = @DI\Inject("claroline.serializer.scorm.sco"),
     *     "scoTrackingSerializer" = @DI\Inject("claroline.serializer.scorm.sco.tracking"),
     *     "uploadDir"             = @DI\Inject("%claroline.param.uploads_directory%")
     * })
     *
     * @param Filesystem                $fileSystem
     * @param string                    $filesDir
     * @param Scorm12                   $libsco12
     * @param Scorm2004                 $libsco2004
     * @param ObjectManager             $om
     * @param ResourceEvaluationManager $resourceEvalManager
     * @param ResourceManager           $resourceManager
     * @param ScormLib                  $scormLib
     * @param ScoSerializer             $scoSerializer
     * @param ScoTrackingSerializer     $scoTrackingSerializer
     * @param string                    $uploadDir
     */
    public function __construct(
        Filesystem $fileSystem,
        $filesDir,
        Scorm12 $libsco12,
        Scorm2004 $libsco2004,
        ObjectManager $om,
        ResourceEvaluationManager $resourceEvalManager,
        ResourceManager $resourceManager,
        ScormLib $scormLib,
        ScoSerializer $scoSerializer,
        ScoTrackingSerializer $scoTrackingSerializer,
        $uploadDir
    ) {
        $this->fileSystem = $fileSystem;
        $this->filesDir = $filesDir;
        $this->libsco12 = $libsco12;
        $this->libsco2004 = $libsco2004;
        $this->om = $om;
        $this->resourceEvalManager = $resourceEvalManager;
        $this->resourceManager = $resourceManager;
        $this->scormLib = $scormLib;
        $this->scoSerializer = $scoSerializer;
        $this->scoTrackingSerializer = $scoTrackingSerializer;
        $this->uploadDir = $uploadDir;

        $this->scormResourcesPath = $uploadDir.DIRECTORY_SEPARATOR.'scormresources'.DIRECTORY_SEPARATOR;

        $this->scoTrackingRepo = $om->getRepository('ClarolineScormBundle:ScoTracking');
        $this->scorm12ResourceRepo = $om->getRepository('ClarolineScormBundle:Scorm12Resource');
        $this->scorm12ScoTrackingRepo = $om->getRepository('ClarolineScormBundle:Scorm12ScoTracking');
        $this->scorm2004ResourceRepo = $om->getRepository('ClarolineScormBundle:Scorm2004Resource');
        $this->scorm2004ScoTrackingRepo = $om->getRepository('ClarolineScormBundle:Scorm2004ScoTracking');
        $this->shortcutRepo = $om->getRepository('ClarolineLinkBundle:Resource\Shortcut');
        $this->logRepo = $om->getRepository('ClarolineCoreBundle:Log\Log');
    }

    public function uploadScormArchive(Workspace $workspace, UploadedFile $file)
    {
        $error = null;

        // Checks if it is a valid scorm archive
        $zip = new \ZipArchive();
        $openValue = $zip->open($file);

        $isScormArchive = (true === $openValue) && $zip->getStream('imsmanifest.xml');

        if (!$isScormArchive) {
            throw new InvalidScormArchiveException('invalid_scorm_archive_message');
        } else {
            return $this->generateScorm($workspace, $file);
        }
    }

    public function generateScorm(Workspace $workspace, UploadedFile $file)
    {
        $ds = DIRECTORY_SEPARATOR;
        $hashName = Uuid::uuid4()->toString().'.zip';
        $scormData = $this->parseScormArchive($file);
        $this->unzipScormArchive($workspace, $file, $hashName);
        // Move Scorm archive in the files directory
        $file->move($this->filesDir.$ds.'scorm'.$ds.$workspace->getUuid(), $hashName);

        return [
            'hashName' => $hashName,
            'version' => $scormData['version'],
            'scos' => $scormData['scos'],
        ];
    }

    public function generateScosTrackings(array $scos, User $user = null, &$trackings = [])
    {
        if (!is_null($user)) {
            $this->om->startFlushSuite();
        }

        foreach ($scos as $sco) {
            $tracking = null;

            if (!is_null($user)) {
                $tracking = $this->scoTrackingRepo->findOneBy(['sco' => $sco, 'user' => $user]);
            }
            if (is_null($tracking)) {
                $tracking = $this->createScoTracking($sco, $user);
            }
            $trackings[$sco->getUuid()] = $this->scoTrackingSerializer->serialize($tracking);
            $scoChildren = $sco->getScoChildren()->toArray();

            if (0 < count($scoChildren)) {
                $this->generateScosTrackings($scoChildren, $user, $trackings);
            }
        }
        if (!is_null($user)) {
            $this->om->endFlushSuite();
        }

        return $trackings;
    }

    public function parseScormArchive(UploadedFile $file)
    {
        $data = [];
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

        if (1 === $scormVersionElements->length) {
            switch ($scormVersionElements->item(0)->textContent) {
                case '1.2':
                    $data['version'] = Scorm::SCORM_12;
                    break;
                case 'CAM 1.3':
                case '2004 3rd Edition':
                case '2004 4th Edition':
                    $data['version'] = Scorm::SCORM_2004;
                    break;
                default:
                    throw new InvalidScormArchiveException('invalid_scorm_version_message');
            }
        } else {
            throw new InvalidScormArchiveException('invalid_scorm_version_message');
        }
        $scos = $this->scormLib->parseOrganizationsNode($dom);

        if (0 >= count($scos)) {
            throw new InvalidScormArchiveException('no_sco_in_scorm_archive_message');
        }
        $data['scos'] = array_map(function (Sco $sco) {
            return $this->scoSerializer->serialize($sco);
        }, $scos);

        return $data;
    }

    public function createScoTracking(Sco $sco, User $user = null)
    {
        $version = $sco->getScorm()->getVersion();
        $scoTracking = new ScoTracking();
        $scoTracking->setSco($sco);

        switch ($version) {
            case Scorm::SCORM_12:
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
            case Scorm::SCORM_2004:
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

    /* TODO : copies archive & unzipped files */
    public function convertAllScorm12($withLogs = true)
    {
        $scormType = $this->resourceManager->getResourceTypeByName('claroline_scorm');
        $allScorm12 = $this->scorm12ResourceRepo->findAll();

        $this->om->startFlushSuite();
        $i = 1;

        foreach ($allScorm12 as $scorm) {
            $node = $scorm->getResourceNode();

            if ($node->isActive()) {
                $scosMapping = [];

                /* Copies ResourceNode */
                $newNode = new ResourceNode();
                $newNode->setAccesses($node->getAccesses());
                $newNode->setAccessibleFrom($node->getAccessibleFrom());
                $newNode->setAccessibleUntil($node->getAccessibleUntil());
                $newNode->setAuthor($node->getAuthor());
                $newNode->setClass('Claroline\ScormBundle\Entity\Scorm');
                $newNode->setClosable($node->getClosable());
                $newNode->setCloseTarget($node->getCloseTarget());
                $newNode->setCreationDate($node->getCreationDate());
                $newNode->setCreator($node->getCreator());
                $newNode->setDescription($node->getDescription());
                $newNode->setFullscreen($node->getFullscreen());
                $newNode->setIcon($node->getIcon());
                $newNode->setIndex($node->getIndex());
                $newNode->setLicense($node->getLicense());
                $newNode->setMimeType('custom/claroline_scorm');
                $newNode->setModificationDate($node->getModificationDate());
                $newNode->setName($node->getName());
                $newNode->setParent($node->getParent());
                $newNode->setPathForCreationLog($node->getPathForCreationLog());
                $newNode->setPublished($node->isPublished());
                $newNode->setPublishedToPortal($node->isPublishedToPortal());
                $newNode->setResourceType($scormType);
                $newNode->setWorkspace($node->getWorkspace());

                /* Copies rights */
                foreach ($node->getRights() as $rights) {
                    $newRights = new ResourceRights();
                    $newRights->setResourceNode($newNode);
                    $newRights->setMask($rights->getMask());
                    $newRights->setRole($rights->getRole());
                    $this->om->persist($newRights);
                }

                $shortcuts = $this->shortcutRepo->findBy(['target' => $node]);

                /* Updates shortcuts */
                foreach ($shortcuts as $shortcut) {
                    $shortcutNode = $shortcut->getResourceNode();
                    $shortcutNode->setMimeType('custom/claroline_scorm');
                    $shortcutNode->setResourceType($scormType);
                    $this->om->persist($shortcutNode);

                    $shortcut->setTarget($newNode);
                    $this->om->persist($shortcut);
                }
                $this->om->persist($newNode);

                /* Copies Scorm resource */
                $newScorm = new Scorm();
                $newScorm->setResourceNode($newNode);
                $newScorm->setVersion(Scorm::SCORM_12);
                /* TODO : Modify with new path */
                $newScorm->setHashName($scorm->getHashName());

                /* Copies Scos & creates an array to keep associations */
                foreach ($scorm->getScos() as $sco) {
                    $newSco = new Sco();
                    $newSco->setScorm($newScorm);
                    $newSco->setEntryUrl($sco->getEntryUrl());
                    $newSco->setIdentifier($sco->getIdentifier());
                    $newSco->setTitle($sco->getTitle());
                    $newSco->setVisible($sco->isVisible());
                    $newSco->setParameters($sco->getParameters());
                    $newSco->setPrerequisites($sco->getPrerequisites());
                    $newSco->setMaxTimeAllowed($sco->getMaxTimeAllowed());
                    $newSco->setTimeLimitAction($sco->getTimeLimitAction());
                    $newSco->setLaunchData($sco->getLaunchData());
                    $newSco->setScoreToPassInt($sco->getMasteryScore());
                    $newSco->setBlock($sco->getIsBlock());
                    $this->om->persist($newSco);

                    $scosMapping[$sco->getId()] = $newSco;
                }
                /* Maps new Scos parent */
                foreach ($scorm->getScos() as $sco) {
                    $scoParent = $sco->getScoParent();

                    if (!empty($scoParent)) {
                        $newScoParent = $scosMapping[$scoParent->getId()];
                        $scosMapping[$sco->getId()]->setScoParent($newScoParent);
                        $this->om->persist($scosMapping[$sco->getId()]);
                    }
                }

                /* Copies Scos Trackings */
                foreach ($scorm->getScos() as $sco) {
                    $trackings = $this->scorm12ScoTrackingRepo->findBy(['sco' => $sco]);

                    foreach ($trackings as $tracking) {
                        $newTracking = new ScoTracking();
                        $newTracking->setSco($scosMapping[$sco->getId()]);
                        $newTracking->setUser($tracking->getUser());
                        $newTracking->setScoreRaw($tracking->getScoreRaw());
                        $newTracking->setScoreMin($tracking->getScoreMin());
                        $newTracking->setScoreMax($tracking->getScoreMax());
                        $newTracking->setLessonStatus($tracking->getLessonStatus());
                        $newTracking->setSessionTime($tracking->getSessionTime());
                        $newTracking->setTotalTimeInt($tracking->getTotalTime());
                        $newTracking->setEntry($tracking->getEntry());
                        $newTracking->setSuspendData($tracking->getSuspendData());
                        $newTracking->setCredit($tracking->getCredit());
                        $newTracking->setExitMode($tracking->getExitMode());
                        $newTracking->setLessonLocation($tracking->getLessonLocation());
                        $newTracking->setLessonMode($tracking->getLessonMode());
                        $newTracking->setBestScoreRaw($tracking->getBestScoreRaw());
                        $newTracking->setBestLessonStatus($tracking->getBestLessonStatus());
                        $newTracking->setIsLocked($tracking->getIsLocked());
                        $this->om->persist($newTracking);
                    }
                }

                if ($withLogs) {
                    /* Updates logs */
                    foreach ($node->getLogs()->toArray() as $log) {
                        $log->setResourceNode($newNode);
                        $log->setResourceType($scormType);
                        $this->om->persist($log);
                    }
                }

                $this->om->persist($newScorm);

                /* Soft deletes old resource node */
                $node->setActive(false);
                $this->om->persist($node);

                if (0 === $i % 20) {
                    $this->om->forceFlush();
                }
                ++$i;
            }
        }
        $this->om->endFlushSuite();
    }

    /* TODO : copies archive & unzipped files */
    public function convertAllScorm2004($withLogs = true)
    {
        $scormType = $this->resourceManager->getResourceTypeByName('claroline_scorm');
        $allScorm2004 = $this->scorm2004ResourceRepo->findAll();

        $this->om->startFlushSuite();
        $i = 1;

        foreach ($allScorm2004 as $scorm) {
            $node = $scorm->getResourceNode();

            if ($node->isActive()) {
                $scosMapping = [];

                /* Copies ResourceNode */
                $newNode = new ResourceNode();
                $newNode->setAccesses($node->getAccesses());
                $newNode->setAccessibleFrom($node->getAccessibleFrom());
                $newNode->setAccessibleUntil($node->getAccessibleUntil());
                $newNode->setAuthor($node->getAuthor());
                $newNode->setClass('Claroline\ScormBundle\Entity\Scorm');
                $newNode->setClosable($node->getClosable());
                $newNode->setCloseTarget($node->getCloseTarget());
                $newNode->setCreationDate($node->getCreationDate());
                $newNode->setCreator($node->getCreator());
                $newNode->setDescription($node->getDescription());
                $newNode->setFullscreen($node->getFullscreen());
                $newNode->setIcon($node->getIcon());
                $newNode->setIndex($node->getIndex());
                $newNode->setLicense($node->getLicense());
                $newNode->setMimeType('custom/claroline_scorm');
                $newNode->setModificationDate($node->getModificationDate());
                $newNode->setName($node->getName());
                $newNode->setParent($node->getParent());
                $newNode->setPathForCreationLog($node->getPathForCreationLog());
                $newNode->setPublished($node->isPublished());
                $newNode->setPublishedToPortal($node->isPublishedToPortal());
                $newNode->setResourceType($scormType);
                $newNode->setWorkspace($node->getWorkspace());

                /* Copies rights */
                foreach ($node->getRights() as $rights) {
                    $newRights = new ResourceRights();
                    $newRights->setResourceNode($newNode);
                    $newRights->setMask($rights->getMask());
                    $newRights->setRole($rights->getRole());
                    $this->om->persist($newRights);
                }

                $shortcuts = $this->shortcutRepo->findBy(['target' => $node]);

                /* Updates shortcuts */
                foreach ($shortcuts as $shortcut) {
                    $shortcutNode = $shortcut->getResourceNode();
                    $shortcutNode->setMimeType('custom/claroline_scorm');
                    $shortcutNode->setResourceType($scormType);
                    $this->om->persist($shortcutNode);

                    $shortcut->setTarget($newNode);
                    $this->om->persist($shortcut);
                }
                $this->om->persist($newNode);

                /* Copies Scorm resource */
                $newScorm = new Scorm();
                $newScorm->setResourceNode($newNode);
                $newScorm->setVersion(Scorm::SCORM_2004);
                /* TODO : Modify with new path */
                $newScorm->setHashName($scorm->getHashName());

                /* Copies Scos & creates an array to keep associations */
                foreach ($scorm->getScos() as $sco) {
                    $newSco = new Sco();
                    $newSco->setScorm($newScorm);
                    $newSco->setEntryUrl($sco->getEntryUrl());
                    $newSco->setIdentifier($sco->getIdentifier());
                    $newSco->setTitle($sco->getTitle());
                    $newSco->setVisible($sco->isVisible());
                    $newSco->setParameters($sco->getParameters());
                    $newSco->setMaxTimeAllowed($sco->getMaxTimeAllowed());
                    $newSco->setTimeLimitAction($sco->getTimeLimitAction());
                    $newSco->setLaunchData($sco->getLaunchData());
                    $newSco->setScoreToPassDecimal($sco->getScaledPassingScore());
                    $newSco->setCompletionThreshold($sco->getCompletionThreshold());
                    $newSco->setBlock($sco->getIsBlock());
                    $this->om->persist($newSco);

                    $scosMapping[$sco->getId()] = $newSco;
                }
                /* Maps new Scos parent */
                foreach ($scorm->getScos() as $sco) {
                    $scoParent = $sco->getScoParent();

                    if (!empty($scoParent)) {
                        $newScoParent = $scosMapping[$scoParent->getId()];
                        $scosMapping[$sco->getId()]->setScoParent($newScoParent);
                        $this->om->persist($scosMapping[$sco->getId()]);
                    }
                }

                /* Copies Scos Trackings */
                foreach ($scorm->getScos() as $sco) {
                    $trackings = $this->scorm2004ScoTrackingRepo->findBy(['sco' => $sco]);

                    foreach ($trackings as $tracking) {
                        $newTracking = new ScoTracking();
                        $newTracking->setSco($scosMapping[$sco->getId()]);
                        $newTracking->setUser($tracking->getUser());
                        $newTracking->setScoreRaw($tracking->getScoreRaw());
                        $newTracking->setScoreMin($tracking->getScoreMin());
                        $newTracking->setScoreMax($tracking->getScoreMax());
                        $newTracking->setScoreScaled($tracking->getScoreScaled());
                        $newTracking->setCompletionStatus($tracking->getCompletionStatus());
                        $newTracking->setLessonStatus($tracking->getSuccessStatus());
                        $newTracking->setTotalTimeString($tracking->getTotalTime());
                        $newTracking->setDetails($tracking->getDetails());
                        $this->om->persist($newTracking);
                    }
                }

                if ($withLogs) {
                    /* Updates logs */
                    foreach ($node->getLogs()->toArray() as $log) {
                        $log->setResourceNode($newNode);
                        $log->setResourceType($scormType);
                        $this->om->persist($log);
                    }
                }

                $this->om->persist($newScorm);

                /* Soft deletes old resource node */
                $node->setActive(false);
                $this->om->persist($node);

                if (0 === $i % 20) {
                    $this->om->forceFlush();
                }
                ++$i;
            }
        }
        $this->om->endFlushSuite();
    }

    /**
     * Unzip a given ZIP file into the web resources directory.
     *
     * @param Workspace    $workspace
     * @param UploadedFile $file
     * @param string       $hashName  name of the destination directory
     */
    private function unzipScormArchive(Workspace $workspace, UploadedFile $file, $hashName)
    {
        $zip = new \ZipArchive();
        $zip->open($file);
        $destinationDir = $this->scormResourcesPath.$workspace->getUuid().DIRECTORY_SEPARATOR.$hashName;

        if (!file_exists($destinationDir)) {
            mkdir($destinationDir, 0777, true);
        }
        $zip->extractTo($destinationDir);
        $zip->close();
    }

    /***************
     * Old methods *
     ***************/

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
}
