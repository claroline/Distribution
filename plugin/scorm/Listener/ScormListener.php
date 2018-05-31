<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\ScormBundle\Listener;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\AbstractResourceEvaluation;
use Claroline\CoreBundle\Event\CreateFormResourceEvent;
use Claroline\CoreBundle\Event\CreateResourceEvent;
use Claroline\CoreBundle\Event\GenericDataEvent;
use Claroline\CoreBundle\Event\Resource\CopyResourceEvent;
use Claroline\CoreBundle\Event\Resource\DeleteResourceEvent;
use Claroline\CoreBundle\Event\Resource\DownloadResourceEvent;
use Claroline\CoreBundle\Event\Resource\OpenResourceEvent;
use Claroline\CoreBundle\Manager\Resource\ResourceEvaluationManager;
use Claroline\ScormBundle\Entity\Scorm;
use Claroline\ScormBundle\Form\ScormType;
use Claroline\ScormBundle\Listener\Exception\InvalidScormArchiveException;
use Claroline\ScormBundle\Manager\ScormManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Bundle\TwigBundle\TwigEngine;
use Symfony\Component\Form\FormError;
use Symfony\Component\Form\FormFactory;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * @DI\Service
 */
class ScormListener
{
    /** @var string */
    private $filesDir;
    /** @var FormFactory */
    private $formFactory;
    /** @var ObjectManager */
    private $om;
    /** @var Request */
    private $request;
    /** @var UrlGeneratorInterface */
    private $router;
    /** @var ScormManager */
    private $scormManager;
    /** @var TwigEngine */
    private $templating;
    /** @var TranslatorInterface */
    private $translator;
    /** @var ResourceEvaluationManager */
    private $resourceEvalManager;
    /** @var string */
    private $uploadDir;

    private $scormRepo;
    private $scoTrackingRepo;

    /**
     * @DI\InjectParams({
     *     "filesDir"            = @DI\Inject("%claroline.param.files_directory%"),
     *     "formFactory"         = @DI\Inject("form.factory"),
     *     "om"                  = @DI\Inject("claroline.persistence.object_manager"),
     *     "requestStack"        = @DI\Inject("request_stack"),
     *     "router"              = @DI\Inject("router"),
     *     "scormManager"        = @DI\Inject("claroline.manager.scorm_manager"),
     *     "templating"          = @DI\Inject("templating"),
     *     "translator"          = @DI\Inject("translator"),
     *     "resourceEvalManager" = @DI\Inject("claroline.manager.resource_evaluation_manager"),
     *     "uploadDir"           = @DI\Inject("%claroline.param.uploads_directory%")
     * })
     *
     * @param string                    $filesDir
     * @param FormFactory               $formFactory
     * @param ObjectManager             $om
     * @param RequestStack              $requestStack
     * @param UrlGeneratorInterface     $router
     * @param ScormManager              $scormManager
     * @param TwigEngine                $templating
     * @param TranslatorInterface       $translator
     * @param ResourceEvaluationManager $resourceEvalManager
     * @param string                    $uploadDir
     */
    public function __construct(
        $filesDir,
        FormFactory $formFactory,
        ObjectManager $om,
        RequestStack $requestStack,
        UrlGeneratorInterface $router,
        ScormManager $scormManager,
        TwigEngine $templating,
        TranslatorInterface $translator,
        ResourceEvaluationManager $resourceEvalManager,
        $uploadDir
    ) {
        $this->filesDir = $filesDir;
        $this->formFactory = $formFactory;
        $this->om = $om;
        $this->request = $requestStack->getMasterRequest();
        $this->router = $router;
        $this->scormManager = $scormManager;
        $this->templating = $templating;
        $this->translator = $translator;
        $this->resourceEvalManager = $resourceEvalManager;
        $this->uploadDir = $uploadDir;
//        $this->scormResourcesPath = $this->container
//            ->getParameter('claroline.param.uploads_directory').'/scormresources/';

        $this->scormRepo = $om->getRepository('ClarolineScormBundle:Scorm');
        $this->scoTrackingRepo = $om->getRepository('ClarolineScormBundle:ScoTracking');
    }

