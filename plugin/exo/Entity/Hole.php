<?php

namespace UJM\ExoBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * UJM\ExoBundle\Entity\Hole.
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
     * @var int
     *
     * @deprecated no longer used
     *
     * @ORM\Column(name="position", type="integer", nullable=true)
     */
    private $position;

    /**
     * @var bool
     *
     * @ORM\Column(name="selector", type="boolean", nullable=true)
     */
    private $selector;

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
     * @ORM\OneToMany(targetEntity="UJM\ExoBundle\Entity\WordResponse", mappedBy="hole", cascade={"persist", "remove"}, orphanRemoval=true)
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
     * Set position.
     *
     * @deprecated the underlying property will be removed in next release
     *
     * @param int $position
     */
    public function setPosition($position)
    {
        $this->position = $position;
    }

    /**
     * Get position.
     *
     * @deprecated the underlying property will be removed in next release
     *
     * @return int
     */
    public function getPosition()
    {
        return $this->position;
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
     * Adds a keyword.
     *
     * @param WordResponse $keyword
     */
    public function addKeyword(WordResponse $keyword)
    {
        if (!$this->keywords->contains($keyword)) {
            $this->keywords->add($keyword);
            $keyword->setHole($this);
        }
    }

    /**
     * Removes a keyword.
     *
     * @param WordResponse $keyword
     */
    public function removeKeyword(WordResponse $keyword)
    {
        if ($this->keywords->contains($keyword)) {
            $this->keywords->removeElement($keyword);
        }
    }

    /**
     * @deprecated use getKeywords() instead
     *
     * @return ArrayCollection
     */
    public function getWordResponses()
    {
        return $this->keywords;
    }

    /**
     * @deprecated use addKeyword() instead
     *
     * @param WordResponse $wordResponse
     */
    public function addWordResponse(WordResponse $wordResponse)
    {
        $this->keywords[] = $wordResponse;

        $wordResponse->setHole($this);
    }

    /**
     * @deprecated use removeKeyword() instead
     *
     * @param WordResponse $wordResponse
     */
    public function removeWordResponse(WordResponse $wordResponse)
    {
    }

    public function __clone()
    {
        if ($this->id) {
            $this->id = null;

            $newWordResponses = new ArrayCollection();
            foreach ($this->keywords as $wordResponse) {
                $newWordResponse = clone $wordResponse;
                $newWordResponse->setHole($this);
                $newWordResponses->add($newWordResponse);
            }
            $this->keywords = $newWordResponses;
        }
    }
}
