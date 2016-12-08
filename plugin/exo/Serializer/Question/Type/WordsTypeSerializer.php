<?php

namespace UJM\ExoBundle\Serializer\Question\Type;

use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\InteractionOpen;
use UJM\ExoBundle\Entity\TypeOpenQuestion;
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
     * @var ObjectManager
     */
    private $om;

    /**
     * @var KeywordSerializer
     */
    private $keywordSerializer;

    /**
     * ClozeTypeSerializer constructor.
     *
     * @param ObjectManager     $om
     * @param KeywordSerializer $keywordSerializer
     *
     * @DI\InjectParams({
     *     "om"                = @DI\Inject("claroline.persistence.object_manager"),
     *     "keywordSerializer" = @DI\Inject("ujm_exo.serializer.keyword")
     * })
     */
    public function __construct(
        ObjectManager $om,
        KeywordSerializer $keywordSerializer)
    {
        $this->om = $om;
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
     * @param \stdClass       $data
     * @param InteractionOpen $wordsQuestion
     * @param array           $options
     *
     * @return InteractionOpen
     */
    public function deserialize($data, $wordsQuestion = null, array $options = [])
    {
        if (empty($wordsQuestion)) {
            $wordsQuestion = new InteractionOpen();
        }

        // TODO : make a distinction between oneWord / short

        /** @var TypeOpenQuestion $type */
        $type = $this->om->getRepository('UJMExoBundle:TypeOpenQuestion')->findOneBy([
            'value' => 'short',
        ]);

        $wordsQuestion->setTypeOpenQuestion($type);

        $this->deserializeSolutions($wordsQuestion, $data->solutions, $options);

        return $wordsQuestion;
    }

    private function serializeSolutions(InteractionOpen $wordsQuestion)
    {
        return array_map(function (WordResponse $keyword) {
            return $this->keywordSerializer->serialize($keyword);
        }, $wordsQuestion->getKeywords()->toArray());
    }

    /**
     * Deserializes Question solutions (= a collection of keywords).
     *
     * @param InteractionOpen $wordsQuestion
     * @param array           $solutions
     * @param array           $options
     */
    private function deserializeSolutions(InteractionOpen $wordsQuestion, array $solutions, array $options = [])
    {
        $updatedKeywords = $this->keywordSerializer->deserializeCollection($solutions, $wordsQuestion->getKeywords()->toArray(), $options);

        // Replace keywords collection by the updated one
        $wordsQuestion->setKeywords($updatedKeywords);
    }
}
