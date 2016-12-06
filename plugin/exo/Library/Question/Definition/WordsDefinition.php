<?php

namespace UJM\ExoBundle\Library\Question\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\QuestionType\AbstractQuestion;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Serializer\Question\Type\WordsQuestionSerializer;
use UJM\ExoBundle\Validator\JsonSchema\Question\Type\WordsQuestionValidator;

/**
 * Words question definition.
 *
 * @DI\Service("ujm_exo.definition.question_words")
 * @DI\Tag("ujm_exo.definition.question")
 */
class WordsDefinition extends AbstractDefinition
{
    /**
     * @var WordsQuestionValidator
     */
    private $validator;

    /**
     * @var WordsQuestionSerializer
     */
    private $serializer;

    /**
     * WordsDefinition constructor.
     *
     * @param WordsQuestionValidator  $validator
     * @param WordsQuestionSerializer $serializer
     *
     * @DI\InjectParams({
     *     "validator"  = @DI\Inject("ujm_exo.validator.question_words"),
     *     "serializer" = @DI\Inject("ujm_exo.serializer.question_words")
     * })
     */
    public function __construct(
        WordsQuestionValidator $validator,
        WordsQuestionSerializer $serializer)
    {
        $this->validator = $validator;
        $this->serializer = $serializer;
    }

    /**
     * Gets the words question mime-type.
     *
     * @return string
     */
    public static function getMimeType()
    {
        return QuestionType::WORDS;
    }

    /**
     * Gets the words question entity.
     *
     * @return string
     */
    public static function getEntityClass()
    {
        return '\UJM\ExoBundle\Entity\QuestionType\OpenQuestion';
    }

    /**
     * Gets the words question validator.
     *
     * @return WordsQuestionValidator
     */
    protected function getQuestionValidator()
    {
        return $this->validator;
    }

    /**
     * Gets the words question serializer.
     *
     * @return WordsQuestionSerializer
     */
    protected function getQuestionSerializer()
    {
        return $this->serializer;
    }

    public function correctAnswer(AbstractQuestion $question, $answer)
    {
        // TODO: Implement correctAnswer() method.
    }

    public function expectAnswer(AbstractQuestion $question)
    {
        // TODO: Implement expectAnswer() method.
    }

    public function getStatistics(AbstractQuestion $wordsQuestion, array $answers)
    {
        $keywords = [];

        foreach ($answers as $answer) {
            $decoded = $this->convertAnswerDetails($answer);

            /** @var Keyword $keyword */
            foreach ($wordsQuestion->getKeywords() as $keyword) {
                $flags = $keyword->isCaseSensitive() ? 'i' : '';
                if (1 === preg_match('/'.$keyword->getText().'/'.$flags, $decoded)) {
                    if (!isset($keywords[$keyword->getId()])) {
                        // First answer to contain the keyword
                        $keywords[$keyword->getId()] = new \stdClass();
                        $keywords[$keyword->getId()]->id = $keyword->getId();
                        $keywords[$keyword->getId()]->count = 0;
                    }

                    ++$keywords[$keyword->getId()]->count;
                }
            }
        }

        return $keywords;
    }
}
