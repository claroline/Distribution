<?php

namespace UJM\ExoBundle\Entity\QuestionType;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\Misc\Keyword;

/**
 * An Open question.
 *
 * @ORM\Entity
 * @ORM\Table(name="ujm_interaction_open")
 */
class OpenQuestion extends AbstractQuestion
{
    /**
     * @ORM\OneToMany(
     *     targetEntity="UJM\ExoBundle\Entity\Misc\Keyword",
     *     mappedBy="interactionopen",
     *     cascade={"persist", "remove"},
     *     orphanRemoval=true
     * )
     *
     * @var ArrayCollection
     */
    private $keywords;

    /**
     * @ORM\Column(type="float", nullable=true)
     *
     * @var float
     */
    private $scoreMaxLongResp;

    /**
     * OpenQuestion constructor.
     */
    public function __construct()
    {
        $this->keywords = new ArrayCollection();
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
            $keyword->setInteractionOpen($this);

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
            $keyword->setInteractionOpen($this);
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

    /**
     * @param float $scoreMaxLongResp
     */
    public function setScoreMaxLongResp($scoreMaxLongResp)
    {
        $this->scoreMaxLongResp = $scoreMaxLongResp;
    }

    /**
     * @return float
     */
    public function getScoreMaxLongResp()
    {
        return $this->scoreMaxLongResp;
    }
}
