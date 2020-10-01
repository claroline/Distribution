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

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\AppBundle\Entity\Identifier\Uuid;
use Claroline\CoreBundle\Entity\Organization\Location;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\User;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="claro_cursusbundle_course_session")
 */
class CourseSession extends AbstractCourseSession
{
    use Id;
    use Uuid;

    // TODO : location
    // TODO : secondary resources

    const REGISTRATION_AUTO = 0;
    const REGISTRATION_MANUAL = 1;
    const REGISTRATION_PUBLIC = 2;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Claroline\CursusBundle\Entity\Course",
     *     inversedBy="sessions"
     * )
     * @ORM\JoinColumn(name="course_id", nullable=false, onDelete="CASCADE")
     *
     * @var Course
     */
    protected $course;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Claroline\CoreBundle\Entity\Role"
     * )
     * @ORM\JoinColumn(name="learner_role_id", nullable=true, onDelete="SET NULL")
     *
     * @var Role
     */
    protected $learnerRole;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Claroline\CoreBundle\Entity\Role"
     * )
     * @ORM\JoinColumn(name="tutor_role_id", nullable=true, onDelete="SET NULL")
     *
     * @var Role
     */
    protected $tutorRole;

    /**
     * @ORM\Column(name="default_session", type="boolean")
     */
    protected $defaultSession = false;

    /**
     * @ORM\Column(name="creation_date", type="datetime", nullable=false)
     *
     * @var \DateTime
     */
    protected $creationDate;

    /**
     * @ORM\Column(name="start_date", type="datetime", nullable=true)
     *
     * @var \DateTime
     */
    protected $startDate;

    /**
     * @ORM\Column(name="end_date", type="datetime", nullable=true)
     *
     * @var \DateTime
     */
    protected $endDate;

    /**
     * @ORM\OneToMany(
     *     targetEntity="Claroline\CursusBundle\Entity\CourseSessionUser",
     *     mappedBy="session"
     * )
     */
    protected $sessionUsers;

    /**
     * @ORM\OneToMany(
     *     targetEntity="Claroline\CursusBundle\Entity\CourseSessionGroup",
     *     mappedBy="session"
     * )
     */
    protected $sessionGroups;

    /**
     * @ORM\ManyToMany(targetEntity="Claroline\CoreBundle\Entity\User")
     * @ORM\JoinTable(name="claro_cursusbundle_course_session_validators")
     */
    protected $validators;

    /**
     * @ORM\Column(name="session_type", type="integer")
     */
    protected $type = 0;

    /**
     * @ORM\ManyToMany(targetEntity="Claroline\CoreBundle\Entity\Resource\ResourceNode", orphanRemoval=true)
     * @ORM\JoinTable(name="claro_cursusbundle_course_session_resources",
     *      joinColumns={@ORM\JoinColumn(name="resource_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="session_id", referencedColumnName="id", unique=true)}
     * )
     *
     * @var ArrayCollection|ResourceNode[]
     */
    protected $resources;

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\CoreBundle\Entity\Organization\Location")
     * @ORM\JoinColumn(name="location_id", nullable=true, onDelete="SET NULL")
     *
     * @var Location
     */
    protected $location;

    /**
     * @ORM\OneToMany(
     *     targetEntity="Claroline\CursusBundle\Entity\SessionEvent",
     *     mappedBy="session"
     * )
     * @ORM\OrderBy({"startDate" = "ASC"})
     */
    protected $events;

    /**
     * @ORM\Column(name="event_registration_type", type="integer", nullable=false, options={"default" = 0})
     */
    protected $eventRegistrationType = self::REGISTRATION_AUTO;

    /**
     * @ORM\Column(type="json_array", nullable=true)
     */
    protected $details;

    public function __construct()
    {
        $this->refreshUuid();

        $this->creationDate = new \DateTime();
        $this->sessionUsers = new ArrayCollection();
        $this->sessionGroups = new ArrayCollection();
        $this->validators = new ArrayCollection();
        $this->resources = new ArrayCollection();
        $this->events = new ArrayCollection();
    }

    /**
     * @return Course
     */
    public function getCourse()
    {
        return $this->course;
    }

    public function setCourse(Course $course)
    {
        $this->course = $course;
    }

    public function getLearnerRole()
    {
        return $this->learnerRole;
    }

    public function setLearnerRole(Role $learnerRole = null)
    {
        $this->learnerRole = $learnerRole;
    }

    public function getTutorRole()
    {
        return $this->tutorRole;
    }

    public function setTutorRole(Role $tutorRole = null)
    {
        $this->tutorRole = $tutorRole;
    }

    public function isDefaultSession()
    {
        return $this->defaultSession;
    }

    public function setDefaultSession($defaultSession)
    {
        $this->defaultSession = $defaultSession;
    }

    public function getCreationDate()
    {
        return $this->creationDate;
    }

    public function setCreationDate($creationDate)
    {
        $this->creationDate = $creationDate;
    }

    /**
     * @return \DateTime
     */
    public function getStartDate()
    {
        return $this->startDate;
    }

    public function setStartDate(\DateTime $startDate = null)
    {
        $this->startDate = $startDate;
    }

    /**
     * @return \DateTime
     */
    public function getEndDate()
    {
        return $this->endDate;
    }

    public function setEndDate(\DateTime $endDate = null)
    {
        $this->endDate = $endDate;
    }

    public function isActive()
    {
        $now = new \DateTime();

        return (is_null($this->startDate) || $now >= $this->startDate) && (is_null($this->endDate) || $now <= $this->endDate);
    }

    public function hasStarted()
    {
        $now = new \DateTime();

        return is_null($this->startDate) || $now >= $this->startDate;
    }

    public function isTerminated()
    {
        $now = new \DateTime();

        return $this->endDate && $now > $this->endDate;
    }

    public function getSessionUsers()
    {
        return $this->sessionUsers->toArray();
    }

    public function getSessionGroups()
    {
        return $this->sessionGroups->toArray();
    }

    public function getCourseTitle()
    {
        return $this->getCourse()->getName();
    }

    public function getFullNameWithCourse()
    {
        return $this->getCourseTitle().
            ' ['.
            $this->getCourse()->getCode().
            ']'.
            ' - '.
            $this->getName();
    }

    public function getShortNameWithCourse($courseLength = 25)
    {
        $courseTitle = $this->getCourseTitle();
        $length = strlen($courseTitle);
        $shortTitle = ($length > $courseLength) ?
            substr($courseTitle, 0, $courseLength).'...' :
            $courseTitle;

        return $shortTitle.' - '.$this->getName();
    }

    public function getValidators()
    {
        return $this->validators->toArray();
    }

    public function addValidator(User $validator)
    {
        if (!$this->validators->contains($validator)) {
            $this->validators->add($validator);
        }

        return $this;
    }

    public function removeValidator(User $validator)
    {
        if ($this->validators->contains($validator)) {
            $this->validators->removeElement($validator);
        }

        return $this;
    }

    public function emptyValidators()
    {
        $this->validators->clear();
    }

    public function getType()
    {
        return $this->type;
    }

    public function setType($type)
    {
        $this->type = $type;
    }

    public function hasValidation()
    {
        return parent::hasValidation() || 0 < count($this->getValidators());
    }

    public function getResources()
    {
        return $this->resources;
    }

    public function setResources(array $resources)
    {
        $this->resources = new ArrayCollection($resources);
    }

    public function addResource(ResourceNode $resource)
    {
        if (!$this->resources->contains($resource)) {
            $this->resources->add($resource);
        }
    }

    public function removeResource(ResourceNode $resource)
    {
        if ($this->resources->contains($resource)) {
            $this->resources->removeElement($resource);
        }
    }

    /**
     * @return Location
     */
    public function getLocation()
    {
        return $this->location;
    }

    public function setLocation(Location $location = null)
    {
        $this->location = $location;
    }

    /**
     * @return SessionEvent[]|ArrayCollection
     */
    public function getEvents()
    {
        return $this->events;
    }

    public function getEventRegistrationType()
    {
        return $this->eventRegistrationType;
    }

    public function setEventRegistrationType($eventRegistrationType)
    {
        $this->eventRegistrationType = $eventRegistrationType;
    }

    public function getDetails()
    {
        return $this->details;
    }

    public function setDetails($details)
    {
        $this->details = $details;
    }

    public function getColor()
    {
        return !is_null($this->details) && isset($this->details['color']) ? $this->details['color'] : null;
    }

    public function setColor($color)
    {
        if (is_null($this->details)) {
            $this->details = [];
        }
        $this->details['color'] = $color;
    }

    public function getTotal()
    {
        return !is_null($this->details) && isset($this->details['total']) ? $this->details['total'] : null;
    }

    public function setTotal($total)
    {
        if (is_null($this->details)) {
            $this->details = [];
        }
        $this->details['total'] = $total;
    }

    public function getCertificated()
    {
        return !is_null($this->details) && isset($this->details['certificated']) ? $this->details['certificated'] : true;
    }

    public function setCertificated($certificated)
    {
        if (is_null($this->details)) {
            $this->details = [];
        }
        $this->details['certificated'] = $certificated;
    }

    public function __toString()
    {
        return $this->name;
    }
}
