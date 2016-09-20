<?php

namespace UJM\ExoBundle\Serializer\Question\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\InteractionOpen;
use UJM\ExoBundle\Entity\Question;
use UJM\ExoBundle\Library\Question\Handler\QuestionHandlerInterface;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;

/**
 * @DI\Service("ujm_exo.serializer.question_open")
 * @DI\Tag("ujm_exo.question.serializer")
 */
class OpenTypeSerializer implements QuestionHandlerInterface, SerializerInterface
{
    public function getQuestionMimeType()
    {
        return QuestionType::OPEN;
    }

    /**
     * Converts a Open question into a JSON-encodable structure.
     *
     * @param InteractionOpen $openQuestion
     * @param array           $options
     *
     * @return \stdClass
     */
    public function serialize($openQuestion, array $options = [])
    {
        $questionData = new \stdClass();

        $questionData->contentType = 'text';

        $questionData->score = new \stdClass();
        $questionData->score->type = 'fixed';
        $questionData->score->success = $openQuestion->getScoreMaxLongResp();
        $questionData->score->failure = 0;

        return $questionData;
    }

    /**
     * Converts raw data into an Open question entity.
     *
     * @param \stdClass $data
     * @param array     $options
     *
     * @return InteractionOpen
     */
    public function deserialize($data, array $options = [])
    {
        $openQuestion = !empty($options['entity']) ? $options['entity'] : new InteractionOpen();

        $openQuestion->setScoreMaxLongResp($data->score->success);

        if (empty($openQuestion->getTypeOpenQuestion())) {
            // TODO : set type open
        }

        return $openQuestion;
    }
}
