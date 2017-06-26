<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Entity\Update;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity()
 * @ORM\Table(name="claro_updater_executed")
 */
class UpdaterExecuted
{
    /**
     * @ORM\Id
     * @ORM\Column(name="id", type="string", length=255)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Claroline\CoreBundle\Entity\Update\Version"
     * )
     * @ORM\JoinColumn(name="version_id", onDelete="SET NULL")
     */
    protected $version;

    /**
     * @ORM\Column()
     */
    protected $bundle;

    public function __construct($version = null, $bundle = null)
    {
        $this->version = $version;
        $this->bundle = $bundle;
    }

    public function setBundle($bundle)
    {
        $this->bundle = $bundle;
    }

    public function getBundle()
    {
        return $this->bundle;
    }

    public function setVersion(Version $version)
    {
        $this->version = $version;
    }

    public function getVersion()
    {
        return $this->version;
    }
}
