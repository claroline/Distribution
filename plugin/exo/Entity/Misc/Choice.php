<?php

namespace UJM\ExoBundle\Entity\Misc;

use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\QuestionType\ChoiceQuestion;
use UJM\ExoBundle\Library\Model\ContentTrait;
use UJM\ExoBundle\Library\Model\FeedbackTrait;
use UJM\ExoBundle\Library\Model\OrderTrait;
use UJM\ExoBundle\Library\Model\ScoreTrait;

/**
 * Choice.
 *
 * @ORM\Entity()
 * @ORM\Table(name="ujm_choice")
 */
class Choice
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    use OrderTrait;

    use ScoreTrait;

    use FeedbackTrait;

    use ContentTrait;

    /**
     * The choice is part of the expected answer for the question.
     *
     * @var bool
     *
     * @ORM\Column(type="boolean")
     */
    private $expected = false;

    /**
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\QuestionType\ChoiceQuestion", inversedBy="choices")
     * @ORM\JoinColumn(name="interaction_qcm_id", referencedColumnName="id")
     */
    private $interactionQCM;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Sets expected.
     *
     * @param bool $expected
     */
    public function setExpected($expected)
    {
        $this->expected = $expected;
    }

    /**
     * Is expected ?
     *
     * @return bool
     */
    public function isExpected()
    {
        return $this->expected;
    }

    /**
     * @return ChoiceQuestion
     */
    public function getInteractionQCM()
    {
        return $this->interactionQCM;
    }

    /**
     * @param ChoiceQuestion $interactionQCM
     */
    public function setInteractionQCM(ChoiceQuestion $interactionQCM)
    {
        $this->interactionQCM = $interactionQCM;
    }
}
