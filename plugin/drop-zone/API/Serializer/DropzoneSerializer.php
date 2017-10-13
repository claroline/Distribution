<?php

namespace Claroline\DropZoneBundle\API\Serializer;

use Claroline\DropZoneBundle\Entity\Dropzone;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.dropzone")
 * @DI\Tag("claroline.serializer")
 */
class DropzoneSerializer
{
    /**
     * @param Dropzone $dropzone
     *
     * @return array
     */
    public function serialize(Dropzone $dropzone)
    {
        return [
            'id' => $dropzone->getUuid(),
            'parameters' => $this->getParameters($dropzone),
            'display' => $this->getDisplay($dropzone),
            'notifications' => $this->getNotifications($dropzone),
        ];
    }

    /**
     * @param array    $data
     * @param Dropzone $dropzone
     *
     * @return Dropzone
     */
    public function deserialize(array $data, Dropzone $dropzone = null)
    {
        $dropzone = $dropzone ?: new Dropzone();

        return $dropzone;
//        $announce = $announce ?: new Announcement();
//
//        $announce->setTitle($data['title']);
//        $announce->setContent($data['content']);
//        $announce->setAnnouncer($data['meta']['author']);
//
//        if (empty($announce->getCreator())) {
//            $currentUser = $this->tokenStorage->getToken()->getUser();
//            if ($currentUser instanceof User) {
//                // only get authenticated user
//                $announce->setCreator($currentUser);
//            }
//        }
//
//        // calculate visibility restrictions
//        $announce->setVisible($data['restrictions']['visible']);
//
//        $visibleFrom = null;
//        if (!empty($data['restrictions']['visibleFrom'])) {
//            $visibleFrom = \DateTime::createFromFormat('Y-m-d\TH:i:s', $data['restrictions']['visibleFrom']);
//        }
//        $announce->setVisibleFrom($visibleFrom);
//
//        $visibleUntil = null;
//        if (!empty($data['restrictions']['visibleUntil'])) {
//            $visibleUntil = \DateTime::createFromFormat('Y-m-d\TH:i:s', $data['restrictions']['visibleUntil']);
//        }
//        $announce->setVisibleFrom($visibleUntil);
//
//        // calculate publication date
//        if (!$announce->isVisible()) {
//            $announce->setPublicationDate(null);
//        } else {
//            $now = new \DateTime();
//            if (empty($announce->getVisibleFrom()) || $announce->getVisibleFrom() < $now) {
//                $announce->setPublicationDate($now);
//            } else {
//                $announce->setPublicationDate($announce->getVisibleFrom());
//            }
//        }
//
//        return $announce;
    }

    private function getParameters(Dropzone $dropzone)
    {
        $parameters = [];
        $parameters['editionState'] = $dropzone->getEditionState();
        $parameters['workspaceResourceEnabled'] = $dropzone->isWorkspaceResourceEnabled();
        $parameters['uploadEnabled'] = $dropzone->isUploadEnabled();
        $parameters['urlEnabled'] = $dropzone->isUrlEnabled();
        $parameters['richTextEnabled'] = $dropzone->isRichTextEnabled();
        $parameters['peerReview'] = $dropzone->getPeerReview();
        $parameters['expectedCorrectionTotal'] = $dropzone->getExpectedCorrectionTotal();
        $parameters['scoreToPass'] = $dropzone->getScoreToPass();
        $parameters['manualPlanning'] = $dropzone->getManualPlanning();
        $parameters['manualState'] = $dropzone->getManualState();
        $parameters['dropStartDate'] = $dropzone->getDropStartDate();
        $parameters['dropEndDate'] = $dropzone->getDropEndDate();
        $parameters['reviewStartDate'] = $dropzone->getReviewStartDate();
        $parameters['reviewEndDate'] = $dropzone->getReviewEndDate();
        $parameters['commentInCorrectionEnabled'] = $dropzone->isCommentInCorrectionEnabled();
        $parameters['commentInCorrectionForced'] = $dropzone->isCommentInCorrectionForced();
        $parameters['correctionDenialEnabled'] = $dropzone->isCorrectionDenialEnabled();
        $parameters['criteriaColumnTotal'] = $dropzone->getCriteriaColumnTotal();
        $parameters['autoCloseOpenedDropsWhenTimeIsUp'] = $dropzone->getAutoCloseOpenedDropsWhenTimeIsUp();
        $parameters['autoCloseState'] = $dropzone->getAutoCloseState();

        return $parameters;
    }

    private function getDisplay(Dropzone $dropzone)
    {
        $display = [];
        $display['instruction'] = $dropzone->getInstruction();
        $display['correctionInstruction'] = $dropzone->getCorrectionInstruction();
        $display['successMessage'] = $dropzone->getSuccessMessage();
        $display['failMessage'] = $dropzone->getFailMessage();
        $display['displayNotationToLearners'] = $dropzone->getDisplayNotationToLearners();
        $display['displayNotationMessageToLearners'] = $dropzone->getDisplayNotationMessageToLearners();
        $display['displayCorrectionsToLearners'] = $dropzone->getDisplayCorrectionsToLearners();

        return $display;
    }

    private function getNotifications(Dropzone $dropzone)
    {
        $notifications = [
            'enabled' => $dropzone->getNotifyOnDrop(),
            'actions' => ['drop'],
        ];

        return $notifications;
    }
}
