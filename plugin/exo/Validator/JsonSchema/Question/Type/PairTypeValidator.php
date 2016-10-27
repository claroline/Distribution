<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Question\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Question\Handler\QuestionHandlerInterface;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;

/**
 * @DI\Service("ujm_exo.validator.question_pair")
 * @DI\Tag("ujm_exo.question.validator")
 */
class PairTypeValidator extends JsonSchemaValidator implements QuestionHandlerInterface
{
    public function getQuestionMimeType()
    {
        return QuestionType::PAIR;
    }

    public function getJsonSchemaUri()
    {
        return 'question/pair/schema.json';
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

        if (isset($options['solutionsRequired']) && $options['solutionsRequired']) {
            $errors = $this->validateSolutions($question);
        }

        return $errors;
    }

    /**
     * Validates the solution of the question.
     *
     * Checks :
     *  - The solution `leftId` must match the `left` IDs.
     *  - The solution `rightId` must match the `right` IDs.
     *  - The `left` elements are only linked to one `right` in the solutions
     *  - If only 1 `left`, at least 2 `right` are required.
     *  - If only 1 `right`, at least 2 `left` are required.
     *
     * @param \stdClass $question
     *
     * @return array
     */
    protected function validateSolutions(\stdClass $question)
    {
        return [];
    }
}
