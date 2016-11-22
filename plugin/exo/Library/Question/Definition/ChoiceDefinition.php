<?php

namespace UJM\ExoBundle\Library\Question\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\AbstractInteraction;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Serializer\Answer\Type\ChoiceAnswerSerializer;
use UJM\ExoBundle\Serializer\Question\Type\ChoiceQuestionSerializer;
use UJM\ExoBundle\Validator\JsonSchema\Question\Type\ChoiceQuestionValidator;

/**
 * Choice question definition.
 *
 * @DI\Service("ujm_exo.definition.question_choice")
 * @DI\Tag("ujm_exo.definition.question")
 */
class ChoiceDefinition extends AbstractDefinition
{
    /**
     * @var ChoiceQuestionValidator
     */
    private $validator;

    /**
     * @var ChoiceQuestionSerializer
     */
    private $serializer;

    /**
     * @var ChoiceAnswerSerializer
     */
    private $answerSerializer;

    /**
     * ChoiceDefinition constructor.
     *
     * @param ChoiceQuestionValidator  $validator
     * @param ChoiceQuestionSerializer $serializer
     * @param ChoiceAnswerSerializer   $answerSerializer
     *
     * @DI\InjectParams({
     *     "validator"        = @DI\Inject("ujm_exo.validator.question_choice"),
     *     "serializer"       = @DI\Inject("ujm_exo.serializer.question_choice"),
     *     "answerSerializer" = @DI\Inject("ujm_exo.serializer.answer_choice")
     * })
     */
    public function __construct(
        ChoiceQuestionValidator $validator,
        ChoiceQuestionSerializer $serializer,
        ChoiceAnswerSerializer $answerSerializer)
    {
        $this->validator = $validator;
        $this->serializer = $serializer;
        $this->answerSerializer = $answerSerializer;
    }

    /**
     * Gets the choice question mime-type.
     * 
     * @return string
     */
    public function getMimeType()
    {
        return QuestionType::CHOICE;
    }

    /**
     * Gets the choice question entity.
     *
     * @return string
     */
    public function getEntityClass()
    {
        return 'ChoiceQuestion';
    }

    /**
     * Gets the choice question validator.
     *
     * @return ChoiceQuestionValidator
     */
    protected function getQuestionValidator()
    {
        return $this->validator;
    }

    /**
     * Gets the choice question serializer.
     *
     * @return ChoiceQuestionSerializer
     */
    protected function getQuestionSerializer()
    {
        return $this->serializer;
    }

    /**
     * Gets the choice answer serializer.
     *
     * @return ChoiceAnswerSerializer
     */
    protected function getAnswerSerializer()
    {
        return $this->answerSerializer;
    }

    public function calculateTotal(AbstractInteraction $question)
    {
        // TODO: Implement calculateTotal() method.
    }

    public function getStatistics(AbstractInteraction $choiceQuestion, array $answers)
    {
        $choices = [];

        foreach ($answers as $answer) {
            $decoded = $this->convertAnswerDetails($answer);

            foreach ($decoded as $choiceId) {
                if (!isset($choices[$choiceId])) {
                    // First answer to have this solution
                    $choices[$choiceId] = new \stdClass();
                    $choices[$choiceId]->id = $choiceId;
                    $choices[$choiceId]->count = 0;
                }

                ++$choices[$choiceId]->count;
            }
        }

        return $choices;
    }
}
