<?php

namespace UJM\ExoBundle\Library\Question\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\QuestionType\AbstractQuestion;
use UJM\ExoBundle\Library\Question\QuestionType;
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
     * ChoiceDefinition constructor.
     *
     * @param ChoiceQuestionValidator  $validator
     * @param ChoiceQuestionSerializer $serializer
     *
     * @DI\InjectParams({
     *     "validator"        = @DI\Inject("ujm_exo.validator.question_choice"),
     *     "serializer"       = @DI\Inject("ujm_exo.serializer.question_choice")
     * })
     */
    public function __construct(
        ChoiceQuestionValidator $validator,
        ChoiceQuestionSerializer $serializer)
    {
        $this->validator = $validator;
        $this->serializer = $serializer;
    }

    /**
     * Gets the choice question mime-type.
     *
     * @return string
     */
    public static function getMimeType()
    {
        return QuestionType::CHOICE;
    }

    /**
     * Gets the choice question entity.
     *
     * @return string
     */
    public static function getEntityClass()
    {
        return '\UJM\ExoBundle\Entity\QuestionType\ChoiceQuestion';
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

    public function correctAnswer(AbstractQuestion $question, $answer)
    {
        // TODO: Implement correctAnswer() method.
    }

    public function expectAnswer(AbstractQuestion $question)
    {
        // TODO: Implement expectAnswer() method.
    }

    public function getStatistics(AbstractQuestion $choiceQuestion, array $answers)
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
