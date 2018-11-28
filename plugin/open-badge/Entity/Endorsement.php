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
 * @ORM\Entity
 * @ORM\Table(name="claro__open_badge_endorsement")
 */
class Endorsement
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
     * @ORM\Column(type="json_array")
     */
    private $claim;

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\OpenBadgeBundle\Entity\Profile")
     */
    private $issuer;

    /**
     * @ORM\Column(type="datetime")
     */
    private $issuedOn;

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\OpenBadgeBundle\Entity\VerificationObject")
     */
    private $verification;

    /**
     * @ORM\Column(type="text")
     */
    private $comment;
}
