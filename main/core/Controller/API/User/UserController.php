<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\API\User;

use Claroline\CoreBundle\API\FinderProvider;
use Claroline\CoreBundle\Entity\Group;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Event\StrictDispatcher;
use Claroline\CoreBundle\Library\Security\Collection\UserCollection;
use Claroline\CoreBundle\Manager\ApiManager;
use Claroline\CoreBundle\Manager\AuthenticationManager;
use Claroline\CoreBundle\Manager\FacetManager;
use Claroline\CoreBundle\Manager\GroupManager;
use Claroline\CoreBundle\Manager\LocaleManager;
use Claroline\CoreBundle\Manager\MailManager;
use Claroline\CoreBundle\Manager\ProfilePropertyManager;
use Claroline\CoreBundle\Manager\RoleManager;
use Claroline\CoreBundle\Manager\UserManager;
use Claroline\CoreBundle\Manager\WorkspaceManager;
use Claroline\CoreBundle\Persistence\ObjectManager;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations\NamePrefix;
use FOS\RestBundle\Controller\Annotations\Post;
use FOS\RestBundle\Controller\Annotations\View;
use FOS\RestBundle\Controller\FOSRestController;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Form\FormFactory;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * @NamePrefix("api_")
 */
class UserController extends FOSRestController
{
    private $authenticationManager;
    private $eventDispatcher;
    private $formFactory;
    private $localeManager;
    private $request;
    private $userManager;
    private $groupManager;
    private $roleManager;
    private $workspaceManager;
    private $om;
    private $userRepo;
    private $roleRepo;
    private $groupRepo;
    private $profilePropertyManager;
    private $mailManager;
    private $apiManager;
    private $facetManager;

    /**
     * @DI\InjectParams({
     *     "authenticationManager"  = @DI\Inject("claroline.common.authentication_manager"),
     *     "formFactory"            = @DI\Inject("form.factory"),
     *     "eventDispatcher"        = @DI\Inject("claroline.event.event_dispatcher"),
     *     "localeManager"          = @DI\Inject("claroline.manager.locale_manager"),
     *     "request"                = @DI\Inject("request"),
     *     "roleManager"            = @DI\Inject("claroline.manager.role_manager"),
     *     "userManager"            = @DI\Inject("claroline.manager.user_manager"),
     *     "groupManager"           = @DI\Inject("claroline.manager.group_manager"),
     *     "facetManager"           = @DI\Inject("claroline.manager.facet_manager"),
     *     "om"                     = @DI\Inject("claroline.persistence.object_manager"),
     *     "profilePropertyManager" = @DI\Inject("claroline.manager.profile_property_manager"),
     *     "mailManager"            = @DI\Inject("claroline.manager.mail_manager"),
     *     "apiManager"             = @DI\Inject("claroline.manager.api_manager"),
     *     "workspaceManager"       = @DI\Inject("claroline.manager.workspace_manager"),
     *     "finder"                 = @DI\Inject("claroline.api.finder")
     * })
     *
     * @param AuthenticationManager  $authenticationManager
     * @param StrictDispatcher       $eventDispatcher
     * @param FormFactory            $formFactory
     * @param LocaleManager          $localeManager
     * @param Request                $request
     * @param UserManager            $userManager
     * @param GroupManager           $groupManager
     * @param RoleManager            $roleManager
     * @param FacetManager           $facetManager
     * @param ObjectManager          $om
     * @param ProfilePropertyManager $profilePropertyManager
     * @param MailManager            $mailManager
     * @param ApiManager             $apiManager
     * @param WorkspaceManager       $workspaceManager
     */
    public function __construct(
        AuthenticationManager $authenticationManager,
        StrictDispatcher $eventDispatcher,
        FormFactory $formFactory,
        LocaleManager $localeManager,
        Request $request,
        UserManager $userManager,
        GroupManager $groupManager,
        RoleManager $roleManager,
        FacetManager $facetManager,
        ObjectManager $om,
        ProfilePropertyManager $profilePropertyManager,
        MailManager $mailManager,
        ApiManager $apiManager,
        WorkspaceManager $workspaceManager,
        FinderProvider $finder
    ) {
        $this->authenticationManager = $authenticationManager;
        $this->eventDispatcher = $eventDispatcher;
        $this->formFactory = $formFactory;
        $this->localeManager = $localeManager;
        $this->request = $request;
        $this->userManager = $userManager;
        $this->groupManager = $groupManager;
        $this->roleManager = $roleManager;
        $this->workspaceManager = $workspaceManager;
        $this->om = $om;
        $this->userRepo = $om->getRepository('ClarolineCoreBundle:User');
        $this->roleRepo = $om->getRepository('ClarolineCoreBundle:Role');
        $this->groupRepo = $om->getRepository('ClarolineCoreBundle:Group');
        $this->profilePropertyManager = $profilePropertyManager;
        $this->mailManager = $mailManager;
        $this->apiManager = $apiManager;
        $this->facetManager = $facetManager;
        $this->finder = $finder;
    }

