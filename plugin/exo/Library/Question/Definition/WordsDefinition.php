<?php

namespace UJM\ExoBundle\Library\Question\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\AbstractInteraction;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Serializer\Answer\Type\WordsAnswerSerializer;
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
     * @var WordsAnswerSerializer
     */
    private $answerSerializer;

    /**
     * WordsDefinition constructor.
     *
     * @param WordsQuestionValidator  $validator
     * @param WordsQuestionSerializer $serializer
     * @param WordsAnswerSerializer $answerSerializer
     *
     * @DI\InjectParams({
     *     "validator"  = @DI\Inject("ujm_exo.validator.question_words"),
     *     "serializer" = @DI\Inject("ujm_exo.serializer.question_words"),
     *     "answerSerializer" = @DI\Inject("ujm_exo.serializer.answer_words")
     * })
     */
    public function __construct(
        WordsQuestionValidator $validator,
        WordsQuestionSerializer $serializer,
        WordsAnswerSerializer $answerSerializer)
    {
        $this->validator = $validator;
        $this->serializer = $serializer;
        $this->answerSerializer = $answerSerializer;
    }

    /**
     * Gets the words question mime-type.
     *
     * @return string
     */
    public function getMimeType()
    {
        return QuestionType::WORDS;
    }

    /**
     * Gets the words question entity.
     *
     * @return string
     */
    public function getEntityClass()
    {
        return 'WordsQuestion';
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

    /**
     * Gets the words answer serializer.
     *
     * @return WordsAnswerSerializer
     */
    protected function getAnswerSerializer()
    {
        return $this->answerSerializer;
    }

    public function calculateTotal(AbstractInteraction $question)
    {
        // TODO: Implement calculateTotal() method.
    }

    public function getStatistics(AbstractInteraction $wordsQuestion, array $answers)
    {
        $keywords = [];
        
        foreach ($answers as $answer) {
            $decoded = $this->convertAnswerDetails($answer);

            if ($wordsQuestion->getTypeOpenQuestion()->getValue() !== 'long') {
                // This is impossible to generate stats on long response
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
        }

        return $keywords;
    }
}
