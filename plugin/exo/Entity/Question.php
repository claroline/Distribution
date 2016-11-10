<?php

namespace UJM\ExoBundle\Entity;

use Claroline\CoreBundle\Entity\User;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="UJM\ExoBundle\Repository\QuestionRepository")
 * @ORM\Table(name="ujm_question")
 * @ORM\EntityListeners({"\UJM\ExoBundle\Listener\Entity\QuestionListener"})
 * @ORM\HasLifecycleCallbacks()
 */
class Question
{
    /**
     * @var int
     *
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column("uuid", type="string", length=36, unique=true)
     */
    private $uuid;

    /**
     * @var string
     *
     * @ORM\Column()
     */
    private $type;

    /**
     * The mime type of the Question type.
     *
     * @var string
     *
     * @ORM\Column("mime_type", type="string")
     */
    private $mimeType;

    /**
     * @var string
     *
     * @ORM\Column("title", type="string", nullable=true)
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(type="text", nullable=true)
     */
    private $description;

    /**
     * @var string
     *
     * @ORM\Column(type="text")
     * @Assert\NotBlank
     */
    private $invite;

    /**
     * @var string
     *
     * @ORM\Column(type="text", nullable=true)
     */
    private $feedback;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_create", type="datetime")
     */
    private $dateCreate;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_modify", type="datetime", nullable=true)
     */
    private $dateModify;

    /**
     * @var bool
     *
     * @ORM\Column(type="boolean")
     */
    private $model = false;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $supplementary;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $specification;

    /**
     * @ORM\ManyToOne(targetEntity="Category")
     */
    private $category;

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\CoreBundle\Entity\User")
     */
    private $user;

    /**
     * @ORM\OneToMany(targetEntity="Hint", mappedBy="question", cascade={"remove", "persist"}, orphanRemoval=true)
     */
    private $hints;

    /**
     * @ORM\OneToMany(targetEntity="QuestionObject", mappedBy="question", cascade={"remove", "persist"}, orphanRemoval=true)
     */
    private $objects;

    /**
     * @ORM\OneToMany(targetEntity="QuestionResource", mappedBy="question", cascade={"remove", "persist"}, orphanRemoval=true)
     */
    private $resources;

    /**
     * Note: used for joins only., orphanRemoval=true.
     *
     * @ORM\OneToMany(targetEntity="StepQuestion", mappedBy="question")
     */
    private $stepQuestions;

    /**
     * The linked interaction entity.
     * This is populated by Doctrine Lifecycle events.
     *
     * @var AbstractInteraction
     */
    private $interaction = null;