    /**
     * @DI\Observe("create_form_claroline_scorm")
     *
     * @param CreateFormResourceEvent $event
     */
    public function onCreateForm(CreateFormResourceEvent $event)
    {
        $form = $this->formFactory->create(new ScormType(), new Scorm());
        $content = $this->templating->render(
            'ClarolineCoreBundle:resource:create_form.html.twig',
            [
                'form' => $form->createView(),
                'resourceType' => 'claroline_scorm',
            ]
        );
        $event->setResponseContent($content);
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("create_claroline_scorm")
     *
     * @param CreateResourceEvent $event
     */
    public function onCreate(CreateResourceEvent $event)
    {
        $form = $this->formFactory->create(new ScormType(), new Scorm());
        $form->handleRequest($this->request);

        try {
            if ($form->isValid()) {
                $tmpFile = $form->get('file')->getData();

                if ($this->isScormArchive($tmpFile)) {
                    $scorm = $this->scormManager->createScorm($tmpFile, $form->get('name')->getData());
                    $event->setResources([$scorm]);
                    $event->stopPropagation();

                    return;
                }
            }
        } catch (InvalidScormArchiveException $e) {
            $msg = $e->getMessage();
            $errorMsg = $this->translator->trans(
                $msg,
                [],
                'resource'
            );
            $form->addError(new FormError($errorMsg));
        }
        $content = $this->templating->render(
            'ClarolineCoreBundle:resource:create_form.html.twig',
            [
                'form' => $form->createView(),
                'resourceType' => $event->getResourceType(),
            ]
        );
        $event->setErrorFormContent($content);
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("open_claroline_scorm")
     *
     * @param OpenResourceEvent $event
     */
    public function onOpen(OpenResourceEvent $event)
    {
        $scorm = $event->getResource();
        $content = $this->templating->render(
            'ClarolineScormBundle::scorm.html.twig', [
                '_resource' => $scorm,
            ]
        );

        $event->setResponse(new Response($content));
        $event->stopPropagation();
    }

//    /**
//     * @DI\Observe("delete_claroline_scorm")
//     *
//     * @param DeleteResourceEvent $event
//     */
//    public function onDelete(DeleteResourceEvent $event)
//    {
//        $hashName = $event->getResource()->getHashName();
//        $scormArchiveFile = $this->filePath.$hashName;
//        $scormResourcesPath = $this->scormResourcesPath.$hashName;
//
//        $nbScorm = (int) ($this->scormResourceRepo->getNbScormWithHashName($hashName));
//
//        if (1 === $nbScorm) {
//            if (file_exists($scormArchiveFile)) {
//                $event->setFiles([$scormArchiveFile]);
//            }
//            if (file_exists($scormResourcesPath)) {
//                $this->deleteFiles($scormResourcesPath);
//            }
//        }
//        $this->om->remove($event->getResource());
//        $event->stopPropagation();
//    }
//
//    /**
//     * @DI\Observe("copy_claroline_scorm")
//     *
//     * @param CopyResourceEvent $event
//     */
//    public function onCopy(CopyResourceEvent $event)
//    {
//        $resource = $event->getResource();
//        $copy = new Scorm12Resource();
//        $copy->setHashName($resource->getHashName());
//        $copy->setName($resource->getName());
//        $this->om->persist($copy);
//
//        $scos = $resource->getScos();
//
//        foreach ($scos as $sco) {
//            if (is_null($sco->getScoParent())) {
//                $this->copySco($sco, $copy);
//            }
//        }
//
//        $event->setCopy($copy);
//        $event->stopPropagation();
//    }
//
//    /**
//     * @DI\Observe("download_claroline_scorm")
//     *
//     * @param DownloadResourceEvent $event
//     */
//    public function onDownload(DownloadResourceEvent $event)
//    {
//        $event->setItem($this->filePath.$event->getResource()->getHashName());
//        $event->setExtension('zip');
//        $event->stopPropagation();
//    }
//
//    /**
//     * @DI\Observe("generate_resource_user_evaluation_claroline_scorm")
//     *
//     * @param GenericDataEvent $event
//     */
//    public function onGenerateResourceTracking(GenericDataEvent $event)
//    {
//        $data = $event->getData();
//        $node = $data['resourceNode'];
//        $user = $data['user'];
//        $startDate = $data['startDate'];
//
//        $logs = $this->resourceEvalManager->getLogsForResourceTracking(
//            $node,
//            $user,
//            ['resource-read', 'resource-scorm-sco_result'],
//            $startDate
//        );
//
//        if (count($logs) > 0) {
//            $this->om->startFlushSuite();
//            $tracking = $this->resourceEvalManager->getResourceUserEvaluation($node, $user);
//            $tracking->setDate($logs[0]->getDateLog());
//            $nbAttempts = 0;
//            $nbOpenings = 0;
//            $status = AbstractResourceEvaluation::STATUS_UNKNOWN;
//            $score = null;
//            $scoreMin = null;
//            $scoreMax = null;
//            $totalTime = null;
//            $statusValues = [
//                'not attempted' => 0,
//                'unknown' => 1,
//                'browsed' => 2,
//                'incomplete' => 3,
//                'failed' => 4,
//                'completed' => 5,
//                'passed' => 6,
//            ];
//
//            foreach ($logs as $log) {
//                switch ($log->getAction()) {
//                    case 'resource-read':
//                        ++$nbOpenings;
//                        break;
//                    case 'resource-scorm_12-sco_result':
//                        ++$nbAttempts;
//                        $details = $log->getDetails();
//
//                        if (isset($details['bestScore']) && (empty($score) || $details['bestScore'] > $score)) {
//                            $score = $details['bestScore'];
//                            $scoreMin = isset($details['scoreMin']) ? $details['scoreMin'] : null;
//                            $scoreMax = isset($details['scoreMax']) ? $details['scoreMax'] : null;
//                        }
//                        if (isset($details['totalTime']) && (empty($totalTime) || $details['totalTime'] > $totalTime)) {
//                            $totalTime = $details['totalTime'];
//                        }
//                        if (isset($details['bestStatus']) && ($statusValues[$details['bestStatus']] > $statusValues[$status])) {
//                            $status = $details['bestStatus'];
//                        }
//                        break;
//                }
//            }
//            switch ($status) {
//                case 'passed':
//                case 'failed':
//                case 'completed':
//                case 'incomplete':
//                    break;
//                case 'not attempted':
//                    $status = AbstractResourceEvaluation::STATUS_NOT_ATTEMPTED;
//                    break;
//                case 'browsed':
//                    $status = AbstractResourceEvaluation::STATUS_OPENED;
//                    break;
//                default:
//                    $status = AbstractResourceEvaluation::STATUS_UNKNOWN;
//            }
//            $tracking->setStatus($status);
//            $tracking->setScore($score);
//            $tracking->setScoreMin($scoreMin);
//            $tracking->setScoreMax($scoreMax);
//
//            if ($totalTime) {
//                $tracking->setDuration($totalTime / 100);
//            }
//            $tracking->setNbAttempts($nbAttempts);
//            $tracking->setNbOpenings($nbOpenings);
//            $this->om->persist($tracking);
//            $this->om->endFlushSuite();
//        }
//        $event->stopPropagation();
//    }

    /**
     * Checks if a UploadedFile is a zip archive that contains a
     * imsmanifest.xml file in its root directory.
     *
     * @param UploadedFile $file
     *
     * @return bool
     *
     * @throws InvalidScormArchiveException
     */
    private function isScormArchive(UploadedFile $file)
    {
        $zip = new \ZipArchive();
        $openValue = $zip->open($file);

        $isScormArchive = (true === $openValue) && $zip->getStream('imsmanifest.xml');

        if (!$isScormArchive) {
            throw new InvalidScormArchiveException('invalid_scorm_archive_message');
        }

        return true;
    }

//    /**
//     * Deletes recursively a directory and its content.
//     *
//     * @param $dirPath The path to the directory to delete
//     */
//    private function deleteFiles($dirPath)
//    {
//        foreach (glob($dirPath.'/*') as $content) {
//            if (is_dir($content)) {
//                $this->deleteFiles($content);
//            } else {
//                unlink($content);
//            }
//        }
//        rmdir($dirPath);
//    }
//
//    /**
//     * Copy given sco and its children.
//     *
//     * @param Scorm12Sco      $sco
//     * @param Scorm12Resource $resource
//     * @param Scorm12Sco      $scoParent
//     */
//    private function copySco(
//        Scorm12Sco $sco,
//        Scorm12Resource $resource,
//        Scorm12Sco $scoParent = null
//    ) {
//        $scoCopy = new Scorm12Sco();
//        $scoCopy->setScormResource($resource);
//        $scoCopy->setScoParent($scoParent);
//        $scoCopy->setEntryUrl($sco->getEntryUrl());
//        $scoCopy->setIdentifier($sco->getIdentifier());
//        $scoCopy->setIsBlock($sco->getIsBlock());
//        $scoCopy->setLaunchData($sco->getLaunchData());
//        $scoCopy->setMasteryScore($sco->getMasteryScore());
//        $scoCopy->setMaxTimeAllowed($sco->getMaxTimeAllowed());
//        $scoCopy->setParameters($sco->getParameters());
//        $scoCopy->setPrerequisites($sco->getPrerequisites());
//        $scoCopy->setTimeLimitAction($sco->getTimeLimitAction());
//        $scoCopy->setTitle($sco->getTitle());
//        $scoCopy->setVisible($sco->isVisible());
//        $this->om->persist($scoCopy);
//
//        foreach ($sco->getScoChildren() as $scoChild) {
//            $this->copySco($scoChild, $resource, $scoCopy);
//        }
//    }
}
