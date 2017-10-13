<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\DropZoneBundle\Entity;

use Claroline\CoreBundle\Entity\Model\UuidTrait;
use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity
 * @ORM\Table(name="claro_dropzonebundle_dropzone")
 */
class Dropzone extends AbstractResource
{
    use UuidTrait;

    const MANUAL_STATE_NOT_STARTED = 'notStarted';
    const MANUAL_STATE_PEER_REVIEW = 'peerReview';
    const MANUAL_STATE_ALLOW_DROP = 'allowDrop';
    const MANUAL_STATE_ALLOW_DROP_AND_PEER_REVIEW = 'allowDropAndPeerReview';
    const MANUAL_STATE_FINISHED = 'finished';

    const AUTO_CLOSED_STATE_WAITING = 'waiting';
    const AUTO_CLOSED_STATE_CLOSED = 'autoClosed';

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * 1 = common
     * 2 = criteria
     * 3 = participant
     * 4 = finished.
     *
     * @ORM\Column(name="edition_state", type="smallint", nullable=false)
     */
    protected $editionState = 1;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    protected $instruction = null;

    /**
     * @ORM\Column(name="correction_instruction",type="text", nullable=true)
     */
    protected $correctionInstruction = null;

    /**
     * @ORM\Column(name="success_message",type="text", nullable=true)
     */
    protected $successMessage = null;

    /**
     * @ORM\Column(name="fail_message",type="text", nullable=true)
     */
    protected $failMessage = null;

    /**
     * @ORM\Column(name="workspace_resource_enabled", type="boolean", nullable=false)
     */
    protected $workspaceResourceEnabled = false;

    /**
     * @ORM\Column(name="upload_enabled", type="boolean", nullable=false)
     */
    protected $uploadEnabled = true;

    /**
     * @ORM\Column(name="url_enabled", type="boolean", nullable=false)
     */
    protected $urlEnabled = false;

    /**
     * @ORM\Column(name="rich_text_enabled", type="boolean", nullable=false)
     */
    protected $richTextEnabled = false;

    /**
     * @ORM\Column(name="peer_review", type="boolean", nullable=false)
     */
    protected $peerReview = false;

    /**
     * @ORM\Column(name="expected_correction_total", type="smallint", nullable=false)
     * @Assert\Range(
     *      min = 1,
     *      max = 10
     * )
     */
    protected $expectedCorrectionTotal = 3;

    /**
     * @ORM\Column(name="display_notation_to_learners", type="boolean", nullable=false)
     */
    protected $displayNotationToLearners = true;

    /**
     * @ORM\Column(name="display_notation_message_to_learners", type="boolean", nullable=false)
     */
    protected $displayNotationMessageToLearners = false;

    /**
     * @ORM\Column(name="score_to_pass", type="float", nullable=false)
     * @Assert\Range(
     *      min = 0,
     *      max = 20
     * )
     */
    protected $scoreToPass = 10;

    /**
     * @ORM\Column(name="manual_planning", type="boolean", nullable=false)
     */
    protected $manualPlanning = true;

    /**
     * @ORM\Column(name="manual_state", type="string", nullable=false)
     */
    protected $manualState = 'notStarted';

    /**
     * @ORM\Column(name="drop_start_date", type="datetime", nullable=true)
     */
    protected $dropStartDate = null;

    /**
     * @ORM\Column(name="drop_end_date", type="datetime", nullable=true)
     */
    protected $dropEndDate = null;

    /**
     * @ORM\Column(name="review_start_date", type="datetime", nullable=true)
     */
    protected $reviewStartDate = null;

    /**
     * @ORM\Column(name="review_end_date", type="datetime", nullable=true)
     */
    protected $reviewEndDate = null;

    /**
     * @ORM\Column(name="comment_in_correction_enabled", type="boolean", nullable=false)
     */
    protected $commentInCorrectionEnabled = false;

    /**
     * @ORM\Column(name="comment_in_correction_forced",type="boolean",nullable=false)
     */
    protected $commentInCorrectionForced = false;

