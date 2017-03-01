<?php

namespace UJM\ExoBundle\Entity\Misc;

use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;
use UJM\ExoBundle\Entity\ItemType\Ordering;
use UJM\ExoBundle\Library\Model\ContentTrait;
use UJM\ExoBundle\Library\Model\UuidTrait;
use UJM\ExoBundle\Library\Model\OrderTrait;
use UJM\ExoBundle\Library\Model\ScoreTrait;
use UJM\ExoBundle\Library\Model\FeedbackTrait;

/**
 * An ordering question.
 *
 * @ORM\Entity
 * @ORM\Table(name="ujm_ordering_item")
 */
class OrderingItem
{
    /**
     * Unique identifier of the item.
     *
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     *
     * @var int
     */
    private $id;

    use UuidTrait;

    use ContentTrait;

    use OrderTrait;

    use ScoreTrait;

    use FeedbackTrait;

    /**
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\ItemType\Ordering", inversedBy="items")
     * @ORM\JoinColumn(name="ujm_question_ordering_id", referencedColumnName="id")
     */
    private $question;

    /**
     * OrderingItem constructor.
     */
    public function __construct()
    {
        $this->uuid = Uuid::uuid4()->toString();
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

    public function getQuestion()
    {
        return $this->question;
    }

    public function setQuestion(Ordering $question)
    {
        $this->question = $question;
    }
}
