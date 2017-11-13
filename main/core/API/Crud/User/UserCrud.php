<?php

namespace Claroline\CoreBundle\API\Crud\User;

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
        $this->container   = $container;
        $this->om          = $container->get('claroline.persistence.object_manager');
        $this->roleManager = $container->get('claroline.manager.role_manager');
        $this->toolManager = $container->get('claroline.manager.tool_manager');
        $this->mailManager = $container->get('claroline.manager.mail_manager');
        $this->userManager = $container->get('claroline.manager.user_manager');
        $this->dispatcher  = $container->get('claroline.event.event_dispatcher');
        $this->config      = $container->get('claroline.config.platform_config_handler');
    }

    /**
     * @DI\Observe("crud_pre_create_object")
     *
     * @param CrudEvent $event
     */
    public function preCreate(CrudEvent $event)
    {
        if ($event->getObject() instanceof User) {
            /** @var User $user */
            $user = $event->getObject();

            $user->setPublicUrl($this->userManager->generatePublicUrl($user));
            $this->toolManager->addRequiredToolsToUser($user, 0);
            $this->toolManager->addRequiredToolsToUser($user, 1);
            $roleUser = $this->roleManager->getRoleByName(PlatformRoles::USER);
            $user->addRole($roleUser);
            $this->roleManager->createUserRole($user);
            if ($this->mailManager->isMailerAvailable()) {
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

            $this->userManager->setPersonalWorkspace($user);
        }
    }

    /**
     * @DI\Observe("crud_pre_delete_object")
     *
     * @param CrudEvent $event
     */
    public function preDelete(CrudEvent $event)
    {
        if ($event->getObject() instanceof User) {
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
    }

    /**
     * @DI\Observe("crud_pre_update_object")
     *
     * @param CrudEvent $event
     */
    public function preUpdate(CrudEvent $event)
    {
        if ($event->getObject() instanceof User) {
            //things will happen here
        }
    }
}
