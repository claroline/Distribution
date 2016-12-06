<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Answer\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;

/**
 * @DI\Service("ujm_exo.validator.answer_cloze")
 */
class ClozeAnswerValidator extends JsonSchemaValidator
{
    public function getJsonSchemaUri()
    {
        return 'answer-data/cloze/schema.json';
    }

    /**
     * Performs additional validations.
     *
     * @param \stdClass $question
     * @param array     $options
     *
     * @return array
     */
    public function validateAfterSchema($question, array $options = [])
    {
        $holeIds = array_map(function (\stdClass $hole) {
            return $hole->id;
        }, $question->holes);

        foreach ($data as $answer) {
            if ($answer || $answer !== null) {
                if (empty($answer['holeId'])) {
                    return ['Answer `holeId` cannot be empty'];
                }

                if (!is_string($answer['holeId'])) {
                    return ['Answer `holeId` must contain only strings , '.gettype($answer['holeId']).' given.'];
                }

                if (!in_array($answer['holeId'], $holeIds)) {
                    return ['Answer array identifiers must reference question holes'];
                }

                if (!empty($answer['answerText']) && !is_string($answer['answerText'])) {
                    return ['Answer `answerText` must contain only strings , '.gettype($answer['holeId']).' given.'];
                }
            }
        }

        return [];
    }
}
