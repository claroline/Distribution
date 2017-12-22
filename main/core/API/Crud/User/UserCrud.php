<?php

namespace Claroline\CoreBundle\API\Crud\User;

use Claroline\CoreBundle\API\Options;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Event\CrudEvent;
use Claroline\CoreBundle\Library\Configuration\PlatformDefaults;
use Claroline\CoreBundle\Security\PlatformRoles;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * @DI\Service("claroline.crud.user")
 * @DI\Tag("claroline.crud")
 */
class UserCrud
{
    /**
     * @DI\InjectParams({
     *     "container" = @DI\Inject("service_container")
     * })
     *
     * @param ContainerInterface $container
     */
    public function __construct(ContainerInterface $container)
    {
        //too many dependencies, simplify this when we can
        $this->container = $container;
        $this->om = $container->get('claroline.persistence.object_manager');
        $this->roleManager = $container->get('claroline.manager.role_manager');
        $this->toolManager = $container->get('claroline.manager.tool_manager');
        $this->mailManager = $container->get('claroline.manager.mail_manager');
        $this->userManager = $container->get('claroline.manager.user_manager');
        $this->dispatcher = $container->get('claroline.event.event_dispatcher');
        $this->config = $container->get('claroline.config.platform_config_handler');
    }

    /**
     * @DI\Observe("crud_pre_create_object_claroline_corebundle_entity_user")
     *
     * @param CrudEvent $event
     */
    public function preCreate(CrudEvent $event)
    {
        $this->create($event->getObject(), $event->getOptions());
    }

    /**
     * @DI\Observe("crud_post_create_object_claroline_corebundle_entity_user")
     *
     * @param CrudEvent $event
     */
    public function postCreate(CrudEvent $event)
    {
        if (in_array(Options::USER_SELF_LOG, $event->getOptions())) {
            $this->userManager->logUser($event->getObject());
        }
    }

    public function create(User $user, $options = [], $extra = [])
    {
        $this->om->startFlushSuite();
        $user->setPublicUrl($this->userManager->generatePublicUrl($user));
        $this->toolManager->addRequiredToolsToUser($user, 0);
        $this->toolManager->addRequiredToolsToUser($user, 1);
        $roleUser = $this->roleManager->getRoleByName(PlatformRoles::USER);
        $user->addRole($roleUser);
        $this->roleManager->createUserRole($user);

        if ($this->mailManager->isMailerAvailable() && in_array(Options::SEND_EMAIL, $options)) {
            //send a validation by hash
            $mailValidation = $this->config->getParameter('registration_mail_validation');
            if ($mailValidation === PlatformDefaults::REGISTRATION_MAIL_VALIDATION_FULL) {
                $password = sha1(rand(1000, 10000).$user->getUsername().$user->getSalt());
                $user->setResetPasswordHash($password);
                $user->setIsEnabled(false);
                $this->mailManager->sendEnableAccountMessage($user);
            } elseif ($mailValidation === PlatformDefaults::REGISTRATION_MAIL_VALIDATION_PARTIAL) {
                //don't change anything
                $this->mailManager->sendCreationMessage($user);
            }
        }

        $this->om->persist($user);

        if (in_array(Options::ADD_NOTIFICATIONS, $options)) {
            //i'm not sure we can depend on that one
            $nManager = $this->container->get('icap.notification.manager.notification_user_parameters');
            $notifications = $this->config->getParameter('auto_enable_notifications');
            $nManager->processUpdate($notifications, $user);
        }

        if (in_array(Options::ADD_PERSONAL_WORKSPACE, $options)) {
            $this->userManager->setPersonalWorkspace($user, isset($extra['model']) ? $extra['model'] : null);
        }
        //we need this line for the log system
        //dispatch some events but they should be listening the same as we are imo.
        //something should be done for event listeners
        $this->dispatcher->dispatch('user_created_event', 'UserCreated', ['user' => $user]);
        $this->dispatcher->dispatch('log', 'Log\LogUserCreate', [$user]);
        $this->om->endFlushSuite();
    }

    /**
     * @DI\Observe("crud_pre_delete_object_claroline_corebundle_entity_user")
     *
     * @param CrudEvent $event
     */
    public function preDelete(CrudEvent $event)
    {
        /** @var User $user */
        $user = $event->getObject();
        $userRole = $this->roleManager->getUserRole($user->getUsername());

        //soft delete~
        $user->setIsRemoved(true);
        $user->setMail('mail#'.$user->getId());
        $user->setFirstName('firstname#'.$user->getId());
        $user->setLastName('lastname#'.$user->getId());
        $user->setPlainPassword(uniqid());
        $user->setUsername('username#'.$user->getId());
        $user->setPublicUrl('removed#'.$user->getId());
        $user->setAdministrativeCode('code#'.$user->getId());
        $user->setIsEnabled(false);

        // keeping the user's workspace with its original code
        // would prevent creating a user with the same username
        // todo: workspace deletion should be an option
        $ws = $user->getPersonalWorkspace();

        if ($ws) {
            $ws->setCode($ws->getCode().'#deleted_user#'.$user->getId());
            $ws->setDisplayable(false);
            $this->om->persist($ws);
        }

        if ($userRole) {
            $this->om->remove($userRole);
        }
        $this->om->persist($user);
        $this->om->flush();

        //dispatch some events but they should be listening the same as we are imo.
        //something should be done for event listeners
        $this->dispatcher->dispatch('claroline_users_delete', 'GenericData', [[$user]]);
        $this->dispatcher->dispatch('log', 'Log\LogUserDelete', [$user]);
        $this->dispatcher->dispatch('delete_user', 'DeleteUser', [$user]);
    }

    /**
     * @DI\Observe("crud_pre_update_object_claroline_corebundle_entity_user")
     *
     * @param CrudEvent $event
     */
    public function preUpdate(CrudEvent $event)
    {
        //do stuff here
    }
}
