<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\BigBlueButtonBundle\Entity;

use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="claro_bigbluebuttonbundle_bbb")
 */
class BBB extends AbstractResource implements \JsonSerializable
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(name="room_name", nullable=true)
     */
    protected $roomName;

    /**
     * @ORM\Column(name="new_tab", type="boolean")
     */
    protected $newTab = false;

    /**
     * @ORM\Column(name="moderator_required", type="boolean")
     */
    protected $moderatorRequired = false;

    /**
     * @ORM\Column(name="record", type="boolean")
     */
    protected $record = false;

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getId()
    {
        return $this->id;
    }

    public function getRoomName()
    {
        return $this->roomName;
    }

    public function setRoomName($roomName)
    {
        $this->roomName = $roomName;
    }

    public function isNewTab()
    {
        return $this->newTab;
    }

    public function setNewTab($newTab)
    {
        $this->newTab = $newTab;
    }

    public function isModeratorRequired()
    {
        return $this->moderatorRequired;
    }

    public function setModeratorRequired($moderatorRequired)
    {
        $this->moderatorRequired = $moderatorRequired;
    }

    public function getRecord()
    {
        return $this->record;
    }

    public function setRecord($record)
    {
        $this->record = $record;
    }

    public function jsonSerialize()
    {
        return [
            'id' => $this->id,
            'roomName' => $this->name,
            'newTab' => $this->newTab,
            'moderatorRequired' => $this->moderatorRequired,
            'record' => $this->record,
        ];
    }
}
