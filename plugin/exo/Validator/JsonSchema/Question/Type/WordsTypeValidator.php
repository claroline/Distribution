<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Question\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Question\Handler\QuestionHandlerInterface;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;
use UJM\ExoBundle\Validator\JsonSchema\Misc\KeywordValidator;

/**
 * @DI\Service("ujm_exo.validator.question_words")
 * @DI\Tag("ujm_exo.question.validator")
 */
class WordsTypeValidator extends JsonSchemaValidator implements QuestionHandlerInterface
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
        return QuestionType::WORDS;
    }

    public function getJsonSchemaUri()
    {
        return 'question/words/schema.json';
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
     * Validates the solution of the question.
     * Sends the keywords collection to the keyword validator.
     *
     * @param \stdClass $question
     *
     * @return array
     */
    protected function validateSolutions(\stdClass $question)
    {
        return $this->keywordValidator->validateCollection($question->solutions, ['validateScore' => true]);
    }
}
