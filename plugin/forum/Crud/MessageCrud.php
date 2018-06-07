<?php

namespace Claroline\ForumBundle\Crud;

use Claroline\AppBundle\Event\Crud\CreateEvent;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\ForumBundle\Entity\Forum;
use Claroline\ForumBundle\Entity\Message;
use Claroline\ForumBundle\Entity\Validation\User;
use Claroline\ForumBundle\Manager\Manager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

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
     *     "om"           = @DI\Inject("claroline.persistence.object_manager"),
     *     "tokenStorage" = @DI\Inject("security.token_storage"),
     *     "manager"      = @DI\Inject("claroline.manager.forum_manager")
     * })
     *
     * @param FinderProvider $finder
     */
    public function __construct(ObjectManager $om, TokenStorageInterface $tokenStorage, Manager $manager)
    {
        $this->om = $om;
        $this->tokenStorage = $tokenStorage;
        $this->manager = $manager;
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

    /**
     * @DI\Observe("crud_post_create_object_claroline_forumbundle_entity_message")
     *
     * @param CreateEvent $event
     *
     * @return ResourceNode
     */
    public function postCreate(CreateEvent $event)
    {
        $message = $event->getObject();
        $forum = $message->getSubject()->getForum();
        $user = $this->tokenStorage->getToken()->getUser();
        $userValidate = $this->manager->getValidationUser($user, $forum);

        if ($userValidate->isNotified()) {
            //envoyer le message vers la messagerie
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
