<?php

namespace Claroline\CursusBundle\Entity\Registration;

use Claroline\CoreBundle\Entity\User;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\MappedSuperclass
 */
abstract class AbstractUserRegistration extends AbstractRegistration
{
    const REQUESTED = 'requested';
    const CONFIRMED = 'confirmed';
    const ACCEPTED = 'accepted';

    /**
     * @ORM\Column(name="registration_status")
     *
     * @var string
     */
    protected $status = self::REQUESTED;

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\CoreBundle\Entity\User")
     * @ORM\JoinColumn(name="user_id", nullable=false, onDelete="CASCADE")
     *
     * @var User
     */
    protected $user;

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status)
    {
        $this->status = $status;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(User $user)
    {
        $this->user = $user;
    }
}
