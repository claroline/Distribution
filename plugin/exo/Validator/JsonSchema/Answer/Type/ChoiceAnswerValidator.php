<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Answer\Type;

use JMS\DiExtraBundle\Annotation as DI;
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
     * @param \stdClass $question
     * @param array $options
     *
     * @return array
     */
    public function validateAfterSchema($question, array $options = [])
    {
        // TODO : implement method.

        $count = count($data);
        if (0 === $count) {
            // data CAN be empty (for example editing a multiple choice question and unchecking all choices)
            return [];
        }

        $interaction = $this->om->getRepository('UJMExoBundle:InteractionQCM')
            ->findOneByQuestion($question);
        $choiceIds = array_map(function (Choice $choice) {
            return (string) $choice->getId();
        }, $interaction->getChoices()->toArray());

        foreach ($data as $id) {
            if (!is_string($id)) {
                return ['Answer array must contain only string identifiers'];
            }

            if (!in_array($id, $choiceIds)) {
                return ['Answer array identifiers must reference question choices'];
            }
        }

        if ($interaction->getTypeQCM()->getCode() === 2 && $count > 1) {
            return ['This question does not allow multiple answers'];
        }

        return [];
    }
}
