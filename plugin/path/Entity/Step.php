<?php

namespace Innova\PathBundle\Entity;

use Claroline\AppBundle\Entity\Identifier\Id;
use Claroline\AppBundle\Entity\Identifier\Uuid;
use Claroline\AppBundle\Entity\Meta\Poster;
use Claroline\CoreBundle\Entity\Activity\ActivityParameters;
use Claroline\CoreBundle\Entity\Resource\Activity;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Innova\PathBundle\Entity\Path\Path;

/**
 * Step.
 *
 * @ORM\Table("innova_step")
 * @ORM\Entity()
 */
class Step
{
    use Id;
    use Uuid;
    use Poster;

    /**
     * Activity of this step.
     *
     * @var Activity
     *
     * @ORM\ManyToOne(targetEntity="Claroline\CoreBundle\Entity\Resource\Activity", cascade={"persist"})
     * @ORM\JoinColumn(name="activity_id", referencedColumnName="id", onDelete="SET NULL")
     *
     * @deprecated
     */
    protected $activity;

    /**
     * Parameters for this step.
     *
     * @var ActivityParameters
     *
     * @ORM\ManyToOne(targetEntity="Claroline\CoreBundle\Entity\Activity\ActivityParameters", cascade={"all"})
     * @ORM\JoinColumn(name="parameters_id", referencedColumnName="id", onDelete="SET NULL")
     *
     * @deprecated
     */
    protected $parameters;

    /**
     * Min height of Activity.
     *
     * @var int
     *
     * @ORM\Column(name="activity_height", type="integer", nullable=true)
     *
     * @deprecated
     */
    protected $activityHeight;

    /**
     * Order of the steps relative to his siblings in the path.
     *
     * @var int
     *
     * @ORM\Column(name="step_order", type="integer")
     */
    protected $order;

    /**
     * Parent step.
     *
     * @var Step
     *
     * @ORM\ManyToOne(targetEntity="Step", inversedBy="children")
     * @ORM\JoinColumn(name="parent_id", referencedColumnName="id", onDelete="CASCADE")
     */
    protected $parent;

    /**
     * Children steps.
     *
     * @var ArrayCollection|Step[]
     *
     * @ORM\OneToMany(targetEntity="Step", mappedBy="parent", cascade={"persist", "remove"})
     * @ORM\OrderBy({"order" = "ASC"})
     */
    protected $children;

    /**
     * Path.
     *
     * @var Path
     *
     * @ORM\ManyToOne(targetEntity="Innova\PathBundle\Entity\Path\Path", inversedBy="steps")
     */
    protected $path;

    /**
     * Title of the step.
     *
     * @var string
     *
     * @ORM\Column(name="title", nullable=true)
     */
    protected $title;

    /**
     * Description of the step.
     *
     * @var string
     *
     * @ORM\Column(name="description", type="text", nullable=true)
     */
    protected $description;

    /**
     * The number of the step (either a number, a literal or a custom label).
     *
     * @var string
     *
     * @ORM\Column(nullable=true)
     */
    protected $numbering;

    /**
     * @var ResourceNode
     *
     * @ORM\ManyToOne(targetEntity="Claroline\CoreBundle\Entity\Resource\ResourceNode")
     * @ORM\JoinColumn(name="resource_id", nullable=true, onDelete="SET NULL")
     */
    protected $resource;

    /**
     * @var bool
     *
     * @ORM\Column(name="showResourceHeader", type="boolean")
     */
    protected $showResourceHeader = false;

    /**
     * Secondary resources.
     *
     * @var ArrayCollection|SecondaryResource[]
     *
     * @ORM\OneToMany(targetEntity="Innova\PathBundle\Entity\SecondaryResource", mappedBy="step", cascade={"persist", "remove"}, orphanRemoval=true)
     * @ORM\OrderBy({"order" = "ASC"})
     */
    protected $secondaryResources;

    /**
     * @ORM\Column(type="boolean")
     *
     * @var bool
     */
    private $evaluated = false;

    /**
     * @Gedmo\Slug(fields={"title"})
     * @ORM\Column(length=128)
     */
    private $slug;

    /**
     * Class constructor.
     */
    public function __construct()
    {
        $this->refreshUuid();

        $this->children = new ArrayCollection();
        $this->secondaryResources = new ArrayCollection();
    }

    /**
     * Get activity.
     *
     * @return Activity
     */
    public function getActivity()
    {
        return $this->activity;
    }

    /**
     * Set activity.
     *
     * @param Activity $activity
     *
     * @return Step
     */
    public function setActivity(Activity $activity)
    {
        $this->activity = $activity;

        return $this;
    }

    /**
     * Get activity parameters.
     *
     * @return ActivityParameters
     */
    public function getParameters()
    {
        return $this->parameters;
    }

    /**
     * @param ActivityParameters $parameters
     *
     * @return Step
     */
    public function setParameters(ActivityParameters $parameters)
    {
        $this->parameters = $parameters;

        return $this;
    }

    /**
     * Set order.
     *
     * @param int $order
     *
     * @return Step
     */
    public function setOrder($order)
    {
        $this->order = $order;

        return $this;
    }

