<?php

namespace Claroline\ForumBundle\Crud;

use Claroline\AppBundle\Event\Crud\CreateEvent;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\ForumBundle\Entity\Forum;
use Claroline\ForumBundle\Entity\Message;
use Claroline\ForumBundle\Entity\Validation\User;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.crud.forum_message")
 * @DI\Tag("claroline.crud")
 */
class MessageCrud
{
    /**
     * ForumSerializer constructor.
     *
     * @DI\InjectParams({
     *     "om" = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param FinderProvider $finder
     */
    public function __construct(ObjectManager $om)
    {
        $this->om = $om;
    }

    /**
     * @DI\Observe("crud_pre_create_object_claroline_forumbundle_entity_message")
     *
     * @param CreateEvent $event
     *
     * @return ResourceNode
     */
    public function preCreate(CreateEvent $event)
    {
        /** @var ResourceNode $resourceNode */
        $message = $event->getObject();

        $forum = $this->getSubject($message)->getForum();

        if (Forum::VALIDATE_PRIOR_ALL === $forum->getValidationMode()) {
            $message->setVisible(false);
        }

        if (Forum::VALIDATE_PRIOR_ONCE === $forum->getValidationMode()) {
            $user = $this->om->getRepository('ClarolineForumBundle:Validation\User')->findOneBy([
              'user' => $message->getCreator(),
              'forum' => $forum,
            ]);

            if (!$user) {
                $user = new User();
                $user->setForum($forum);
                $user->setUser($message->getCreator());
            }

            $message->setVisible($user->getAccess());
        }

        return $message;
    }

    public function getSubject(Message $message)
    {
        if (!$message->getSubject()) {
            $parent = $message->getParent();

            return $this->getSubject($parent);
        }

        return $message->getSubject();
    }
}
