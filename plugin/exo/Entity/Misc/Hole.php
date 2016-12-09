<?php

namespace UJM\ExoBundle\Entity\Misc;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\QuestionType\ClozeQuestion;

/**
 * Hole.
 *
 * @ORM\Entity
 * @ORM\Table(name="ujm_hole")
 */
class Hole
{
    /**
     * The identifier of the hole.
     *
     * @var int
     *
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * The display size of the hole input.
     *
     * @ORM\Column(type="integer")
     *
     * @var int
     */
    private $size;

    /**
     * @ORM\Column(type="boolean")
     *
     * @var bool
     */
    private $selector = false;

    /**
     * The help text to display in the empty hole input.
     *
     * @ORM\Column(type="string", nullable=true)
     *
     * @var string
     */
    private $placeholder;

    /**
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\QuestionType\ClozeQuestion", inversedBy="holes")
     * @ORM\JoinColumn(name="interaction_hole_id", referencedColumnName="id")
     */
    private $interactionHole;

    /**
     * The list of keywords attached to the hole.
     *
     * @ORM\OneToMany(
     *     targetEntity="UJM\ExoBundle\Entity\Misc\Keyword",
     *     mappedBy="hole",
     *     cascade={"all"},
     *     orphanRemoval=true
     * )
     *
     * @var ArrayCollection
     */
    private $keywords;

    /**
     * Hole constructor.
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

    public function setInteractionHole(ClozeQuestion $interactionHole)
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
