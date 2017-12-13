<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Icap\DropzoneBundle\Command;

use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\DropZoneBundle\Entity\Dropzone;
use Icap\DropzoneBundle\Entity\Dropzone as IcapDropzone;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * Convert Icap Dropzone resources to Claroline Dropzone resources.
 */
class ConvertDropzoneCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this->setName('claroline:dropzone:convert')
            ->setDescription('Converts Dropzone resources from IcapDropzoneBundle to Dropzone resources from ClarolineDropZoneBundle');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $conversion = [
            IcapDropzone::MANUAL_STATE_NOT_STARTED => Dropzone::STATE_NOT_STARTED,
            IcapDropzone::MANUAL_STATE_ALLOW_DROP => Dropzone::STATE_ALLOW_DROP,
            IcapDropzone::MANUAL_STATE_FINISHED => Dropzone::STATE_FINISHED,
            IcapDropzone::MANUAL_STATE_PEER_REVIEW => Dropzone::STATE_PEER_REVIEW,
            IcapDropzone::MANUAL_STATE_ALLOW_DROP_AND_PEER_REVIEW => Dropzone::STATE_ALLOW_DROP_AND_PEER_REVIEW,
            IcapDropzone::AUTO_CLOSED_STATE_WAITING => Dropzone::AUTO_CLOSED_STATE_WAITING,
            IcapDropzone::AUTO_CLOSED_STATE_CLOSED => Dropzone::AUTO_CLOSED_STATE_CLOSED,
        ];

        $om = $this->getContainer()->get('claroline.persistence.object_manager');
        $dropzoneManager = $this->getContainer()->get('claroline.manager.dropzone_manager');
        $dropzoneRepo = $om->getRepository('Icap\DropzoneBundle\Entity\Dropzone');
        $allDropzones = $dropzoneRepo->findAll();

        $om->startFlushSuite();
        $i = 1;

        foreach ($allDropzones as $dropzone) {
            $node = $dropzone->getResourceNode();

            if ($node->isActive()) {
                /* Copy ResourceNode */
                /* TODO: lvl, shortcuts, path, rights */
                $newNode = new ResourceNode();
                $newNode->setAccesses($node->getAccesses());
                $newNode->setAccessibleFrom($node->getAccessibleFrom());
                $newNode->setAccessibleUntil($node->getAccessibleUntil());
                $newNode->setAuthor($node->getAuthor());
                $newNode->setClass($node->getClass());
                $newNode->setClosable($node->getClosable());
                $newNode->setCloseTarget($node->getCloseTarget());
                $newNode->setCreationDate($node->getCreationDate());
                $newNode->setCreator($node->getCreator());
                $newNode->setDescription($node->getDescription());
                $newNode->setFullscreen($node->getFullscreen());
                $newNode->setIcon($node->getIcon());
                $newNode->setIndex($node->getIndex());
                $newNode->setLicense($node->getLicense());
                $newNode->setMimeType($node->getMimeType());
                $newNode->setModificationDate($node->getModificationDate());
                $newNode->setName($node->getName());
                $newNode->setParent($node->getParent());
                $newNode->setPathForCreationLog($node->getPathForCreationLog());
                $newNode->setPublished($node->isPublished());
                $newNode->setPublishedToPortal($node->isPublishedToPortal());
                $newNode->setResourceType($node->getResourceType());
                $newNode->setWorkspace($node->getWorkspace());
                $om->persist($newNode);

                /* Copy Dropzone resource */
                $newDropzone = new Dropzone();
                $newDropzone->setResourceNode($newNode);
                $newDropzone->setEditionState($dropzone->getEditionState());
                $newDropzone->setInstruction($dropzone->getInstruction());
                $newDropzone->setCorrectionInstruction($dropzone->getCorrectionInstruction());
                $newDropzone->setSuccessMessage($dropzone->getSuccessMessage());
                $newDropzone->setFailMessage($dropzone->getFailMessage());
                $newDropzone->setWorkspaceResourceEnabled($dropzone->getAllowWorkspaceResource());
                $newDropzone->setUploadEnabled($dropzone->getAllowUpload());
                $newDropzone->setUrlEnabled($dropzone->getAllowUrl());
                $newDropzone->setRichTextEnabled($dropzone->getAllowRichText());
                $newDropzone->setPeerReview($dropzone->getPeerReview());
                $newDropzone->setExpectedCorrectionTotal($dropzone->getExpectedTotalCorrection());
                $newDropzone->setDisplayNotationToLearners($dropzone->getDisplayNotationToLearners());
                $newDropzone->setDisplayNotationMessageToLearners($dropzone->getDisplayNotationMessageToLearners());
                $newDropzone->setScoreToPass($dropzone->getMinimumScoreToPass());
                $newDropzone->setScoreMax(20);
                $newDropzone->setManualPlanning($dropzone->getManualPlanning());
                $newDropzone->setManualState($dropzone->getManualState());
                $newDropzone->setDropStartDate($dropzone->getStartAllowDrop());
                $newDropzone->setDropEndDate($dropzone->getEndAllowDrop());
                $newDropzone->setReviewStartDate($dropzone->getStartReview());
                $newDropzone->setReviewEndDate($dropzone->getEndReview());
                $newDropzone->setCommentInCorrectionEnabled($dropzone->getAllowCommentInCorrection());
                $newDropzone->setCommentInCorrectionForced($dropzone->getForceCommentInCorrection());
                $newDropzone->setDisplayCorrectionsToLearners($dropzone->getDiplayCorrectionsToLearners());
                $newDropzone->setCorrectionDenialEnabled($dropzone->getAllowCorrectionDeny());
                $newDropzone->setCriteriaEnabled($dropzone->hasCriteria());
                $newDropzone->setCriteriaTotal($dropzone->getTotalCriteriaColumn());
                $newDropzone->setAutoCloseDropsAtDropEndDate($dropzone->getAutoCloseOpenedDropsWhenTimeIsUp());
                $newDropzone->setAutoCloseState($dropzone->getAutoCloseState());
                $newDropzone->setNotifyOnDrop($dropzone->getNotifyOnDrop());

                /* TODO: Copy criteria */

                /* TODO: Copy drops & documents */
                /* TODO: Copy corrections & grades */
                /* TODO: Copy logs ? */
                /* TODO: Copy shortcuts ? */

                if ($i % 50 === 0) {
                    $om->forceFlush();
                }
                ++$i;
            }
        }

//        foreach ($coursesToDelete as $course) {
//            $sessionsToDelete = $course->getSessions();
//
//            foreach ($sessionsToDelete as $session) {
//                $sessionName = $session->getName();
//                $output->writeln("<info> Deleting training session [$sessionName]... </info>");
//                $cursusManager->deleteCourseSession($session, true);
//
//                if ($i % 100 === 0) {
//                    $om->forceFlush();
//                }
//                ++$i;
//            }
//            $courseTitle = $course->getTitle();
//            $output->writeln("<info> Deleting training [$courseTitle]... </info>");
//            $cursusManager->deleteCourse($course);
//
//            if ($i % 100 === 0) {
//                $om->forceFlush();
//            }
//            ++$i;
//        }
        $om->endFlushSuite();
    }
}
