<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Answer\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Misc\Choice;
use UJM\ExoBundle\Entity\QuestionType\ChoiceQuestion;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;

/**
 * @DI\Service("ujm_exo.validator.answer_choice")
 */
class ChoiceAnswerValidator extends JsonSchemaValidator
{
    public function getJsonSchemaUri()
    {
        return 'answer-data/choice/schema.json';
    }

    /**
     * Performs additional validations.
     *
     * @param array          $answerData
     * @param array          $options
     * @param ChoiceQuestion $question
     *
     * @return array
     */
    public function validateAfterSchema($answerData, array $options = [], ChoiceQuestion $question = null)
    {
        $count = count($answerData);
        if (0 === $count) {
            // data CAN be empty (for example editing a multiple choice question and unchecking all choices)
            return [];
        }

        $choiceIds = array_map(function (Choice $choice) {
            return (string) $choice->getId();
        }, $question->getChoices()->toArray());

        foreach ($answerData as $id) {
            if (!is_string($id)) {
                return ['Answer array must contain only string identifiers'];
            }

            if (!in_array($id, $choiceIds)) {
                return ['Answer array identifiers must reference question choices'];
            }
        }

        if (!$question->isMultiple() && $count > 1) {
            return ['This question does not allow multiple answers'];
        }

        return [];
    }
}
