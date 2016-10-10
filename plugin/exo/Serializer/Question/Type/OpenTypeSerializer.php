<?php

namespace UJM\ExoBundle\Serializer\Question\Type;

use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\InteractionOpen;
use UJM\ExoBundle\Entity\TypeOpenQuestion;
use UJM\ExoBundle\Library\Question\Handler\QuestionHandlerInterface;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;

/**
 * @DI\Service("ujm_exo.serializer.question_open")
 * @DI\Tag("ujm_exo.question.serializer")
 */
class OpenTypeSerializer implements QuestionHandlerInterface, SerializerInterface
{
    /**
     * @var ObjectManager
     */
    private $om;

    /**
     * OpenTypeSerializer constructor.
     *
     * @param ObjectManager $om
     *
     * @DI\InjectParams({
     *     "om" = @DI\Inject("claroline.persistence.object_manager")
     * })
     */
    public function __construct(ObjectManager $om)
    {
        $this->om = $om;
    }

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
     * @param \stdClass       $data
     * @param InteractionOpen $openQuestion
     * @param array           $options
     *
     * @return InteractionOpen
     */
    public function deserialize($data, $openQuestion = null, array $options = [])
    {
        $openQuestion = !empty($options['entity']) ? $options['entity'] : new InteractionOpen();

        $openQuestion->setScoreMaxLongResp($data->score->success);

        if (empty($openQuestion->getTypeOpenQuestion())) {
            /** @var TypeOpenQuestion $type */
            $type = $this->om->getRepository('UJMExoBundle:TypeOpenQuestion')->findOneBy([
                'value' => 'long',
            ]);

            $openQuestion->setTypeOpenQuestion($type);
        }

        return $openQuestion;
    }
}
