<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Question\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Question\Handler\QuestionHandlerInterface;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;
use UJM\ExoBundle\Validator\JsonSchema\Misc\KeywordValidator;

/**
 * @DI\Service("ujm_exo.validator.question_cloze")
 * @DI\Tag("ujm_exo.question.validator")
 */
class ClozeTypeValidator extends JsonSchemaValidator implements QuestionHandlerInterface
{
    /**
     * @var KeywordValidator
     */
    private $keywordValidator;

    /**
     * WordsTypeValidator constructor.
     *
     * @param KeywordValidator $keywordValidator
     *
     * @DI\InjectParams({
     *     "keywordValidator" = @DI\Inject("ujm_exo.validator.keyword")
     * })
     */
    public function __construct(KeywordValidator $keywordValidator)
    {
        $this->keywordValidator = $keywordValidator;
    }

    public function getQuestionMimeType()
    {
        return QuestionType::CLOZE;
    }

    public function getJsonSchemaUri()
    {
        return 'question/cloze/schema.json';
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
     *  - The solutions IDs are consistent with holes IDs
     *  - There is at least one solution with a positive score for each Hole.
     *
     * @param \stdClass $question
     *
     * @return array
     */
    public function validateSolutions(\stdClass $question)
    {
        $errors = [];

        // check solution IDs are consistent with hole IDs
        $holeIds = array_map(function ($hole) {
            return $hole->id;
        }, $question->holes);

        if (count($question->holes) !== count($question->solutions)) {
            $errors[] = [
                'path' => '/solutions',
                'message' => 'there must be the same number of solutions and holes',
            ];
        }

        foreach ($question->solutions as $index => $solution) {
            if (!in_array($solution->holeId, $holeIds)) {
                $errors[] = [
                    'path' => "/solutions[{$index}]",
                    'message' => "id {$solution->holeId} doesn't match any hole id",
                ];
            }

            // Validates hole keywords
            $errors = array_merge($errors, $this->keywordValidator->validateCollection($solution->answers, ['validateScore' => true]));
        }

        return $errors;
    }
}
