<?php

namespace Icap\LessonBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Icap\LessonBundle\Entity\Chapter;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("icap.serializer.lesson.chapter")
 * @DI\Tag("claroline.serializer")
 */
class ChapterSerializer
{
    use SerializerTrait;

    /** @var ObjectManager */
    private $om;

    /**
     * ChapterSerializer constructor.
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
     * @return string
     */
    public function getClass()
    {
        return 'Icap\LessonBundle\Entity\Chapter';
    }

    /**
     * @return string
     */
    public function getSchema()
    {
        return '#/plugin/lesson/chapter.json';
    }

    /**
     * Serializes a Chapter entity for the JSON api.
     *
     * @param Chapter $chapter - the Chapter resource to serialize
     * @param array   $options - a list of serialization options
     *
     * @return array - the serialized representation of the Chapter resource
     */
    public function serialize(Chapter $chapter, array $options = [])
    {
        $serialized = [
            'id' => $chapter->getUuid(),
            'title' => $chapter->getTitle(),
            'text' => $chapter->getText(),
            'previousId' => null,
            'nextId' => null,
        ];

        return $serialized;
    }
}
