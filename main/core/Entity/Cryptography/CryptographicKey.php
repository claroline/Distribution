<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Entity\Cryptography;

use Claroline\CoreBundle\Entity\Model\UuidTrait;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="claro_cryptographic_key")
 */
class CryptographicKey
{
    use UuidTrait;

    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\CoreBundle\Entity\User")
     */
    private $user;

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\CoreBundle\Entity\Organization\Organization")
     */
    private $organization;

    /**
     * @ORM\Column(type="text")
     */
    private $publicKeyParam;

    /**
     * We shouldn't store that. Users should do it themselves. Handle that properly later I guess.
     *
     * @ORM\Column(type="text", nullable=true)
     */
    private $privateKeyParam;

    public function __construct()
    {
        $this->refreshUuid();
    }
}
