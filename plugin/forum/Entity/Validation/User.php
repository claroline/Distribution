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

use Claroline\CoreBundle\Entity\User as ClarolineUser;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity()
 * @ORM\Table(name="claro_forum_user")
 */
class User
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
     *     targetEntity="Claroline\ForumBundle\Entity\Forum",
     *     cascade={"persist"}
     * )
     */
    protected $forum;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $access = false;

    public function setUser(ClarolineUser $user)
    {
        $this->user = $user;
    }

    public function getUser()
    {
        return $this->user;
    }

    public function setForum($forum)
    {
        $this->forum = $forum;
    }

    public function getForum()
    {
        return $this->forum;
    }

    public function setAccess($bool)
    {
        $this->access = $access;
    }

    public function getAccess()
    {
        return $this->access;
    }
}