    /**
     * Get order of the step.
     *
     * @return int
     */
    public function getOrder()
    {
        return $this->order;
    }

    /**
     * Set path.
     *
     * @param Path $path
     *
     * @return Step
     */
    public function setPath(Path $path = null)
    {
        if (!empty($this->path)) {
            $this->path->removeStep($this);
        }

        $this->path = $path;

        if (!empty($path)) {
            $path->addStep($this);
        }

        return $this;
    }

    /**
     * Get path.
     *
     * @return Path
     */
    public function getPath()
    {
        return $this->path;
    }

    /**
     * Set parent.
     *
     * @param Step $parent
     *
     * @return Step
     */
    public function setParent(Step $parent = null)
    {
        if ($parent !== $this->parent) {
            $this->parent = $parent;

            if (null !== $parent) {
                $parent->addChild($this);
            }
        }

        return $this;
    }

    /**
     * Get parent.
     *
     * @return Step
     */
    public function getParent()
    {
        return $this->parent;
    }

    public function hasResources()
    {
        return !empty($this->resource) || !empty($this->secondaryResources);
    }

    /**
     * Get children of the step.
     *
     * @return ArrayCollection|Step[]
     */
    public function getChildren()
    {
        return $this->children;
    }

    /**
     * Check if the Step has children.
     *
     * @return bool
     */
    public function hasChildren()
    {
        return !empty($this->children) && 0 < $this->children->count();
    }

    /**
     * Add new child to the step.
     *
     * @param Step $step
     *
     * @return Step
     */
    public function addChild(Step $step)
    {
        if (!$this->children->contains($step)) {
            $this->children->add($step);
            $step->setParent($this);
        }

        return $this;
    }

    /**
     * Remove a step from children.
     *
     * @param Step $step
     *
     * @return Step
     */
    public function removeChild(Step $step)
    {
        if ($this->children->contains($step)) {
            $this->children->removeElement($step);
            $step->setParent(null);
        }

        return $this;
    }

    /**
     * Empty a step from children.
     *
     * @return Step
     */
    public function emptyChildren()
    {
        $this->children->clear();

        return $this;
    }

    /**
     * Get min height for activity display.
     *
     * @return int
     */
    public function getActivityHeight()
    {
        return $this->activityHeight;
    }

    /**
     * Set min height for activity display.
     *
     * @param int $activityHeight
     *
     * @return $this
     */
    public function setActivityHeight($activityHeight)
    {
        $this->activityHeight = $activityHeight;

        return $this;
    }

    /**
     * Get title of the step.
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set title.
     *
     * @param string $title
     */
    public function setTitle($title)
    {
        $this->title = $title;
    }

    /**
     * Get description of the step.
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set description.
     *
     * @param string $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
    }

    public function getNumbering()
    {
        return $this->numbering;
    }

    public function setNumbering($numbering)
    {
        $this->numbering = $numbering;
    }

    /**
     * @return ResourceNode
     */
    public function getResource()
    {
        return $this->resource;
    }

    /**
     * @param ResourceNode $resource
     */
    public function setResource(ResourceNode $resource = null)
    {
        $this->resource = $resource;
    }

    /**
     * Get secondary resources.
     *
     * @return ArrayCollection|SecondaryResource[]
     */
    public function getSecondaryResources()
    {
        return $this->secondaryResources;
    }

    /**
     * Removes all secondary resources.
     *
     * @return Step
     */
    public function emptySecondaryResources()
    {
        $this->secondaryResources->clear();

        return $this;
    }

    /**
     * Add a secondary resource.
     *
     * @param SecondaryResource $secondaryResource
     *
     * @return Step
     */
    public function addSecondaryResource(SecondaryResource $secondaryResource)
    {
        if (!$this->secondaryResources->contains($secondaryResource)) {
            $this->secondaryResources->add($secondaryResource);
            $secondaryResource->setStep($this);
        }

        return $this;
    }

    /**
     * Remove a secondary resource.
     *
     * @param SecondaryResource $secondaryResource
     *
     * @return Step
     */
    public function removeSecondaryResource(SecondaryResource $secondaryResource)
    {
        if ($this->secondaryResources->contains($secondaryResource)) {
            $this->secondaryResources->removeElement($secondaryResource);
        }

        return $this;
    }

    /**
     * @return bool
     */
    public function getShowResourceHeader()
    {
        return $this->showResourceHeader;
    }

    /**
     * @param bool $showResourceHeader
     *
     * @return Step
     */
    public function setShowResourceHeader($showResourceHeader)
    {
        $this->showResourceHeader = $showResourceHeader;

        return $this;
    }

    /**
     * @return bool
     */
    public function isEvaluated()
    {
        return $this->evaluated;
    }

    /**
     * @param bool $evaluated
     */
    public function setEvaluated($evaluated)
    {
        $this->evaluated = $evaluated;
    }

    public function getSlug()
    {
        return $this->slug;
    }

    public function setSlug($slug = null)
    {
        $this->slug = $slug;
    }
}
