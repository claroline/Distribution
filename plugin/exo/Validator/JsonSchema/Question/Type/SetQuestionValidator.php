<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Question\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Options\Validation;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;

/**
 * @DI\Service("ujm_exo.validator.question_set")
 */
class SetQuestionValidator extends JsonSchemaValidator
{
    public function getJsonSchemaUri()
    {
        return 'question/set/schema.json';
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
        $errors = [];

        if (in_array(Validation::REQUIRE_SOLUTIONS, $options)) {
            $errors = $this->validateSolutions($question);
        }

        return $errors;
    }

    /**
     * Validates the solution of the question.
     *
     * Checks :
     *  - The solution `memberId` must match the `members` IDs.
     *  - The solution `setId` must match the `sets` IDs.
     *
     * @param \stdClass $question
     *
     * @return array
     */
    protected function validateSolutions(\stdClass $question)
    {
        $errors = [];

        // check solution IDs are consistent with set IDs
        $setIds = array_map(function (\stdClass $set) {
            return $set->id;
        }, $question->sets);

        // check solution IDs are consistent with member IDs
        $memberIds = array_map(function (\stdClass $member) {
            return $member->id;
        }, $question->members);

        foreach ($question->solutions as $index => $solution) {
            if (!in_array($solution->setId, $setIds)) {
                $errors[] = [
                    'path' => "/solutions[{$index}]",
                    'message' => "id {$solution->setId} doesn't match any set id",
                ];
            }

            if (!in_array($solution->memberId, $memberIds)) {
                $errors[] = [
                    'path' => "/solutions[{$index}]",
                    'message' => "id {$solution->memberId} doesn't match any member id",
                ];
            }
        }

        return $errors;
    }
}
