<?php

namespace UJM\ExoBundle\Library\Question\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\AbstractInteraction;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Serializer\Answer\Type\PairAnswerSerializer;
use UJM\ExoBundle\Serializer\Question\Type\PairQuestionSerializer;
use UJM\ExoBundle\Validator\JsonSchema\Question\Type\PairQuestionValidator;

/**
 * Pair question definition.
 *
 * @DI\Service("ujm_exo.definition.question_pair")
 * @DI\Tag("ujm_exo.definition.question")
 */
class PairDefinition extends AbstractDefinition
{
    /**
     * @var PairQuestionValidator
     */
    private $validator;

    /**
     * @var PairQuestionSerializer
     */
    private $serializer;

    /**
     * @var PairAnswerSerializer
     */
    private $answerSerializer;

    /**
     * PairDefinition constructor.
     *
     * @param PairQuestionValidator  $validator
     * @param PairQuestionSerializer $serializer
     * @param PairAnswerSerializer $answerSerializer
     *
     * @DI\InjectParams({
     *     "validator"  = @DI\Inject("ujm_exo.validator.question_pair"),
     *     "serializer" = @DI\Inject("ujm_exo.serializer.question_pair"),
     *     "answerSerializer" = @DI\Inject("ujm_exo.serializer.answer_pair")
     * })
     */
    public function __construct(
        PairQuestionValidator $validator,
        PairQuestionSerializer $serializer,
        PairAnswerSerializer $answerSerializer)
    {
        $this->validator = $validator;
        $this->serializer = $serializer;
        $this->answerSerializer = $answerSerializer;
    }

    /**
     * Gets the pair question mime-type.
     *
     * @return string
     */
    public function getMimeType()
    {
        return QuestionType::PAIR;
    }

    /**
     * Gets the pair question entity.
     *
     * @return string
     */
    public function getEntityClass()
    {
        return 'PairQuestion';
    }

    /**
     * Gets the pair question validator.
     *
     * @return PairQuestionValidator
     */
    protected function getQuestionValidator()
    {
        return $this->validator;
    }

    /**
     * Gets the pair question serializer.
     *
     * @return PairQuestionSerializer
     */
    protected function getQuestionSerializer()
    {
        return $this->serializer;
    }

    /**
     * Gets the pair answer serializer.
     *
     * @return PairAnswerSerializer
     */
    protected function getAnswerSerializer()
    {
        return $this->answerSerializer;
    }

    public function calculateTotal(AbstractInteraction $pairQuestion)
    {
        $scoreMax = 0;

        foreach ($pairQuestion->getLabels() as $label) {
            $scoreMax += $label->getScore();
        }

        return $scoreMax;
    }

    public function getStatistics(AbstractInteraction $pairQuestion, array $answers)
    {
        // TODO: Implement getStatistics() method.

        return [];
    }
}
