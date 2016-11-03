<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Question\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Options\Validation;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;

/**
 * @DI\Service("ujm_exo.validator.question_match")
 */
class MatchQuestionValidator extends JsonSchemaValidator
{
    public function getJsonSchemaUri()
    {
        return 'question/match/schema.json';
    }

    public function validateAfterSchema($question, array $options = [])
    {
        $errors = [];

        if (in_array(Validation::REQUIRE_SOLUTIONS, $options)) {
            $errors = $this->validateSolutions($question);
        }

        return $errors;
    }

    /**
     * Checks :
     *  - The solutions IDs are consistent with proposals and labels IDs.
     *
     * @param \stdClass $question
     *
     * @return array
     */
    public function validateSolutions(\stdClass $question)
    {
        $errors = [];

        // check solution IDs are consistent with proposals IDs
        $proposalIds = array_map(function ($proposal) {
            return $proposal->id;
        }, $question->firstSet);

        $labelIds = array_map(function ($label) {
            return $label->id;
        }, $question->secondSet);

        foreach ($question->solutions as $index => $solution) {
            if (!in_array($solution->firstId, $proposalIds)) {
                $errors[] = [
                    'path' => "/solutions[{$index}]",
                    'message' => "id {$solution->firstId} doesn't match any proposal id",
                ];
            }

            if (!in_array($solution->secondId, $labelIds)) {
                $errors[] = [
                    'path' => "/solutions[{$index}]",
                    'message' => "id {$solution->secondId} doesn't match any label id",
                ];
            }
        }

        return $errors;
    }
}
