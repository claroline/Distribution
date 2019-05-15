<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\AudioPlayerBundle\Listener;

use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AudioPlayerBundle\Entity\Resource\AudioParams;
use Claroline\AudioPlayerBundle\Manager\AudioPlayerManager;
use Claroline\CoreBundle\Event\GenericDataEvent;
use Claroline\CoreBundle\Event\Resource\File\LoadFileEvent;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service
 */
class ResourceAudioListener
{
    /** @var AudioPlayerManager */
    private $manager;

    /** @var SerializerProvider */
    private $serializer;

    /**
     * @DI\InjectParams({
     *     "manager"    = @DI\Inject("claroline.manager.audio_player"),
     *     "serializer" = @DI\Inject("claroline.api.serializer")
     * })
     *
     * @param AudioPlayerManager $manager
     * @param SerializerProvider $serializer
     */
    public function __construct(AudioPlayerManager $manager, SerializerProvider $serializer)
    {
        $this->manager = $manager;
        $this->serializer = $serializer;
    }

    /**
     * @DI\Observe("file.audio.load")
     *
     * @param LoadFileEvent $event
     *
     * @return array
     */
    public function onResourceAudioLoad(LoadFileEvent $event)
    {
        $node = $event->getResource()->getResourceNode();
        $audioParams = $this->manager->getAudioParams($node);

        $event->setData(array_merge($this->serializer->serialize($audioParams), $event->getData()));
    }

    /**
     * @DI\Observe("resource.file.deserialize")
     *
     * @param GenericDataEvent $event
     */
    public function onResourceAudioDeserialize(GenericDataEvent $event)
    {
        $eventData = $event->getData();
        $resourceNode = $eventData['resourceNode'];
        $data = $eventData['data'];

        if ($resourceNode) {
            $audioParams = $this->manager->getAudioParams($resourceNode);
            $this->serializer->get(AudioParams::class)->deserialize($data, $audioParams);
        }
    }
}
