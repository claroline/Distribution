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

use Claroline\CoreBundle\Entity\Organization\Organization;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="claro__open_badge_badge_class")
 */
class BadgeClass
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     *
     * @var int
     */
    private $id;

    /**
     * @ORM\Column()
     *
     * @var string
     */
    private $name;

    /**
     * @ORM\Column(type="text")
     *
     * @var string
     */
    private $description;

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\OpenBadgeBundle\Entity\Image")
     *
     * @var Image
     */
    private $image;

    /**
     * @ORM\Column(type="text")
     *
     * @var string
     */
    private $criteria;

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\CoreBundle\Entity\Organization\Organization")
     *
     * @var Organization
     */
    private $issuer;
}
