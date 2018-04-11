<?php

namespace Claroline\ForumBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\ForumBundle\Entity\Forum;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.forum")
 * @DI\Tag("claroline.serializer")
 */
class ForumSerializer
{
    use SerializerTrait;

    public function getClass()
    {
        return 'Claroline\ForumBundle\Entity\Forum';
    }

    /**
     * @return string
     */
    public function getSchema()
    {
        return '#/plugin/forum/forum.json';
    }

    /**
     * @return string
     */
    public function getSamples()
    {
        return '#/plugin/forum/forum';
    }

    /**
     * Serializes a Forum entity.
     *
     * @param Forum $forum
     * @param array $options
     *
     * @return array
     */
    public function serialize(Forum $forum, array $options = [])
    {
        return [
            'id' => $forum->getUuid(),
        ];
    }

    /**
     * Deserializes data into a Forum entity.
     *
     * @param array $data
     * @param Forum $forum
     * @param array $options
     *
     * @return Forum
     */
    public function deserialize($data, Forum $forum, array $options = [])
    {
        return $forum;
    }
}
