<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\ForumBundle\Entity;

use Claroline\CoreBundle\Entity\Model\UuidTrait;
use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity()
 * @ORM\Table(name="claro_forum")
 */
class Forum extends AbstractResource
{
    use UuidTrait;

    const VALIDATE_NONE = 1;
    const VALIDATE_PRIOR_ONCE = 2;
    const VALIDATE_PRIOR_ALL = 3;

    /**
     * @ORM\OneToMany(
     *     targetEntity="Claroline\ForumBundle\Entity\Subject",
     *     mappedBy="forum"
     * )
     * @ORM\OrderBy({"id" = "ASC"})
     */
    protected $subjects;

    /**
     * @ORM\Column(type="integer")
     */
    protected $validationMode = self::VALIDATE_NONE;

    /**
     * @ORM\Column(type="integer")
     */
    protected $maxComment = 10;

    public function __construct()
    {
        $this->subjects = new ArrayCollection();
        $this->refreshUuid();
    }

    public function getSubjects()
    {
        return $this->subjects;
    }

    public function addSubject(Subject $subject)
    {
        $this->subjects->add($subject);
    }

    public function removeSubject(Subject $subject)
    {
        $this->subjects->removeElement($subject);
    }

    public function setValidationMode($mode)
    {
        $this->validationMode = $mode;
    }

    public function getValidationMode()
    {
        return $this->validationMode;
    }

    public function setMaxComment($max)
    {
        $this->maxComment = $max;
    }

    public function getMaxComment()
    {
        return $this->maxComment;
    }
}
