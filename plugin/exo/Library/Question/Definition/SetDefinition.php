<?php

namespace UJM\ExoBundle\Library\Question\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\AbstractInteraction;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Serializer\Answer\Type\SetAnswerSerializer;
use UJM\ExoBundle\Serializer\Question\Type\SetQuestionSerializer;
use UJM\ExoBundle\Validator\JsonSchema\Question\Type\SetQuestionValidator;

/**
 * Set question definition.
 *
 * @DI\Service("ujm_exo.definition.question_set")
 * @DI\Tag("ujm_exo.definition.question")
 */
class SetDefinition extends AbstractDefinition
{
    /**
     * @var SetQuestionValidator
     */
    private $validator;

    /**
     * @var SetQuestionSerializer
     */
    private $serializer;

    /**
     * @var SetAnswerSerializer
     */
    private $answerSerializer;

    /**
     * SetDefinition constructor.
     *
     * @param SetQuestionValidator  $validator
     * @param SetQuestionSerializer $serializer
     * @param SetAnswerSerializer $answerSerializer
     *
     * @DI\InjectParams({
     *     "validator"  = @DI\Inject("ujm_exo.validator.question_set"),
     *     "serializer" = @DI\Inject("ujm_exo.serializer.question_set"),
     *     "answerSerializer" = @DI\Inject("ujm_exo.serializer.answer_set")
     * })
     */
    public function __construct(
        SetQuestionValidator $validator,
        SetQuestionSerializer $serializer,
        SetAnswerSerializer $answerSerializer)
    {
        $this->validator = $validator;
        $this->serializer = $serializer;
        $this->answerSerializer = $answerSerializer;
    }

    /**
     * Gets the set question mime-type.
     *
     * @return string
     */
    public function getMimeType()
    {
        return QuestionType::SET;
    }

    /**
     * Gets the set question entity.
     *
     * @return string
     */
    public function getEntityClass()
    {
        return 'SetQuestion';
    }

    /**
     * Gets the set question validator.
     *
     * @return SetQuestionValidator
     */
    protected function getQuestionValidator()
    {
        return $this->validator;
    }

    /**
     * Gets the set question serializer.
     *
     * @return SetQuestionSerializer
     */
    protected function getQuestionSerializer()
    {
        return $this->serializer;
    }

    /**
     * Gets the set answer serializer.
     *
     * @return SetAnswerSerializer
     */
    protected function getAnswerSerializer()
    {
        return $this->answerSerializer;
    }

    public function calculateTotal(AbstractInteraction $setQuestion)
    {
        $scoreMax = 0;

        foreach ($setQuestion->getLabels() as $label) {
            $scoreMax += $label->getScore();
        }

        return $scoreMax;
    }

    public function getStatistics(AbstractInteraction $setQuestion, array $answers)
    {
        // TODO: Implement getStatistics() method.

        return [];
    }
}
