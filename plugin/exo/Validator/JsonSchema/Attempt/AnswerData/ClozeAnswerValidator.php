<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Attempt\AnswerData;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\QuestionType\ClozeQuestion;
use UJM\ExoBundle\Library\Options\Validation;
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
     * @param array $answerData
     * @param array $options
     *
     * @return array
     */
    public function validateAfterSchema($answerData, array $options = [])
    {
        /** @var ClozeQuestion $question */
        $question = !empty($options[Validation::QUESTION]) ? $options[Validation::QUESTION] : null;
        if (empty($question)) {
            throw new \LogicException('Answer validation : Cannot perform additional validation without question.');
        }

        $holeIds = array_map(function (\stdClass $hole) {
            return $hole->id;
        }, $question->getHoles()->toArray());

        foreach ($answerData as $answer) {
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
