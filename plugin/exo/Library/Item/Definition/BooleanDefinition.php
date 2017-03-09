<?php

namespace UJM\ExoBundle\Library\Item\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\ItemType\AbstractItem;
use UJM\ExoBundle\Entity\ItemType\BooleanQuestion;
use UJM\ExoBundle\Entity\Misc\BooleanChoice;
use UJM\ExoBundle\Library\Attempt\CorrectedAnswer;
use UJM\ExoBundle\Library\Item\ItemType;
use UJM\ExoBundle\Serializer\Item\Type\BooleanQuestionSerializer;
use UJM\ExoBundle\Validator\JsonSchema\Attempt\AnswerData\BooleanAnswerValidator;
use UJM\ExoBundle\Validator\JsonSchema\Item\Type\BooleanQuestionValidator;

/**
 * Choice question definition.
 *
 * @DI\Service("ujm_exo.definition.question_boolean")
 * @DI\Tag("ujm_exo.definition.item")
 */
class BooleanDefinition extends AbstractDefinition
{
    /**
     * @var BooleanQuestionValidator
     */
    private $validator;

    /**
     * @var BooleanAnswerValidator
     */
    private $answerValidator;

    /**
     * @var BooleanQuestionSerializer
     */
    private $serializer;

    /**
     * ChoiceDefinition constructor.
     *
     * @param BooleanQuestionValidator  $validator
     * @param BooleanAnswerValidator    $answerValidator
     * @param BooleanQuestionSerializer $serializer
     *
     * @DI\InjectParams({
     *     "validator"       = @DI\Inject("ujm_exo.validator.question_boolean"),
     *     "answerValidator" = @DI\Inject("ujm_exo.validator.answer_boolean"),
     *     "serializer"      = @DI\Inject("ujm_exo.serializer.question_boolean")
     * })
     */
    public function __construct(
        BooleanQuestionValidator $validator,
        BooleanAnswerValidator $answerValidator,
        BooleanQuestionSerializer $serializer)
    {
        $this->validator = $validator;
        $this->answerValidator = $answerValidator;
        $this->serializer = $serializer;
    }

    /**
     * Gets the choice question mime-type.
     *
     * @return string
     */
    public static function getMimeType()
    {
        return ItemType::BOOLEAN;
    }

    /**
     * Gets the choice question entity.
     *
     * @return string
     */
    public static function getEntityClass()
    {
        return '\UJM\ExoBundle\Entity\ItemType\BooleanQuestion';
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
     * Gets the choice answer validator.
     *
     * @return ChoiceAnswerValidator
     */
    protected function getAnswerValidator()
    {
        return $this->answerValidator;
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
     * @param ChoiceQuestion $question
     * @param $answer
     *
     * @return CorrectedAnswer
     */
    public function correctAnswer(AbstractItem $question, $answer = [])
    {
        $corrected = new CorrectedAnswer();

        foreach ($question->getChoices() as $choice) {
            if (!empty($answer) && $choice->getUuid() === $answer->id) {
                // Choice has been selected by the user
                if (0 < $choice->getScore()) {
                    $corrected->addExpected($choice);
                } else {
                    $corrected->addUnexpected($choice);
                }
            } elseif (0 < $choice->getScore()) {
                // The choice is not selected but it's part of the correct answer
                $corrected->addMissing($choice);
            }
        }

        return $corrected;
    }

    /**
     * @param ChoiceQuestion $question
     *
     * @return array
     */
    public function expectAnswer(AbstractItem $question)
    {
        return array_filter($question->getChoices()->toArray(), function (Choice $choice) {
            return 0 < $choice->getScore();
        });
    }

    public function getStatistics(AbstractItem $choiceQuestion, array $answersData)
    {
      // TODO: Implement getStatistics() method.

      return [];
    }
}
