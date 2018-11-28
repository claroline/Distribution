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
 * @ORM\Table(name="claro__open_badge_badge_class")
 */
class BadgeClass
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
    private $iri;

    /**
     * @ORM\Column(type="json_array")
     */
    private $type;

    /**
     * @ORM\Column()
     */
    private $name;

    /**
     * @ORM\Column(type="text")
     */
    private $description;

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\OpenBadgeBundle\Entity\Image")
     */
    private $image;

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\OpenBadgeBundle\Entity\Criteria")
     */
    private $criteria;

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\OpenBadgeBundle\Entity\Profile")
     */
    private $issuer;

    /**
     * @ORM\ManyToMany(targetEntity="Claroline\OpenBadgeBundle\Entity\AlignmentObject")
     */
    private $alignments;

    /**
     * @ORM\Column(type="json_array")
     */
    private $tags;
}
