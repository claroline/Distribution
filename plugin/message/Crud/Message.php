<?php

namespace Claroline\MessageBundle\Crud;

use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Event\Crud\CreateEvent;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\MessageSerializer as AbstractMessageSerializer;
use Claroline\MessageBundle\Manager\MessageManager;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.crud.messaging.message")
 * @DI\Tag("claroline.crud")
 */
class Message
{
    /**
     * ParametersSerializer constructor.
     *
     * @DI\InjectParams({
     *     "om"           = @DI\Inject("claroline.persistence.object_manager"),
     *     "manager"      = @DI\Inject("claroline.manager.message_manager"),
     * })
     *
     * @param SerializerProvider        $serializer
     * @param AbstractMessageSerializer $messageSerializer
     */
    public function __construct(
        ObjectManager $om,
        MessageManager $manager
    ) {
        $this->om = $om;
        $this->manager = $manager;
    }

    /**
     * @DI\Observe("crud_post_create_object_claroline_messagebundle_entity_message")
     *
     * @param CreateEvent $event
     */
    public function postCreate(CreateEvent $event)
    {
        $this->manager->send($event->getObject());
    }
}
