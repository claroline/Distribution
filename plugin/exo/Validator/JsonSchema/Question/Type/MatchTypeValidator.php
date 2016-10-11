<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Question\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Question\Handler\QuestionHandlerInterface;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;

/**
 * @DI\Service("ujm_exo.validator.question_cloze")
 * @DI\Tag("ujm_exo.question.validator")
 */
class MatchTypeValidator extends JsonSchemaValidator implements QuestionHandlerInterface
{
    public function getQuestionMimeType()
    {
        return QuestionType::MATCH;
    }

    public function getJsonSchemaUri()
    {
        return 'question/match/schema.json';
    }

    public function validateAfterSchema($question, array $options = [])
    {
        $errors = [];

        if (isset($options['solutionsRequired']) && $options['solutionsRequired']) {
            $errors = $this->validateSolutions($question);
        }

        return $errors;
    }

    /**
     * Checks :
     *  - The solutions IDs are consistent with proposals and labels IDs
     *  - There is at least one solution with a positive score.
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

        $maxScore = -1;
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

            if ($solution->score > $maxScore) {
                $maxScore = $solution->score;
            }
        }

        // check there is a positive score solution
        if ($maxScore <= 0) {
            $errors[] = [
                'path' => '/solutions',
                'message' => 'there is no solution with a positive score',
            ];
        }

        return $errors;
    }
}
