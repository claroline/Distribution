<?php

namespace UJM\ExoBundle\Serializer\Misc;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\WordResponse;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;

/**
 * Serializer for keyword data.
 *
 * @DI\Service("ujm_exo.serializer.keyword")
 */
class KeywordSerializer implements SerializerInterface
{
    /**
     * Converts a Keyword into a JSON-encodable structure.
     *
     * @param WordResponse $keyword
     * @param array        $options
     *
     * @return \stdClass
     */
    public function serialize($keyword, array $options = [])
    {
        $keywordData = new \stdClass();
        $keywordData->text = $keyword->getText();
        $keywordData->caseSensitive = $keyword->isCaseSensitive();
        $keywordData->score = $keyword->getScore();

        if ($keyword->getFeedback()) {
            $keywordData->feedback = $keyword->getFeedback();
        }

        return $keywordData;
    }

    /**
     * Converts raw data into a Keyword entity.
     *
     * @param \stdClass $data
     * @param array     $options
     *
     * @return WordResponse
     */
    public function deserialize($data, array $options = [])
    {
        $keyword = !empty($options['entity']) ? $options['entity'] : new WordResponse();

        $keyword->setText($data->text);
        $keyword->setCaseSensitive($data->caseSensitive);
        $keyword->setScore($data->score);

        if (isset($data->feedback)) {
            $keyword->setFeedback($data->feedback);
        }

        return $keyword;
    }
}