    /**
     * @ORM\Column(name="display_corrections_to_learners", type="boolean", nullable=false)
     */
    protected $displayCorrectionsToLearners = false;

    /**
     * Depend on diplayCorrectionsToLearners, need diplayCorrectionsToLearners to be true in order to work.
     * Allow users to flag that they are not agree with the correction.
     *
     * @ORM\Column(name="correction_denial_enabled",type="boolean",nullable=false)
     */
    protected $correctionDenialEnabled = false;

    /**
     * @ORM\Column(name="criteria_column_total", type="smallint", nullable=false)
     * @Assert\LessThanOrEqual(value=10)
     * @Assert\GreaterThanOrEqual(value=3)
     */
    protected $criteriaColumnTotal = 4;

    /**
     * if true,
     * when time is up, all drop not already closed will be closed and flaged as uncompletedDrop.
     * That will allow them to access the next step ( correction by users or admins ).
     *
     * @ORM\Column(name="auto_close_opened_drops_when_time_is_up", type="boolean", nullable=false)
     */
    protected $autoCloseOpenedDropsWhenTimeIsUp = false;

    /**
     * @ORM\Column(name="auto_close_state", type="string", nullable=false)
     */
    protected $autoCloseState = self::AUTO_CLOSED_STATE_WAITING;

    /**
     * Notify Evaluation admins when a someone made a drop
     *
     * @ORM\Column(name="notify_on_drop", type="boolean", nullable=false)
     */
    protected $notifyOnDrop = false;

    /**
     * Dropzone constructor.
     */
    public function __construct()
    {
        $this->refreshUuid();
    }

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getEditionState()
    {
        return $this->editionState;
    }

    public function setEditionState($editionState)
    {
        $this->editionState = $editionState;
    }

    public function getInstruction()
    {
        return $this->instruction;
    }

    public function setInstruction($instruction)
    {
        $this->instruction = $instruction;
    }

    public function getCorrectionInstruction()
    {
        return $this->correctionInstruction;
    }

    public function setCorrectionInstruction($correctionInstruction)
    {
        $this->correctionInstruction = $correctionInstruction;
    }

    public function getSuccessMessage()
    {
        return $this->successMessage;
    }

    public function setSuccessMessage($successMessage)
    {
        $this->successMessage = $successMessage;
    }

    public function getFailMessage()
    {
        return $this->failMessage;
    }

    public function setFailMessage($failMessage)
    {
        $this->failMessage = $failMessage;
    }

    public function isWorkspaceResourceEnabled()
    {
        return $this->workspaceResourceEnabled;
    }

    public function setWorkspaceResourceEnabled($workspaceResourceEnabled)
    {
        $this->workspaceResourceEnabled = $workspaceResourceEnabled;
    }

    public function isUploadEnabled()
    {
        return $this->uploadEnabled;
    }

    public function setUploadEnabled($uploadEnabled)
    {
        $this->uploadEnabled = $uploadEnabled;
    }

    public function isUrlEnabled()
    {
        return $this->urlEnabled;
    }

    public function setUrlEnabled($urlEnabled)
    {
        $this->urlEnabled = $urlEnabled;
    }

    public function isRichTextEnabled()
    {
        return $this->richTextEnabled;
    }

    public function setRichTextEnabled($richTextEnabled)
    {
        $this->richTextEnabled = $richTextEnabled;
    }

    public function getPeerReview()
    {
        return $this->peerReview;
    }

    public function setPeerReview($peerReview)
    {
        $this->peerReview = $peerReview;
    }

    public function getExpectedCorrectionTotal()
    {
        return $this->expectedCorrectionTotal;
    }

    public function setExpectedCorrectionTotal($expectedCorrectionTotal)
    {
        $this->expectedCorrectionTotal = $expectedCorrectionTotal;
    }

    public function getDisplayNotationToLearners()
    {
        return $this->displayNotationToLearners;
    }

