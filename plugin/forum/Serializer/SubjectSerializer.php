<?php

namespace Claroline\ForumBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\ForumBundle\Entity\Subject;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.forum_subject")
 * @DI\Tag("claroline.serializer")
 */
class SubjectSerializer
{
    use SerializerTrait;

    public function getClass()
    {
        return 'Claroline\ForumBundle\Entity\Subject';
    }

    /**
     * @return string
     */
    public function getSchema()
    {
        return '#/plugin/forum/subject.json';
    }

    /**
     * @return string
     */
    public function getSamples()
    {
        return '#/plugin/forum/subject';
    }

    /**
     * Serializes a Subject entity.
     *
     * @param Subject $subject
     * @param array   $options
     *
     * @return array
     */
    public function serialize(Subject $subject, array $options = [])
    {
        return [];
    }

    /**
     * Deserializes data into a Subject entity.
     *
     * @param array   $data
     * @param Subject $subject
     * @param array   $options
     *
     * @return Forum
     */
    public function deserialize($data, Subject $subject, array $options = [])
    {
        return $subject;
    }
}
