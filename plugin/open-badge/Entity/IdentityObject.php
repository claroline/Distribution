<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\OpenBadgeBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="claro__open_badge_identity_object")
 */
class IdentityObject
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column()
     */
    private $identity;

    /**
     * @ORM\Column()
     */
    private $type;

    /**
     * @ORM\Column(type="boolean")
     */
    private $hashed;

    /**
     * @ORM\Column()
     */
    private $salt;
}
