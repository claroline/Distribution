<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CursusBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use FormaLibre\ReservationBundle\Entity\Reservation;
use FormaLibre\ReservationBundle\Entity\Resource;
use JMS\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="Claroline\CursusBundle\Repository\SessionEventRepository")
 * @ORM\Table(name="claro_cursusbundle_session_event")
 */
class SessionEvent
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @Groups({"api_cursus"})
     */
    protected $id;

    /**
     * @ORM\Column(name="event_name")
     * @Assert\NotBlank()
     * @Groups({"api_cursus"})
     */
    protected $name;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Claroline\CursusBundle\Entity\CourseSession",
     *     inversedBy="events"
     * )
     * @ORM\JoinColumn(name="session_id", nullable=false, onDelete="CASCADE")
     * @Groups({"api_cursus"})
     */
    protected $session;

    /**
     * @ORM\Column(name="start_date", type="datetime", nullable=false)
     * @Groups({"api_cursus"})
     */
    protected $startDate;

    /**
     * @ORM\Column(name="end_date", type="datetime", nullable=false)
     * @Groups({"api_cursus"})
     */
    protected $endDate;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"api_cursus"})
     */
    protected $description;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"api_cursus"})
     */
    protected $location;

    /**
     * @ORM\OneToMany(
     *     targetEntity="Claroline\CursusBundle\Entity\SessionEventComment",
     *     mappedBy="sessionEvent"
     * )
     */
    protected $comments;

    /**
     * @ORM\ManyToOne(targetEntity="FormaLibre\ReservationBundle\Entity\Resource")
     * @ORM\JoinColumn(name="location_resource_id", nullable=true, onDelete="SET NULL")
     */
    protected $locationResource;

    /**
     * @ORM\ManyToOne(targetEntity="FormaLibre\ReservationBundle\Entity\Reservation")
     * @ORM\JoinColumn(name="reservation_id", nullable=true, onDelete="SET NULL")
     */
    protected $reservation;

    public function __construct()
    {
        $this->comments = new ArrayCollection();
    }

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getSession()
    {
        return $this->session;
    }

    public function setSession(CourseSession $session)
    {
        $this->session = $session;
    }

    public function getStartDate()
    {
        return $this->startDate;
    }

    public function setStartDate($startDate)
    {
        $this->startDate = $startDate;
    }

    public function getEndDate()
    {
        return $this->endDate;
    }

    public function setEndDate($endDate)
    {
        $this->endDate = $endDate;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function setDescription($description)
    {
        $this->description = $description;
    }

    public function getLocation()
    {
        return $this->location;
    }

    public function setLocation($location)
    {
        $this->location = $location;
    }

    public function getComments()
    {
        return $this->comments->toArray();
    }

    public function getLocationResource()
    {
        return $this->locationResource;
    }

    public function setLocationResource(Resource $locationResource = null)
    {
        $this->locationResource = $locationResource;
    }

    public function getReservation()
    {
        return $this->reservation;
    }

    public function setReservation(Reservation $reservation = null)
    {
        $this->reservation = $reservation;
    }
}
