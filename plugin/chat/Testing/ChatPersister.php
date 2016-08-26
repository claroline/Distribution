<?php

namespace Claroline\ChatBundle\Testing;

use Claroline\ChatBundle\Entity\ChatRoom;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * @DI\Service("claroline.chat_bundle.testing.persister")
 */
class ChatPersister
{
    /**
     * @var ObjectManager
     */
    private $om;

    /**
     * @var Role
     */
    private $userRole;

    /**
     * @var ContainerInterface
     */
    private $container;

    /**
     * @DI\InjectParams({
     *     "om"        = @DI\Inject("claroline.persistence.object_manager"),
     *     "container" = @DI\Inject("service_container")
     * })
     */
    public function __construct(ObjectManager $om, ContainerInterface $container)
    {
        $this->om = $om;
        $this->container = $container;
    }

    public function chatRoom($name, $type, $status, User $owner)
    {
        $resourceType = $this->om->getRepository('ClarolineCoreBundle:Resource\ResourceType')->findOneByName('claroline_chat_room');
        $chatRoom = new ChatRoom();
        $chatRoom->setName($name);
        $chatRoom->setRoomName(uniqid());
        $chatRoom->setRoomType($type);
        $chatRoom->setRoomStatus($status);
        $this->om->persist($chatRoom);
        $this->container->get('claroline.manager.resource_manager')->create($chatRoom, $resourceType, $owner);

        return $chatRoom;
    }

    public function persist($entity)
    {
        $this->om->persist($entity);
    }

    public function flush()
    {
        $this->om->flush();
    }
}
