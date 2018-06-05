<?php

namespace Claroline\ForumBundle\Serializer;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\Event\GenericDataEvent;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use Claroline\ForumBundle\Entity\Forum;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * @DI\Service("claroline.serializer.forum")
 * @DI\Tag("claroline.serializer")
 */
class ForumSerializer
{
    private $finder;

    /**
     * ForumSerializer constructor.
     *
     * @DI\InjectParams({
     *     "container" = @DI\Inject("service_container")
     * })
     *
     * @param FinderProvider $finder
     */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

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
        $finder = $this->container->get('claroline.api.finder');

        return [
            'id' => $forum->getUuid(),
            'validationMode' => $forum->getValidationMode(),
            'maxComment' => $forum->getMaxComment(),
            'displayMessage' => $forum->getDisplayMessages(),
            'display' => [
              'description' => 'il faut causer sur ce forum !',
              'showOverview' => true,
              'dataList' => $forum->getDataListOptions(),
            ],
            'restrictions' => [
              'lockDate' => $forum->getLockDate() ? $forum->getLockDate()->format('Y-m-d\TH:i:s') : null,
            ],
            'flag' => [
              'enabled' => true,
            ],
            'moderation' => [
              'enabled' => false,
            ],
            'meta' => [
              'users' => 34, //utilisateur participants
              'subjects' => $finder->fetch('Claroline\ForumBundle\Entity\Subject', ['forum' => $forum->getUuid()], null, 0, 0, true),
              'messages' => $finder->fetch('Claroline\ForumBundle\Entity\Message', ['forum' => $forum->getUuid()], null, 0, 0, true),
              'tags' => $this->getTags($forum),
            ],
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
        $this->sipe('validationMode', 'setValidationMode', $data, $forum);
        $this->sipe('maxComment', 'setMaxComment', $data, $forum);
        $this->sipe('displayMessage', 'setDisplayMessage', $data, $forum);
        $this->sipe('display.dataList', 'setDataListOptions', $data, $forum);

        if (isset($data['restrictions'])) {
            if (isset($data['restrictions']['lockDate'])) {
                $forum->setLockDate(DateNormalizer::denormalize($data['restrictions']['lockDate']));
            }
        }

        return $forum;
    }

    public function getTags(Forum $forum)
    {
        $subjects = $forum->getSubjects();
        $availables = [];
        //pas terrible comme manière de procéder mais je n'en ai pas d'autre actuellement
        //on va dire que c'est une première version

        foreach ($subjects as $subject) {
            $event = new GenericDataEvent([
                'class' => 'Claroline\ForumBundle\Entity\Subject',
                'ids' => [$subject->getUuid()],
            ]);

            $this->container->get('event_dispatcher')->dispatch(
                'claroline_retrieve_used_tags_by_class_and_ids',
                $event
            );

            $tags = $event->getResponse();
            $availables = array_merge($availables, $tags);
        }

        return array_unique($availables);
    }
}