    public function __construct()
    {
        $this->uuid = Uuid::uuid4();
        $this->hints = new ArrayCollection();
        $this->objects = new ArrayCollection();
        $this->resources = new ArrayCollection();
        $this->stepQuestions = new ArrayCollection();
        $this->dateCreate = new \DateTime();
        $this->dateModify = new \DateTime();
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Gets UUID.
     *
     * @return string
     */
    public function getUuid()
    {
        return $this->uuid;
    }

    /**
     * Sets UUID.
     *
     * @param $uuid
     */
    public function setUuid($uuid)
    {
        $this->uuid = $uuid;
    }

    /**
     * Note: this method is automatically called in AbstractInteraction#setQuestion.
     *
     * @param string $type
     */
    public function setType($type)
    {
        $this->type = $type;
    }

    /**
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Gets mime type.
     *
     * @return string
     */
    public function getMimeType()
    {
        return $this->mimeType;
    }

    /**
     * Sets mime type.
     *
     * @param $mimeType
     */
    public function setMimeType($mimeType)
    {
        $this->mimeType = $mimeType;
    }

    /**
     * @param string $title
     */
    public function setTitle($title)
    {
        $this->title = $title;
    }

    /**
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param string $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
    }

    /**
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param string $invite
     */
    public function setInvite($invite)
    {
        $this->invite = $invite;
    }

    /**
     * @return string
     */
    public function getInvite()
    {
        return $this->invite;
    }

    /**
     * @return ArrayCollection
     */
    public function getObjects()
    {
        return $this->objects;
    }

    /**
     * @param QuestionObject $object
     */
    public function addObject(QuestionObject $object)
    {
        if (!$this->objects->contains($object)) {
            $this->objects->add($object);
            $object->setQuestion($this);
        }
    }

    /**
     * @param QuestionObject $object
     */
    public function removeObject(QuestionObject $object)
    {
        if ($this->objects->contains($object)) {
            $this->objects->removeElement($object);
            $object->setQuestion(null);
        }
    }

    /**
     * @return ArrayCollection
     */
    public function getResources()
    {
        return $this->resources;
    }

    /**
     * @param QuestionResource $resource
     */
    public function addResource(QuestionResource $resource)
    {
        if (!$this->resources->contains($resource)) {
            $this->resources->add($resource);
            $resource->setQuestion($this);
        }
    }

    /**
     * @param QuestionResource $resource
     */
    public function removeResource(QuestionResource $resource)
    {
        if ($this->resources->contains($resource)) {
            $this->resources->removeElement($resource);
            $resource->setQuestion(null);
        }
    }

    /**
     * @param string $feedback
     */
    public function setFeedback($feedback)
    {
        $this->feedback = $feedback;
    }

    /**
     * @return string
     */
    public function getFeedback()
    {
        return $this->feedback;
    }

    /**
     * @deprecated let the PrePersist hook do job
     *
     * @param \Datetime $dateCreate
     */
    public function setDateCreate(\DateTime $dateCreate)
    {
        $this->dateCreate = $dateCreate;
    }

    /**
     * @ORM\PrePersist
     */
    public function updateDateCreate()
    {
        if (empty($this->dateCreate)) {
            $this->dateCreate = new \DateTime();
        }
    }

    /**
     * @return \Datetime
     */
    public function getDateCreate()
    {
        return $this->dateCreate;
    }

    /**
     * @deprecated let the PreUpdate hook do job
     *
     * @param \Datetime $dateModify
     */
    public function setDateModify(\DateTime $dateModify)
    {
        $this->dateModify = $dateModify;
    }

    /**
     * @ORM\PreUpdate
     */
    public function updateDateModify()
    {
        $this->dateModify = new \DateTime();
    }

    /**
     * @return \Datetime
     */
    public function getDateModify()
    {
        return $this->dateModify;
    }

    /**
     * @param bool $model
     */
    public function setModel($model)
    {
        $this->model = $model;
    }

    /**
     * @return bool
     */
    public function isModel()
    {
        return $this->model;
    }

    /**
     * @deprecated use isModel() instead
     *
     * @return bool
     */
    public function getModel()
    {
        return $this->model;
    }

    /**
     * @return User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param User $user
     */
    public function setUser(User $user)
    {
        $this->user = $user;
    }

    /**
     * @return Category
     */
    public function getCategory()
    {
        return $this->category;
    }

    /**
     * @param Category $category
     */
    public function setCategory(Category $category = null)
    {
        $this->category = $category;
    }

    /**
     * @return ArrayCollection
     */
    public function getHints()
    {
        return $this->hints;
    }

    /**
     * @param Hint $hint
     */
    public function addHint(Hint $hint)
    {
        if (!$this->hints->contains($hint)) {
            $this->hints->add($hint);
            $hint->setQuestion($this);
        }
    }

    /**
     * @param Hint $hint
     */
    public function removeHint(Hint $hint)
    {
        if ($this->hints->contains($hint)) {
            $this->hints->removeElement($hint);
        }
    }

    /**
     * @param string $supplementary
     */
    public function setSupplementary($supplementary)
    {
        $this->supplementary = $supplementary;
    }

    /**
     * @return string
     */
    public function getSupplementary()
    {
        return $this->supplementary;
    }

    /**
     * @param string $specification
     */
    public function setSpecification($specification)
    {
        $this->specification = $specification;
    }

    /**
     * @return string
     */
    public function getSpecification()
    {
        return $this->specification;
    }

    /**
     * @return AbstractInteraction
     */
    public function getInteraction()
    {
        return $this->interaction;
    }

    /**
     * @param AbstractInteraction $interaction
     */
    public function setInteraction(AbstractInteraction $interaction)
    {
        $this->interaction = $interaction;
    }
}
