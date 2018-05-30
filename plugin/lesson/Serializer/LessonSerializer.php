<?php

namespace Icap\LessonBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Icap\LessonBundle\Entity\Lesson;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("icap.serializer.lesson")
 * @DI\Tag("claroline.serializer")
 */
class LessonSerializer
{
    use SerializerTrait;

    /** @var ObjectManager */
    private $om;

    /**
     * LessonSerializer constructor.
     *
     * @DI\InjectParams({
     *     "om" = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param ObjectManager $om
     */
    public function __construct(ObjectManager $om)
    {
        $this->om = $om;
    }

    /**
     * Serializes a Lesson entity for the JSON api.
     *
     * @param Lesson $lesson  - the Lesson resource to serialize
     * @param array  $options - a list of serialization options
     *
     * @return array - the serialized representation of the Lesson resource
     */
    public function serialize(Lesson $lesson, array $options = [])
    {
        $serialized = [
            //'id' => $chapter->getUuid(),
            'autoId' => $lesson->getId(),
            'title' => $lesson->getResourceNode()->getName(),
        ];

        return $serialized;
    }
}
