<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Attempt\AnswerData;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Misc\Choice;
use UJM\ExoBundle\Entity\QuestionType\ChoiceQuestion;
use UJM\ExoBundle\Library\Options\Validation;
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
     * @param array $answerData
     * @param array $options
     *
     * @return array
     */
    public function validateAfterSchema($answerData, array $options = [])
    {
        /** @var ChoiceQuestion $question */
        $question = !empty($options[Validation::QUESTION]) ? $options[Validation::QUESTION] : null;
        if (empty($question)) {
            throw new \LogicException('Answer validation : Cannot perform additional validation without question.');
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

        if (!$question->isMultiple() && count($answerData) > 1) {
            return ['This question does not allow multiple answers'];
        }

        return [];
    }
}
