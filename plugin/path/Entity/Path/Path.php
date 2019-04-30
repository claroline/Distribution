<?php

namespace Innova\PathBundle\Entity\Path;

use Claroline\AppBundle\Entity\Identifier\Uuid;
use Claroline\AppBundle\Entity\Parameters\SummaryParameters;
use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Innova\PathBundle\Entity\Step;

/**
 * Path.
 *
 * @ORM\Table(name="innova_path")
 * @ORM\Entity()
 */
class Path extends AbstractResource
{
    use Uuid;
    use SummaryParameters;

    /**
     * JSON structure of the path.
     *
     * @var string
     *
     * @ORM\Column(name="structure", type="text", nullable=true)
     *
     * @deprecated
     */
    protected $structure;

    /**
     * Steps linked to the path.
     *
     * @var ArrayCollection|Step[]
     *
     * @ORM\OneToMany(targetEntity="Innova\PathBundle\Entity\Step", mappedBy="path", cascade={"persist", "remove"}, orphanRemoval=true)
     * @ORM\OrderBy({
     *     "order" = "ASC"
     * })
     */
    protected $steps;

    /**
     * @var bool
     *
     * @ORM\Column(name="modified", type="boolean")
     */
    protected $modified = false;

    /**
     * Numbering of the steps.
     *
     * @var string
     *
     * @ORM\Column
     */
    protected $numbering = 'none';

    /**
     * Description of the path.
     *
     * @var string
     *
     * @ORM\Column(name="description", type="text", nullable=true)
     */
    protected $description;

    /**
     * Is it possible for the user to manually set the progression.
     *
     * @var bool
     *
     * @ORM\Column(name="manual_progression_allowed", type="boolean")
     */
    protected $manualProgressionAllowed = true;

    /**
     * Show overview to users or directly start the path.
     *
     * @ORM\Column(name="show_overview", type="boolean", options={"default" = 1})
     *
     * @var bool
     */
    private $showOverview = true;

    /**
     * Force the opening of secondary resources.
     *
     * @ORM\Column(options={"default" : "_self"})
     *
     * @var string
     */
    private $secondaryResourcesTarget = '_self';

    /**
     * Path constructor.
     */
    public function __construct()
    {
        $this->refreshUuid();

        $this->steps = new ArrayCollection();
    }

    /**
     * Set json structure.
     *
     * @param string $structure
     *
     * @return \Innova\PathBundle\Entity\Path\Path
     */
    public function setStructure($structure)
    {
        $this->structure = $structure;

        return $this;
    }

    /**
     * Get a JSON version of the Path.
     *
     * @return string
     */
    public function getStructure()
    {
        $isPublished = $this->isPublished();
        if ($isPublished && !$this->modified) {
            // Rebuild the structure of the Path from generated data
            // This permits to merge modifications made on generated data into the Path
            $structure = json_encode($this); // See `jsonSerialize` to know how it's populated
        } else {
            // There are unpublished data so get the structure generated by the editor
            $structure = $this->structure;
        }

        return $structure;
    }

    /**
     * Add step.
     *
     * @param Step $step
     *
     * @return Path
     */
    public function addStep(Step $step)
    {
        if (!$this->steps->contains($step)) {
            $this->steps->add($step);
        }

        return $this;
    }

    /**
     * Remove step.
     *
     * @param Step $step
     *
     * @return Path
     */
    public function removeStep(Step $step)
    {
        if ($this->steps->contains($step)) {
            $this->steps->removeElement($step);
        }

        return $this;
    }

    /**
     * Remove all steps.
     *
     * @return Path
     */
    public function emptySteps()
    {
        $this->steps->clear();

        return $this;
    }

    /**
     * Get steps.
     *
     * @return ArrayCollection|Step[]
     */
    public function getSteps()
    {
        return $this->steps;
    }

    /**
     * Get numbering.
     *
     * @return string
     */
    public function getNumbering()
    {
        return $this->numbering;
    }

    /**
     * Set numbering.
     *
     * @param string $numbering
     *
     * @return Path
     */
    public function setNumbering($numbering)
    {
        $this->numbering = $numbering;

        return $this;
    }

    /**
     * Get description.
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
     *
     * @return Path
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get manualProgressionAllowed.
     *
     * @return bool
     */
    public function isManualProgressionAllowed()
    {
        return $this->manualProgressionAllowed;
    }

    /**
     * Set manualProgressionAllowed.
     *
     * @param bool $manualProgressionAllowed
     *
     * @return Path
     */
    public function setManualProgressionAllowed($manualProgressionAllowed)
    {
        $this->manualProgressionAllowed = $manualProgressionAllowed;

        return $this;
    }

    /**
     * Get root step of the path.
     *
     * @return Step[]
     */
    public function getRootSteps()
    {
        $roots = [];

        if (!empty($this->steps)) {
            foreach ($this->steps as $step) {
                if (null === $step->getParent()) {
                    // Root step found
                    $roots[] = $step;
                }
            }
        }

        return $roots;
    }

    /**
     * Initialize JSON structure.
     *
     * @return Path
     *
     * @deprecated
     */
    public function initializeStructure()
    {
        $structure = [
            'id' => $this->getId(),
            'name' => $this->getName(),
            'description' => $this->getDescription(),
            'manualProgressionAllowed' => $this->manualProgressionAllowed,
            'steps' => [],
        ];

        $this->setStructure(json_encode($structure));

        return $this;
    }

    /**
     * Set show overview.
     *
     * @param bool $showOverview
     */
    public function setShowOverview($showOverview)
    {
        $this->showOverview = $showOverview;
    }

    /**
     * Is overview shown ?
     *
     * @return bool
     */
    public function getShowOverview()
    {
        return $this->showOverview;
    }

    /**
     * Get the opening target for secondary resources.
     *
     * @return string
     */
    public function getSecondaryResourcesTarget()
    {
        return $this->secondaryResourcesTarget;
    }

    /**
     * Set the opening target for secondary resources.
     *
     * @param $secondaryResourcesTarget
     */
    public function setSecondaryResourcesTarget($secondaryResourcesTarget)
    {
        $this->secondaryResourcesTarget = $secondaryResourcesTarget;
    }

    public function hasResources()
    {
        foreach ($this->steps as $step) {
            if ($step->hasResources()) {
                return true;
            }
        }

        return false;
    }
}