    public function setDisplayNotationToLearners($displayNotationToLearners)
    {
        $this->displayNotationToLearners = $displayNotationToLearners;
    }

    public function getDisplayNotationMessageToLearners()
    {
        return $this->displayNotationMessageToLearners;
    }

    public function setDisplayNotationMessageToLearners($displayNotationMessageToLearners)
    {
        $this->displayNotationMessageToLearners = $displayNotationMessageToLearners;
    }

    public function getScoreToPass()
    {
        return $this->scoreToPass;
    }

    public function setScoreToPass($scoreToPass)
    {
        $this->scoreToPass = $scoreToPass;
    }

    public function getManualPlanning()
    {
        return $this->manualPlanning;
    }

    public function setManualPlanning($manualPlanning)
    {
        $this->manualPlanning = $manualPlanning;
    }

    public function getManualState()
    {
        return $this->manualState;
    }

    public function setManualState($manualState)
    {
        $this->manualState = $manualState;
    }

    public function getDropStartDate()
    {
        return $this->dropStartDate;
    }

    public function setDropStartDate(\DateTime $dropStartDate = null)
    {
        $this->dropStartDate = $dropStartDate;
    }

    public function getDropEndDate()
    {
        return $this->dropEndDate;
    }

    public function setDropEndDate(\DateTime $dropEndDate = null)
    {
        $this->dropEndDate = $dropEndDate;
    }

    public function getReviewStartDate()
    {
        return $this->reviewStartDate;
    }

    public function setReviewStartDate(\DateTime $reviewStartDate = null)
    {
        $this->reviewStartDate = $reviewStartDate;
    }

    public function getReviewEndDate()
    {
        return $this->reviewEndDate;
    }

    public function setReviewEndDate(\DateTime $reviewEndDate = null)
    {
        $this->reviewEndDate = $reviewEndDate;
    }

    public function isCommentInCorrectionEnabled()
    {
        return $this->commentInCorrectionEnabled;
    }

    public function setCommentInCorrectionEnabled($commentInCorrectionEnabled)
    {
        $this->commentInCorrectionEnabled = $commentInCorrectionEnabled;
    }

    public function isCommentInCorrectionForced()
    {
        return $this->commentInCorrectionForced;
    }

    public function setCommentInCorrectionForced($commentInCorrectionForced)
    {
        $this->commentInCorrectionForced = $commentInCorrectionForced;
    }

    public function getDisplayCorrectionsToLearners()
    {
        return $this->displayCorrectionsToLearners;
    }

    public function setDisplayCorrectionsToLearners($displayCorrectionsToLearners)
    {
        $this->displayCorrectionsToLearners = $displayCorrectionsToLearners;
    }

    public function isCorrectionDenialEnabled()
    {
        return $this->correctionDenialEnabled;
    }

    public function setCorrectionDenialEnabled($correctionDenialEnabled)
    {
        $this->correctionDenialEnabled = $correctionDenialEnabled;
    }

    public function getCriteriaColumnTotal()
    {
        return $this->criteriaColumnTotal;
    }

    public function setCriteriaColumnTotal($criteriaColumnTotal)
    {
        $this->criteriaColumnTotal = $criteriaColumnTotal;
    }

    public function getAutoCloseOpenedDropsWhenTimeIsUp()
    {
        return $this->autoCloseOpenedDropsWhenTimeIsUp;
    }

    public function setAutoCloseOpenedDropsWhenTimeIsUp($autoCloseOpenedDropsWhenTimeIsUp)
    {
        $this->autoCloseOpenedDropsWhenTimeIsUp = $autoCloseOpenedDropsWhenTimeIsUp;
    }

    public function getAutoCloseState()
    {
        return $this->autoCloseState;
    }

    public function setAutoCloseState($autoCloseState)
    {
        $this->autoCloseState = $autoCloseState;
    }

    public function getNotifyOnDrop()
    {
        return $this->notifyOnDrop;
    }

    public function setNotifyOnDrop($notifyOnDrop)
    {
        $this->notifyOnDrop = $notifyOnDrop;
    }
}
