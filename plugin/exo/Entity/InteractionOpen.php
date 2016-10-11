<?php

namespace UJM\ExoBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * An Open question.
 *
 * @ORM\Entity
 * @ORM\Table(name="ujm_interaction_open")
 */
class InteractionOpen extends AbstractInteraction
{
    const TYPE = 'InteractionOpen';

    /**
     * @ORM\ManyToOne(targetEntity="TypeOpenQuestion")
     */
    private $typeopenquestion;

    /**
     * @ORM\OneToMany(targetEntity="WordResponse", mappedBy="interactionopen", cascade={"persist", "remove"}, orphanRemoval=true)
     */
    private $keywords;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $scoreMaxLongResp;

    public function __construct()
    {
        $this->keywords = new ArrayCollection();
    }

    /**
     * @return string
     */
    public static function getQuestionType()
    {
        return self::TYPE;
    }

    /**
     * @return TypeOpenQuestion
     */
    public function getTypeOpenQuestion()
    {
        return $this->typeopenquestion;
    }

    /**
     * @param TypeOpenQuestion $typeOpenQuestion
     */
    public function setTypeOpenQuestion(TypeOpenQuestion $typeOpenQuestion)
    {
        $this->typeopenquestion = $typeOpenQuestion;
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
        $this->keywords = new ArrayCollection(array_map(function (WordResponse $keyword) {
            $keyword->setInteractionOpen($this);

            return $keyword;
        }, $keywords));
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
            $keyword->setInteractionOpen($this);
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
        $this->keywords->add($wordResponse);
        $wordResponse->setInteractionOpen($this);
    }

    /**
     * @deprecated use removeKeywords() instead
     *
     * @param WordResponse $wordResponse
     */
    public function removeWordResponse(WordResponse $wordResponse)
    {
        $this->keywords->removeElement($wordResponse);
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

    public function __clone()
    {
        if ($this->id) {
            $this->id = null;
            $this->question = clone $this->question;
            $newWordResponses = new ArrayCollection();

            foreach ($this->keywords as $wordResponse) {
                $newWordResponse = clone $wordResponse;
                $newWordResponse->setInteractionOpen($this);
                $newWordResponses->add($newWordResponse);
            }

            $this->keywords = $newWordResponses;
        }
    }
}
