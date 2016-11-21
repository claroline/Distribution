<?php

namespace UJM\ExoBundle\Entity\Misc;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\InteractionHole;
use UJM\ExoBundle\Entity\Misc\Keyword;

/**
 * Hole.
 *
 * @ORM\Entity
 * @ORM\Table(name="ujm_hole")
 */
class Hole
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var int
     *
     * @ORM\Column(name="size", type="integer")
     */
    private $size;

    /**
     * @var bool
     *
     * @ORM\Column(name="selector", type="boolean", nullable=true)
     */
    private $selector = false;

    /**
     * @var string
     *
     * @ORM\Column(name="placeholder", type="string", nullable=true)
     */
    private $placeholder;

    /**
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\InteractionHole", inversedBy="holes")
     * @ORM\JoinColumn(name="interaction_hole_id", referencedColumnName="id")
     */
    private $interactionHole;

    /**
     * @var ArrayCollection
     *
     * @ORM\OneToMany(targetEntity="UJM\ExoBundle\Entity\Misc\Keyword", mappedBy="hole", cascade={"persist", "remove"}, orphanRemoval=true)
     */
    private $keywords;

    /**
     * Constructs a new instance of choices.
     */
    public function __construct()
    {
        $this->keywords = new ArrayCollection();
    }

    /**
     * Get id.
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set size.
     *
     * @param int $size
     */
    public function setSize($size)
    {
        $this->size = $size;
    }

    /**
     * Get size.
     *
     * @return int
     */
    public function getSize()
    {
        return $this->size;
    }

    /**
     * Set selector.
     *
     * @param int $selector
     */
    public function setSelector($selector)
    {
        $this->selector = $selector;
    }

    /**
     * Get selector.
     */
    public function getSelector()
    {
        return $this->selector;
    }

    /**
     * Get placeholder.
     *
     * @return string
     */
    public function getPlaceholder()
    {
        return $this->placeholder;
    }

    /**
     * Set placeholder.
     *
     * @param string $placeholder
     */
    public function setPlaceholder($placeholder)
    {
        $this->placeholder = $placeholder;
    }

    public function getInteractionHole()
    {
        return $this->interactionHole;
    }

    public function setInteractionHole(InteractionHole $interactionHole)
    {
        $this->interactionHole = $interactionHole;
    }

    /**
     * Get keywords.
     *
     * @return ArrayCollection
     */
    public function getKeywords()
    {
        return $this->keywords;
    }

    /**
     * Sets keywords collection.
     *
     * @param array $keywords
     */
    public function setKeywords(array $keywords)
    {
        $this->keywords = new ArrayCollection(array_map(function (Keyword $keyword) {
            $keyword->setHole($this);

            return $keyword;
        }, $keywords));
    }

    /**
     * Adds a keyword.
     *
     * @param Keyword $keyword
     */
    public function addKeyword(Keyword $keyword)
    {
        if (!$this->keywords->contains($keyword)) {
            $this->keywords->add($keyword);
            $keyword->setHole($this);
        }
    }

    /**
     * Removes a keyword.
     *
     * @param Keyword $keyword
     */
    public function removeKeyword(Keyword $keyword)
    {
        if ($this->keywords->contains($keyword)) {
            $this->keywords->removeElement($keyword);
        }
    }
}
