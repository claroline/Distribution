<?php

namespace UJM\ExoBundle\Serializer\Question\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\InteractionOpen;
use UJM\ExoBundle\Entity\WordResponse;
use UJM\ExoBundle\Library\Question\Handler\QuestionHandlerInterface;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;
use UJM\ExoBundle\Serializer\Misc\KeywordSerializer;

/**
 * @DI\Service("ujm_exo.serializer.question_words")
 * @DI\Tag("ujm_exo.question.serializer")
 */
class WordsTypeSerializer implements QuestionHandlerInterface, SerializerInterface
{
    /**
     * @var KeywordSerializer
     */
    private $keywordSerializer;

    /**
     * ClozeTypeSerializer constructor.
     *
     * @param KeywordSerializer $keywordSerializer
     *
     * @DI\InjectParams({
     *     "keywordSerializer" = @DI\Inject("ujm_exo.serializer.keyword")
     * })
     */
    public function __construct(KeywordSerializer $keywordSerializer)
    {
        $this->keywordSerializer = $keywordSerializer;
    }

    public function getQuestionMimeType()
    {
        return QuestionType::WORDS;
    }

    /**
     * Converts a Words question into a JSON-encodable structure.
     *
     * @param InteractionOpen $wordsQuestion
     * @param array           $options
     *
     * @return \stdClass
     */
    public function serialize($wordsQuestion, array $options = [])
    {
        $questionData = new \stdClass();

        if (isset($options['includeSolutions']) && $options['includeSolutions']) {
            $questionData->solutions = $this->serializeSolutions($wordsQuestion);
        }

        // Serializes score type
        $questionData->score = new \stdClass();
        $questionData->score->type = 'sum';

        return $questionData;
    }

    /**
     * Converts raw data into an Words question entity.
     *
     * @param \stdClass $data
     * @param array     $options
     *
     * @return InteractionOpen
     */
    public function deserialize($data, array $options = [])
    {
        $wordsQuestion = !empty($options['entity']) ? $options['entity'] : new InteractionOpen();

        // TODO : set type open

        return $wordsQuestion;
    }

    private function serializeSolutions(InteractionOpen $wordsQuestion)
    {
        return array_map(function (WordResponse $keyword) {
            return $this->keywordSerializer->serialize($keyword);
        }, $wordsQuestion->getKeywords()->toArray());
    }
}
