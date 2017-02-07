<?php

namespace UJM\ExoBundle\Entity\Misc;

use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\QuestionType\OpenQuestion;
use UJM\ExoBundle\Library\Attempt\AnswerPartInterface;
use UJM\ExoBundle\Library\Model\FeedbackTrait;
use UJM\ExoBundle\Library\Model\ScoreTrait;

/**
 * Keyword.
 *
 * @ORM\Entity()
 * @ORM\Table(name="ujm_cell_choice")
 */
class CellChoice implements AnswerPartInterface
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    use ScoreTrait;

    use FeedbackTrait;

    /**
     * @var string
     *
     * @ORM\Column(name="response", type="string", length=255)
     */
    private $text;

    /**
     * @var bool
     *
     * @ORM\Column(name="caseSensitive", type="boolean", nullable=true)
     */
    private $caseSensitive;

    /**
     *
     * @var OpenQuestion
     *
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\Misc\Cell", inversedBy="choices")
     * @ORM\JoinColumn(name="cell_id", referencedColumnName="id")
     */
    private $cell;

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
     * Get text.
     *
     * @return string
     */
    public function getText()
    {
        return $this->text;
    }

    /**
     * Set text.
     *
     * @param string $text
     */
    public function setText($text)
    {
        $this->text = $text;
    }

    /**
     * Is the keyword case sensitive ?
     *
     * @return bool
     */
    public function isCaseSensitive()
    {
        return $this->caseSensitive;
    }

    /**
     * Set caseSensitive.
     *
     * @param bool $caseSensitive
     */
    public function setCaseSensitive($caseSensitive)
    {
        $this->caseSensitive = $caseSensitive;
    }

    /**
     * @deprecated this entity do not need to know open question as they also can be linked to holes
     *
     * @return OpenQuestion
     */
    public function getInteractionOpen()
    {
        return $this->interactionopen;
    }

    /**
     * @deprecated this entity do not need to know open question as they also can be linked to holes
     *
     * @param OpenQuestion $interactionOpen
     */
    public function setInteractionOpen(OpenQuestion $interactionOpen)
    {
        $this->interactionopen = $interactionOpen;
    }

    /**
     * @deprecated this entity do not need to know holes as they also can be linked to open questions
     *
     * @return Hole
     */
    public function getHole()
    {
        return $this->hole;
    }

    /**
     * @deprecated this entity do not need to know holes as they also can be linked to open questions
     *
     * @param Hole $hole
     */
    public function setHole(Hole $hole)
    {
        $this->hole = $hole;
    }
}
