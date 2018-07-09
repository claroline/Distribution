<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Icap\BlogBundle\Entity;

use Claroline\CoreBundle\Entity\User as User;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity()
 * @ORM\Entity(repositoryClass="Icap\BlogBundle\Repository\MemberRepository")
 * @ORM\Table(name="icap__blog_member")
 */
class Member
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     *
     * @var int
     */
    protected $id;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Claroline\CoreBundle\Entity\User",
     *     cascade={"persist"}
     * )
     */
    protected $user;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Icap\BlogBundle\Entity\Blog",
     *     inversedBy="members",
     *     cascade={"persist"}
     * )
     */
    protected $blog;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $trusted = false;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $banned = false;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    public function setUser(User $user)
    {
        $this->user = $user;
    }

    public function getUser()
    {
        return $this->user;
    }

    public function setBlog($blog)
    {
        $this->blog = $blog;
    }

    public function getBlog()
    {
        return $this->blog;
    }

    public function setTrusted($bool)
    {
        $this->trusted = $bool;
    }

    public function getTrusted()
    {
        return $this->trusted;
    }

    public function setBanned($bool)
    {
        $this->banned = $bool;
    }

    public function isBanned()
    {
        return $this->banned;
    }
}