    /**
     * @Get("/user/{user}/public", name="get_public_user", options={ "method_prefix" = false })
     *
     * @todo remove me
     */
    public function getPublicUserAction(User $user)
    {
        return $this->container->get('claroline.serializer.user')->serialize($user, ['public' => true]);
    }

    /**
     * what is this ?
     *
     * @View()
     */
    public function usersPasswordInitializeAction()
    {
        $users = $this->apiManager->getParameters('userIds', 'Claroline\CoreBundle\Entity\User');
        $this->throwExceptionIfNotGranted('edit', $users);

        foreach ($users as $user) {
            $this->mailManager->sendForgotPassword($user);
        }

        return ['success'];
    }

    /**
     * @View(serializerGroups={"api_user"})
     * @Post("/users/csv/remove")
     */
    public function csvRemoveUserAction()
    {
        $this->throwsExceptionIfNotAdmin();

        $this->userManager->csvRemove($this->request->files->get('csv'));
    }

    /**
     * @View(serializerGroups={"api_user"})
     * @Post("/users/csv/facets")
     */
    public function csvImportFacetsAction()
    {
        $this->throwsExceptionIfNotAdmin();

        $this->userManager->csvFacets($this->request->files->get('csv'));
    }

    private function isAdmin()
    {
        return $this->container->get('security.authorization_checker')->isGranted('ROLE_ADMIN');
    }

    private function throwsExceptionIfNotAdmin()
    {
        if (!$this->isAdmin()) {
            throw new AccessDeniedException('This action can only be done by the administrator');
        }
    }

    private function isUserGranted($action, $object)
    {
        return $this->container->get('security.authorization_checker')->isGranted($action, $object);
    }

    /**
     * @View(serializerGroups={"api_user"})
     * @Post("/pws/create/{user}")
     */
    public function createPersonalWorkspaceAction(User $user)
    {
        if (!$user->getPersonalWorkspace()) {
            $this->userManager->setPersonalWorkspace($user);
        } else {
            throw new \Exception('Workspace already exists');
        }

        return $user;
    }

    /**
     * @View(serializerGroups={"api_user"})
     * @Post("/pws/delete/{user}")
     */
    public function deletePersonalWorkspaceAction(User $user)
    {
        $personalWorkspace = $user->getPersonalWorkspace();
        $this->eventDispatcher->dispatch('log', 'Log\LogWorkspaceDelete', [$personalWorkspace]);
        $this->workspaceManager->deleteWorkspace($personalWorkspace);

        return $user;
    }

    private function throwExceptionIfNotGranted($action, $users)
    {
        $collection = is_array($users) ? new UserCollection($users) : new UserCollection([$users]);
        $isGranted = $this->isUserGranted($action, $collection);

        if (!$isGranted) {
            $userlist = '';

            foreach ($collection->getUsers() as $user) {
                $userlist .= "[{$user->getUsername()}]";
            }
            throw new AccessDeniedException("You can't do the action [{$action}] on the user list {$userlist}");
        }
    }
}
