<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CursusBundle\Entity;

use Claroline\CoreBundle\Entity\Model\UuidTrait;
use Claroline\CoreBundle\Entity\User;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(
 *     name="claro_cursusbundle_cursus_user",
 *     uniqueConstraints={
 *         @ORM\UniqueConstraint(
 *             name="cursus_user_unique_cursus_user",
 *             columns={"cursus_id", "user_id", "user_type"}
 *         )
 *     }
 * )
 */
class CursusUser
{
    use UuidTrait;

    const TYPE_LEARNER = 0;
    const TYPE_TEACHER = 1;

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Claroline\CoreBundle\Entity\User"
     * )
     * @ORM\JoinColumn(name="user_id", nullable=false, onDelete="CASCADE")
     */
    protected $user;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Claroline\CursusBundle\Entity\Cursus",
     *     inversedBy="cursusUsers"
     * )
     * @ORM\JoinColumn(name="cursus_id", nullable=false, onDelete="CASCADE")
     */
    protected $cursus;

    /**
     * @ORM\Column(name="registration_date", type="datetime", nullable=false)
     */
    protected $registrationDate;

    /**
     * @ORM\Column(name="user_type", type="integer", nullable=true)
     */
    protected $type = self::TYPE_LEARNER;

    public function __construct()
    {
        $this->refreshUuid();

        $this->registrationDate = new \DateTime();
    }

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getUser()
    {
        return $this->user;
    }

    public function setUser(User $user)
    {
        $this->user = $user;
    }

    public function getCursus()
    {
        return $this->cursus;
    }

    public function setCursus(Cursus $cursus)
    {
        $this->cursus = $cursus;
    }

    public function getRegistrationDate()
    {
        return $this->registrationDate;
    }

    public function setRegistrationDate($registrationDate)
    {
        $this->registrationDate = $registrationDate;
    }

    public function getType()
    {
        return $this->type;
    }

    public function setType($type)
    {
        $this->type = $type;
    }
}
