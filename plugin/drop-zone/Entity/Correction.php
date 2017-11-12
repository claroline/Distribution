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
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\User;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="claro_dropzonebundle_correction")
 */
class Correction
{
    use UuidTrait;

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Claroline\DropZoneBundle\Entity\Drop",
     *     inversedBy="corrections"
     * )
     * @ORM\JoinColumn(name="drop_id", nullable=false, onDelete="CASCADE")
     */
    protected $drop;

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\CoreBundle\Entity\User")
     * @ORM\JoinColumn(name="user_id", nullable=true, onDelete="SET NULL")
     */
    protected $user;

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\CoreBundle\Entity\Role")
     * @ORM\JoinColumn(name="role_id", nullable=true, onDelete="SET NULL")
     */
    protected $role;

    /**
     * @ORM\Column(name="total_grade", type="decimal", scale=2, nullable=true)
     */
    protected $totalGrade;

    /**
     * @ORM\Column(name="correction_comment", type="text", nullable=true)
     */
    protected $comment;

    /**
     * @ORM\Column(name="is_valid", type="boolean", nullable=false)
     */
    protected $valid = true;

    /**
     * @ORM\Column(name="start_date", type="datetime", nullable=false)
     */
    protected $startDate;

    /**
     * @ORM\Column(name="last_open_date", type="datetime", nullable=false)
     */
    protected $lastOpenDate;

    /**
     * @ORM\Column(name="end_date", type="datetime", nullable=true)
     */
    protected $endDate;

    /**
     * @ORM\Column(type="boolean", nullable=false)
     */
    protected $finished = false;

    /**
     * @ORM\Column(type="boolean", nullable=false)
     */
    protected $editable = false;

    /**
     * @ORM\Column(type="boolean", nullable=false)
     */
    protected $reported = false;

    /**
     * @ORM\Column(name="reported_comment", type="text", nullable=true)
     */
    protected $reportedComment;

    /**
     * @ORM\Column(name="correction_denied", type="boolean", nullable=false)
     */
    protected $correctionDenied = false;

    /**
     * @ORM\Column(name="correction_denied_comment", type="text", nullable=true)
     */
    protected $correctionDeniedComment;

    /**
     * @ORM\OneToMany(
     *     targetEntity="Claroline\DropZoneBundle\Entity\Grade",
     *     mappedBy="correction",
     *     cascade={"persist"}
     * )
     */
    protected $grades;

    public function __construct()
    {
        $this->refreshUuid();
        $this->grades = new ArrayCollection();
    }

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getDrop()
    {
        return $this->drop;
    }

    public function setDrop(Drop $drop)
    {
        $this->drop = $drop;
    }

    public function getUser()
    {
        return $this->user;
    }

    public function setUser(User $user = null)
    {
        $this->user = $user;
    }

    public function getRole()
    {
        return $this->role;
    }

    public function setRole(Role $role = null)
    {
        $this->role = $role;
    }

    public function getTotalGrade()
    {
        return $this->totalGrade;
    }

    public function setTotalGrade($totalGrade)
    {
        $this->totalGrade = $totalGrade;
    }

    public function getComment()
    {
        return $this->comment;
    }

    public function setComment($comment)
    {
        $this->comment = $comment;
    }

    public function isValid()
    {
        return $this->valid;
    }

    public function setValid($valid)
    {
        $this->valid = $valid;
    }

    public function getStartDate()
    {
        return $this->startDate;
    }

    public function setStartDate(\DateTime $startDate)
    {
        $this->startDate = $startDate;
    }

    public function getLastOpenDate()
    {
        return $this->lastOpenDate;
    }

    public function setLastOpenDate(\DateTime $lastOpenDate)
    {
        $this->lastOpenDate = $lastOpenDate;
    }

    public function getEndDate()
    {
        return $this->endDate;
    }

    public function setEndDate(\DateTime $endDate = null)
    {
        $this->endDate = $endDate;
    }

    public function isFinished()
    {
        return $this->finished;
    }

    public function setFinished($finished)
    {
        $this->finished = $finished;
    }

    public function isEditable()
    {
        return $this->editable;
    }

    public function setEditable($editable)
    {
        $this->editable = $editable;
    }

    public function isReported()
    {
        return $this->reported;
    }

    public function setReported($reported)
    {
        $this->reported = $reported;
    }

    public function getReportedComment()
    {
        return $this->reportedComment;
    }

    public function setReportedComment($reportedComment)
    {
        $this->reportedComment = $reportedComment;
    }

    public function isCorrectionDenied()
    {
        return $this->correctionDenied;
    }

    public function setCorrectionDenied($correctionDenied)
    {
        $this->correctionDenied = $correctionDenied;
    }

    public function getCorrectionDeniedComment()
    {
        return $this->correctionDeniedComment;
    }

    public function setCorrectionDeniedComment($correctionDeniedComment)
    {
        $this->correctionDeniedComment = $correctionDeniedComment;
    }

    public function getGrades()
    {
        return $this->grades->toArray();
    }

    public function addGrade(Grade $grade)
    {
        if (!$this->grades->contains($grade)) {
            $this->grades->add($grade);
        }
    }

    public function removeGrade(Grade $grade)
    {
        if ($this->grades->contains($grade)) {
            $this->grades->removeElement($grade);
        }
    }

    public function emptyGrades()
    {
        $this->grades->clear();
    }
}
