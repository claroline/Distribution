<?php

namespace UJM\ExoBundle\Entity\Misc;

use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;
use UJM\ExoBundle\Entity\ItemType\BooleanQuestion;
use UJM\ExoBundle\Library\Attempt\AnswerPartInterface;
use UJM\ExoBundle\Library\Model\ContentTrait;
use UJM\ExoBundle\Library\Model\FeedbackTrait;
use UJM\ExoBundle\Library\Model\ScoreTrait;
use UJM\ExoBundle\Library\Model\UuidTrait;

/**
 * Choice.
 *
 * @ORM\Entity()
 * @ORM\Table(name="ujm_boolean_choice")
 */
class BooleanChoice implements AnswerPartInterface
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    use UuidTrait;

    use ScoreTrait;

    use FeedbackTrait;

    use ContentTrait;

    /**
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\ItemType\BooleanQuestion", inversedBy="choices")
     * @ORM\JoinColumn(name="boolean_question_id", referencedColumnName="id")
     */
    private $question;

    public function __construct()
    {
        $this->uuid = Uuid::uuid4()->toString();
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return BooleanQuestion
     */
    public function getQuestion()
    {
        return $this->question;
    }

    /**
     * @param BooleanQuestion $question
     */
    public function setQuestion(BooleanQuestion $question)
    {
        $this->question = $question;
    }
}
