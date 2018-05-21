<?php

namespace Claroline\ForumBundle\Serializer;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use Claroline\ForumBundle\Entity\Subject;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerInterface;

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
     * @DI\InjectParams({
     *      "provider" = @DI\Inject("claroline.api.serializer"),
     *      "container" = @DI\Inject("service_container")
     * })
     *
     * @param SerializerProvider $serializer
     */
    public function __construct(SerializerProvider $provider, ContainerInterface $container)
    {
        $this->serializerProvider = $provider;
        $this->container = $container;
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
        return [
          'id' => $subject->getUuid(),
          'forum' => [
            'id' => $subject->getForum()->getUuid(),
          ],
          'content' => $subject->getContent(),
          'title' => $subject->getTitle(),
          'meta' => $this->serializeMeta($subject, $options),
          'restrictions' => $this->serializeRestrictions($subject, $options),
        ];
    }

    public function serializeMeta(Subject $subject, array $options = [])
    {
        $finder = $this->container->get('claroline.api.finder');

        return [
            'views' => $subject->getViewCount(),
            'messages' => $finder->fetch('Claroline\ForumBundle\Entity\Message', 0, 0, ['subject' => $subject->getUuid(), 'parent' => null], null, true),
            'creator' => !empty($subject->getCreator()) ? $this->serializerProvider->serialize($subject->getCreator(), [Options::SERIALIZE_MINIMAL]) : null,
            'created' => $subject->getCreationDate()->format('Y-m-d\TH:i:s'),
            'updated' => $subject->getModificationDate()->format('Y-m-d\TH:i:s'),
            'sticky' => $subject->isSticked(),
            'closed' => $subject->isClosed(),
        ];
    }

    public function serializeRestrictions(Subject $subject, array $options = [])
    {
        return [
          'sticky' => true,
          'edit' => true,
          'delete' => false,
        ];
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
        $this->sipe('id', 'setUuid', $data, $subject);
        $this->sipe('title', 'setTitle', $data, $subject);
        $this->sipe('content', 'setContent', $data, $subject);
        $this->sipe('meta.sticky', 'setIsSticked', $data, $subject);
        $this->sipe('meta.closed', 'setIsClosed', $data, $subject);

        if (isset($data['meta'])) {
            if (isset($data['meta']['updated'])) {
                $subject->setModificationDate(DateNormalizer::denormalize($data['meta']['updated']));
            }

            if (isset($data['meta']['creator'])) {
                $subject->setAuthor($data['meta']['creator']['name']);

                // TODO: reuse value from token Storage if new
                $creator = $this->serializerProvider->deserialize(
                    'Claroline\CoreBundle\Entity\User',
                    $data['meta']['creator']
                );

                if ($creator) {
                    $subject->setCreator($creator);
                }
            }
        }

        if (!empty($data['forum'])) {
            $forum = $this->serializerProvider->deserialize(
                'Claroline\ForumBundle\Entity\Forum',
                $data['forum']
            );

            if ($forum) {
                $subject->setForum($forum);
            }
        }

        return $subject;
    }
}
