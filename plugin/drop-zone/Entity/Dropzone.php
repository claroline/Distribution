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

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * Score to obtain to pass.
     *
     * @ORM\Column(name="success_score", type="float", nullable=true)
     *
     * @var float
     */
    private $successScore;

    /**
     * @ORM\Column(type="json_array", nullable=true)
     */
    protected $details;

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

    public function getCorrectionType()
    {
        return $this->correctionType;
    }

    public function setCorrectionType($correctionType)
    {
        $this->correctionType = $correctionType;
    }

    public function getSuccessScore()
    {
        return $this->successScore;
    }

    public function setSuccessScore($successScore)
    {
        $this->successScore = $successScore;
    }

    public function getDetails()
    {
        return $this->details;
    }

    public function setDetails($details)
    {
        $this->details = $details;
    }

    public function getInstruction()
    {
        return !is_null($this->details) && isset($this->details['instruction']) ? $this->details['instruction'] : null;
    }

    public function setInstruction($instruction)
    {
        if (is_null($this->details)) {
            $this->details = [];
        }
        $this->details['instruction'] = $instruction;
    }

    public function getCorrectionInstruction()
    {
        return !is_null($this->details) && isset($this->details['correctionInstruction']) ? $this->details['correctionInstruction'] : null;
    }

    public function setCorrectionInstruction($correctionInstruction)
    {
        if (is_null($this->details)) {
            $this->details = [];
        }
        $this->details['correctionInstruction'] = $correctionInstruction;
    }

    public function getSuccessMessage()
    {
        return !is_null($this->details) && isset($this->details['successMessage']) ? $this->details['successMessage'] : null;
    }

    public function setSuccessMessage($successMessage)
    {
        if (is_null($this->details)) {
            $this->details = [];
        }
        $this->details['successMessage'] = $successMessage;
    }

    public function getFailMessage()
    {
        return !is_null($this->details) && isset($this->details['failMessage']) ? $this->details['failMessage'] : null;
    }

    public function setFailMessage($failMessage)
    {
        if (is_null($this->details)) {
            $this->details = [];
        }
        $this->details['failMessage'] = $failMessage;
    }

    public function isWorkspaceResouceAllowed()
    {
        return !is_null($this->details) && isset($this->details['workspaceResourceAllowed']) ? $this->details['workspaceResourceAllowed'] : false;
    }

    public function setWorkspaceResouceAllowed($workspaceResourceAllowed)
    {
        if (is_null($this->details)) {
            $this->details = [];
        }
        $this->details['uploadAllowed'] = $workspaceResourceAllowed;
    }

    public function isUploadAllowed()
    {
        return !is_null($this->details) && isset($this->details['uploadAllowed']) ? $this->details['uploadAllowed'] : true;
    }

    public function setUploadAllowed($uploadAllowed)
    {
        if (is_null($this->details)) {
            $this->details = [];
        }
        $this->details['uploadAllowed'] = $uploadAllowed;
    }

    public function isUrlAllowed()
    {
        return !is_null($this->details) && isset($this->details['urlAllowed']) ? $this->details['urlAllowed'] : false;
    }

    public function setUrlAllowed($urlAllowed)
    {
        if (is_null($this->details)) {
            $this->details = [];
        }
        $this->details['urlAllowed'] = $urlAllowed;
    }

    public function isRichTextAllowed()
    {
        return !is_null($this->details) && isset($this->details['richTextAllowed']) ? $this->details['richTextAllowed'] : false;
    }

    public function setRichTextAllowe($richTextAllowed)
    {
        if (is_null($this->details)) {
            $this->details = [];
        }
        $this->details['richTextAllowed'] = $richTextAllowed;
    }

    public function getPeerReview()
    {
        return !is_null($this->details) && isset($this->details['peerReview']) ? $this->details['peerReview'] : false;
    }

    public function setPeerReview($peerReview)
    {
        if (is_null($this->details)) {
            $this->details = [];
        }
        $this->details['peerReview'] = $peerReview;
    }

    public function getExpectedCorrectionCount()
    {
        return !is_null($this->details) && isset($this->details['expectedCorrectionCount']) ? $this->details['expectedCorrectionCount'] : 3;
    }

    public function setExpectedCorrectionCount($expectedCorrectionCount)
    {
        if (is_null($this->details)) {
            $this->details = [];
        }
        $this->details['expectedCorrectionCount'] = $expectedCorrectionCount;
    }

    public function getDisplayScoreToLearners()
    {
        return !is_null($this->details) && isset($this->details['displayScoreToLearners']) ? $this->details['displayScoreToLearners'] : true;
    }

    public function setDisplayScoreToLearners($displayScoreToLearners)
    {
        if (is_null($this->details)) {
            $this->details = [];
        }
        $this->details['displayScoreToLearners'] = $displayScoreToLearners;
    }

    public function getDisplayScoreMessageToLearners()
    {
        return !is_null($this->details) && isset($this->details['displayScoreMessageToLearners']) ? $this->details['displayScoreMessageToLearners'] : false;
    }

    public function setDisplayScoreMessageToLearners($displayScoreMessageToLearners)
    {
        if (is_null($this->details)) {
            $this->details = [];
        }
        $this->details['displayScoreMessageToLearners'] = $displayScoreMessageToLearners;
    }

    public function getManualPlanning()
    {
        return !is_null($this->details) && isset($this->details['manualPlanning']) ? $this->details['manualPlanning'] : true;
    }

    public function setManualPlanning($manualPlanning)
    {
        if (is_null($this->details)) {
            $this->details = [];
        }
        $this->details['manualPlanning'] = $manualPlanning;
    }

    public function getManualState()
    {
        return !is_null($this->details) && isset($this->details['manualState']) ? $this->details['manualState'] : 'notStarted';
    }

    public function setManualState($manualState)
    {
        if (is_null($this->details)) {
            $this->details = [];
        }
        $this->details['manualState'] = $manualState;
    }

    public function getDropStartDate()
    {
        return !is_null($this->details) && isset($this->details['dropStartDate']) ? $this->details['dropStartDate'] : null;
    }

    public function setDropStartDate($dropStartDate)
    {
        if (is_null($this->details)) {
            $this->details = [];
        }
        $this->details['dropStartDate'] = $dropStartDate;
    }

    public function getDropEndDate()
    {
        return !is_null($this->details) && isset($this->details['dropEndDate']) ? $this->details['dropEndDate'] : null;
    }

    public function setDropEndDate($dropEndDate)
    {
        if (is_null($this->details)) {
            $this->details = [];
        }
        $this->details['dropEndDate'] = $dropEndDate;
    }

    public function getReviewStartDate()
    {
        return !is_null($this->details) && isset($this->details['reviewStartDate']) ? $this->details['reviewStartDate'] : null;
    }

    public function setReviewStartDate($reviewStartDate)
    {
        if (is_null($this->details)) {
            $this->details = [];
        }
        $this->details['reviewStartDate'] = $reviewStartDate;
    }

    public function getReviewEndDate()
    {
        return !is_null($this->details) && isset($this->details['reviewEndDate']) ? $this->details['reviewEndDate'] : null;
    }

    public function setReviewEndDate($reviewEndDate)
    {
        if (is_null($this->details)) {
            $this->details = [];
        }
        $this->details['reviewEndDate'] = $reviewEndDate;
    }

    public function isCorrectionCommentAllowed()
    {
        return !is_null($this->details) && isset($this->details['correctionCommentAllowed']) ? $this->details['correctionCommentAllowed'] : false;
    }

    public function setCorrectionCommentAllowed($correctionCommentAllowed)
    {
        if (is_null($this->details)) {
            $this->details = [];
        }
        $this->details['correctionCommentAllowed'] = $correctionCommentAllowed;
    }

    public function isCorrectionCommentForced()
    {
        return !is_null($this->details) && isset($this->details['correctionCommentForced']) ? $this->details['correctionCommentForced'] : false;
    }

    public function setCorrectionCommentForced($correctionCommentForced)
    {
        if (is_null($this->details)) {
            $this->details = [];
        }
        $this->details['correctionCommentForced'] = $correctionCommentForced;
    }
}
