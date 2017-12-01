<?php

namespace Claroline\DropZoneBundle\API\Serializer;

use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\DropZoneBundle\Entity\Dropzone;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.dropzone")
 * @DI\Tag("claroline.serializer")
 */
class DropzoneSerializer
{
    private $criterionSerializer;
    private $dropzoneRepo;

    /**
     * DropzoneSerializer constructor.
     *
     * @DI\InjectParams({
     *     "criterionSerializer" = @DI\Inject("claroline.serializer.dropzone.criterion"),
     *     "om"                  = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param CriterionSerializer $criterionSerializer
     * @param ObjectManager       $om
     */
    public function __construct(CriterionSerializer $criterionSerializer, ObjectManager $om)
    {
        $this->criterionSerializer = $criterionSerializer;
        $this->dropzoneRepo = $om->getRepository('Claroline\DropZoneBundle\Entity\Dropzone');
    }

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
            'criteria' => $this->getCriteria($dropzone),
        ];
    }

    /**
     * @param string $class
     * @param array  $data
     *
     * @return Dropzone
     */
    public function deserialize($class, $data)
    {
        if (isset($data['id']) && $data['id']) {
            $dropzone = $this->dropzoneRepo->findOneBy(['uuid' => $data['id']]);
        }
        $dropzone = $dropzone ?: new Dropzone();

        if (isset($data['parameters'])) {
            if (isset($data['parameters']['editionState'])) {
                $dropzone->setEditionState($data['parameters']['editionState']);
            }
            if (isset($data['parameters']['workspaceResourceEnabled'])) {
                $dropzone->setWorkspaceResourceEnabled($data['parameters']['workspaceResourceEnabled']);
            }
            if (isset($data['parameters']['uploadEnabled'])) {
                $dropzone->setUploadEnabled($data['parameters']['uploadEnabled']);
            }
            if (isset($data['parameters']['urlEnabled'])) {
                $dropzone->setUrlEnabled($data['parameters']['urlEnabled']);
            }
            if (isset($data['parameters']['richTextEnabled'])) {
                $dropzone->setRichTextEnabled($data['parameters']['richTextEnabled']);
            }
            if (isset($data['parameters']['peerReview'])) {
                $dropzone->setPeerReview($data['parameters']['peerReview']);
            }
            if (isset($data['parameters']['expectedCorrectionTotal'])) {
                $dropzone->setExpectedCorrectionTotal($data['parameters']['expectedCorrectionTotal']);
            }
            if (isset($data['parameters']['scoreMax'])) {
                $dropzone->setScoreMax($data['parameters']['scoreMax']);
            }
            if (isset($data['parameters']['scoreToPass'])) {
                $dropzone->setScoreToPass($data['parameters']['scoreToPass']);
            }
            if (isset($data['parameters']['dropType'])) {
                $dropzone->setDropType($data['parameters']['dropType']);
            }
            if (isset($data['parameters']['manualPlanning'])) {
                $dropzone->setManualPlanning($data['parameters']['manualPlanning']);
            }
            if (isset($data['parameters']['manualState'])) {
                $dropzone->setManualState($data['parameters']['manualState']);
            }
            if (isset($data['parameters']['dropStartDate'])) {
                $dropStartDate = !empty($data['parameters']['dropStartDate']) ?
                    new \DateTime($data['parameters']['dropStartDate']) :
                    null;
                $dropzone->setDropStartDate($dropStartDate);
            }
            if (isset($data['parameters']['dropEndDate'])) {
                $dropEndDate = !empty($data['parameters']['dropEndDate']) ?
                    new \DateTime($data['parameters']['dropEndDate']) :
                    null;
                $dropzone->setDropEndDate($dropEndDate);
            }
            if (isset($data['parameters']['reviewStartDate'])) {
                $reviewStartDate = !empty($data['parameters']['reviewStartDate']) ?
                    new \DateTime($data['parameters']['reviewStartDate']) :
                    null;
                $dropzone->setReviewStartDate($reviewStartDate);
            }
            if (isset($data['parameters']['reviewEndDate'])) {
                $reviewEndDate = !empty($data['parameters']['reviewEndDate']) ?
                    new \DateTime($data['parameters']['reviewEndDate']) :
                    null;
                $dropzone->setReviewEndDate($reviewEndDate);
            }
            if (isset($data['parameters']['commentInCorrectionEnabled'])) {
                $dropzone->setCommentInCorrectionEnabled($data['parameters']['commentInCorrectionEnabled']);
            }
            if (isset($data['parameters']['commentInCorrectionForced'])) {
                $dropzone->setCommentInCorrectionForced($data['parameters']['commentInCorrectionForced']);
            }
            if (isset($data['parameters']['correctionDenialEnabled'])) {
                $dropzone->setCorrectionDenialEnabled($data['parameters']['correctionDenialEnabled']);
            }
            if (isset($data['parameters']['criteriaEnabled'])) {
                $dropzone->setCriteriaEnabled($data['parameters']['criteriaEnabled']);
            }
            if (isset($data['parameters']['criteriaTotal'])) {
                $dropzone->setCriteriaTotal($data['parameters']['criteriaTotal']);
            }
            if (isset($data['parameters']['autoCloseDropsAtDropEndDate'])) {
                $dropzone->setAutoCloseDropsAtDropEndDate($data['parameters']['autoCloseDropsAtDropEndDate']);
            }
            if (isset($data['parameters']['autoCloseState'])) {
                $dropzone->setAutoCloseState($data['parameters']['autoCloseState']);
            }
        }
        if (isset($data['display'])) {
            if (isset($data['display']['instruction'])) {
                $dropzone->setInstruction($data['display']['instruction']);
            }
            if (isset($data['display']['correctionInstruction'])) {
                $dropzone->setCorrectionInstruction($data['display']['correctionInstruction']);
            }
            if (isset($data['display']['successMessage'])) {
                $dropzone->setSuccessMessage($data['display']['successMessage']);
            }
            if (isset($data['display']['failMessage'])) {
                $dropzone->setFailMessage($data['display']['failMessage']);
            }
            if (isset($data['display']['displayNotationToLearners'])) {
                $dropzone->setDisplayNotationToLearners($data['display']['displayNotationToLearners']);
            }
            if (isset($data['display']['displayNotationMessageToLearners'])) {
                $dropzone->setDisplayNotationMessageToLearners($data['display']['displayNotationMessageToLearners']);
            }
            if (isset($data['display']['displayCorrectionsToLearners'])) {
                $dropzone->setDisplayCorrectionsToLearners($data['display']['displayCorrectionsToLearners']);
            }
        }
        if (isset($data['notifications'])) {
            $notifyOnDrop = isset($data['notifications']['enabled']) &&
                $data['notifications']['enabled'] &&
                isset($data['notifications']['actions']) &&
                is_array($data['notifications']['actions']) &&
                in_array('drop', $data['notifications']['actions']);
            $dropzone->setNotifyOnDrop($notifyOnDrop);
        }
        $dropzone->emptyCriteria();

        if (isset($data['parameters']['criteriaEnabled']) && $data['parameters']['criteriaEnabled'] && isset($data['criteria'])) {
            $this->deserializeCriteria($dropzone, $data['criteria']);
        }

        return $dropzone;
    }

    private function getParameters(Dropzone $dropzone)
    {
        $parameters = [];
        $parameters['editionState'] = $dropzone->getEditionState();
        $parameters['workspaceResourceEnabled'] = $dropzone->isWorkspaceResourceEnabled();
        $parameters['uploadEnabled'] = $dropzone->isUploadEnabled();
        $parameters['urlEnabled'] = $dropzone->isUrlEnabled();
        $parameters['richTextEnabled'] = $dropzone->isRichTextEnabled();
        $parameters['peerReview'] = $dropzone->isPeerReview();
        $parameters['expectedCorrectionTotal'] = $dropzone->getExpectedCorrectionTotal();
        $parameters['scoreMax'] = $dropzone->getScoreMax();
        $parameters['scoreToPass'] = $dropzone->getScoreToPass();
        $parameters['dropType'] = $dropzone->getDropType();
        $parameters['manualPlanning'] = $dropzone->getManualPlanning();
        $parameters['manualState'] = $dropzone->getManualState();
        $parameters['dropStartDate'] = $dropzone->getDropStartDate() ? $dropzone->getDropStartDate()->format('Y-m-d H:i') : null;
        $parameters['dropEndDate'] = $dropzone->getDropEndDate() ? $dropzone->getDropEndDate()->format('Y-m-d H:i') : null;
        $parameters['reviewStartDate'] = $dropzone->getReviewStartDate() ? $dropzone->getReviewStartDate()->format('Y-m-d H:i') : null;
        $parameters['reviewEndDate'] = $dropzone->getReviewEndDate() ? $dropzone->getReviewEndDate()->format('Y-m-d H:i') : null;
        $parameters['commentInCorrectionEnabled'] = $dropzone->isCommentInCorrectionEnabled();
        $parameters['commentInCorrectionForced'] = $dropzone->isCommentInCorrectionForced();
        $parameters['correctionDenialEnabled'] = $dropzone->isCorrectionDenialEnabled();
        $parameters['criteriaEnabled'] = $dropzone->isCriteriaEnabled();
        $parameters['criteriaTotal'] = $dropzone->getCriteriaTotal();
        $parameters['autoCloseDropsAtDropEndDate'] = $dropzone->getAutoCloseDropsAtDropEndDate();
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

    private function getCriteria(Dropzone $dropzone)
    {
        $criteria = [];

        foreach ($dropzone->getCriteria() as $criterion) {
            $criteria[] = $this->criterionSerializer->serialize($criterion);
        }

        return $criteria;
    }

    private function deserializeCriteria(Dropzone $dropzone, $criteriaData)
    {
        foreach ($criteriaData as $criterionData) {
            $criterion = $this->criterionSerializer->deserialize('Claroline\DropZoneBundle\Entity\Criterion', $criterionData);
            $dropzone->addCriterion($criterion);
        }
    }
}
