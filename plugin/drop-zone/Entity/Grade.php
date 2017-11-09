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
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(
 *     name="claro_dropzonebundle_grade",
 *     uniqueConstraints={
 *         @ORM\UniqueConstraint(name="unique_grade_for_criterion_and_correction", columns={"criterion_id", "correction_id"})
 *     }
 * )
 */
class Grade
{
    use UuidTrait;

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(name="grade_value", type="integer", nullable=false)
     */
    protected $value = 0;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Claroline\DropZoneBundle\Entity\Correction",
     *     inversedBy="grades"
     * )
     * @ORM\JoinColumn(name="correction_id", nullable=false, onDelete="CASCADE")
     */
    protected $correction;

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\DropZoneBundle\Entity\Criterion")
     * @ORM\JoinColumn(name="criterion_id", nullable=false, onDelete="CASCADE")
     */
    protected $criterion;

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getValue()
    {
        return $this->value;
    }

    public function setValue($value)
    {
        $this->value = $value;
    }

    public function getCorrection()
    {
        return $this->correction;
    }

    public function setCorrection(Correction $correction)
    {
        $this->correction = $correction;
    }

    public function getCriterion()
    {
        return $this->criterion;
    }

    public function setCriterion(Criterion $criterion)
    {
        $this->criterion = $criterion;
    }
}
