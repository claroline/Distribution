<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\AnnouncementBundle\Entity;

use Claroline\CoreBundle\Entity\Model\UuidTrait;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="claro_announcements_send")
 */
class AnnouncementSend
{
    use UuidTrait;

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Claroline\AnnouncementBundle\Entity\AnnouncementAggregate"
     * )
     * @ORM\JoinColumn(name="aggregate_id", nullable=false)
     *
     * @var AnnouncementAggregate
     */
    private $aggregate;

    /**
     * @ORM\Column(type="json_array", nullable=true)
     */
    private $data;

    public function __construct()
    {
        $this->refreshUuid();
    }

    public function getId()
    {
        return $this->id;
    }

    public function setAggregate(AnnouncementAggregate $aggregate)
    {
        $this->aggregate = $aggregate;
    }

    public function getAggregate()
    {
        return $this->aggregate;
    }

    public function setData(array $data)
    {
        $this->data = $data;
    }

    public function getData()
    {
        return $this->data;
    }
}
