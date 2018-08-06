<?php
/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
namespace Claroline\MessageBundle\Controller;
use Claroline\CoreBundle\Entity\Group;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Library\Security\Utilities;
use Claroline\CoreBundle\Manager\GroupManager;
use Claroline\CoreBundle\Manager\MailManager;
use Claroline\CoreBundle\Manager\UserManager;
use Claroline\CoreBundle\Manager\WorkspaceManager;
use Claroline\CoreBundle\Pager\PagerFactory;
use Claroline\MessageBundle\Entity\Message;
use Claroline\MessageBundle\Manager\MessageManager;
use JMS\DiExtraBundle\Annotation as DI;
use JMS\SecurityExtraBundle\Annotation as SEC;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\Form\FormFactory;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
/**
 * @DI\Tag("security.secure_service")
 * @SEC\PreAuthorize("hasRole('ROLE_USER')")
 */
class MessageController
{
    private $formFactory;
    private $groupManager;
    private $mailManager;
    private $messageManager;
    private $pagerFactory;
    private $request;
    private $router;
    private $tokenStorage;
    private $userManager;
    private $utils;
    private $workspaceManager;
    /**
     * @DI\InjectParams({
     *     "formFactory"      = @DI\Inject("form.factory"),
     *     "groupManager"     = @DI\Inject("claroline.manager.group_manager"),
     *     "mailManager"      = @DI\Inject("claroline.manager.mail_manager"),
     *     "messageManager"   = @DI\Inject("claroline.manager.message_manager"),
     *     "pagerFactory"     = @DI\Inject("claroline.pager.pager_factory"),
     *     "request"          = @DI\Inject("request_stack"),
     *     "router"           = @DI\Inject("router"),
     *     "tokenStorage"     = @DI\Inject("security.token_storage"),
     *     "userManager"      = @DI\Inject("claroline.manager.user_manager"),
     *     "utils"            = @DI\Inject("claroline.security.utilities"),
     *     "workspaceManager" = @DI\Inject("claroline.manager.workspace_manager")
     * })
     */
    public function __construct(
        FormFactory $formFactory,
        GroupManager $groupManager,
        MailManager $mailManager,
        MessageManager $messageManager,
        PagerFactory $pagerFactory,
        RequestStack $request,
        UrlGeneratorInterface $router,
        TokenStorageInterface $tokenStorage,
        UserManager $userManager,
        Utilities $utils,
        WorkspaceManager $workspaceManager
    ) {
        $this->formFactory = $formFactory;
        $this->groupManager = $groupManager;
        $this->mailManager = $mailManager;
        $this->messageManager = $messageManager;
        $this->pagerFactory = $pagerFactory;
        $this->request = $request->getMasterRequest();
        $this->router = $router;
        $this->tokenStorage = $tokenStorage;
        $this->userManager = $userManager;
        $this->utils = $utils;
        $this->workspaceManager = $workspaceManager;
    }
    /**
     * @EXT\Route(
     *     "/index",
     *     name="claro_message_index",
     *     options={"expose"=true}
     * )
     * @EXT\Template()
     */
    public function indexAction()
    {
        return [];
    }
    /**
     * @EXT\Route(
     *     "/contactable/users/page/{page}",
     *     name="claro_message_contactable_users",
     *     options={"expose"=true},
     *     defaults={"page"=1, "search"=""}
     * )
     * @EXT\Route(
     *     "/contactable/users/page/{page}/search/{search}",
     *     name="claro_message_contactable_users_search",
     *     options={"expose"=true},
     *     defaults={"page"=1}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     * @EXT\Template()
     *
     * @param int    $page
     * @param string $search
     * @param User   $user
     *
     * @return Response
     */
    public function contactableUsersListAction(User $user, $page, $search)
    {
        $trimmedSearch = trim($search);
        if ($user->hasRole('ROLE_ADMIN')) {
            if ('' === $trimmedSearch) {
                $users = $this->userManager->getAllUsers($page);
            } else {
                $users = $this->userManager
                    ->getAllUsersBySearch($page, $trimmedSearch);
            }
        } else {
            $users = [];
            $token = $this->tokenStorage->getToken();
            $roles = $this->utils->getRoles($token);
            $workspaces = $this->workspaceManager->getOpenableWorkspacesByRoles($roles);
            if (count($workspaces) > 0) {
                if ('' === $trimmedSearch) {
                    $users = $this->userManager
                        ->getUsersByWorkspaces($workspaces, $page);
                } else {
                    $users = $this->userManager->getUsersByWorkspacesAndSearch(
                        $workspaces,
                        $page,
                        $search
                    );
                }
            }
        }
        return ['users' => $users, 'search' => $search];
    }
    /**
     * @EXT\Route(
     *     "/notification/{isNotified}",
     *     name="claro_message_notification",
     *     options={"expose"=true}
     * )
     *
     * @EXT\Method("POST")
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     *
     * @param bool $isNotified
     * @param User $user
     *
     * @return Response
     */
    public function setMailNotificationAction($isNotified, User $user)
    {
        $this->userManager->setIsMailNotified($user, $isNotified);
        return new JsonResponse(['success' => 'success']);
    }
    /**
     * @EXT\Route(
     *     "/contactable/groups/page/{page}",
     *     name="claro_message_contactable_groups",
     *     options={"expose"=true},
     *     defaults={"page"=1, "search"=""}
     * )
     * @EXT\Route(
     *     "/contactable/groups/page/{page}/search/{search}",
     *     name="claro_message_contactable_groups_search",
     *     options={"expose"=true},
     *     defaults={"page"=1}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     * @EXT\Template()
     *
     * @param int    $page
     * @param string $search
     * @param User   $user
     *
     * @return Response
     */
    public function contactableGroupsListAction(User $user, $page, $search)
    {
        $trimmedSearch = trim($search);
        if ($user->hasRole('ROLE_ADMIN')) {
            if ('' === $trimmedSearch) {
                $groups = $this->groupManager->getAllGroups($page);
            } else {
                $groups = $this->groupManager
                    ->getAllGroupsBySearch($page, $trimmedSearch);
            }
        } else {
            $groups = [];
            $workspaces = $this->workspaceManager
                ->getWorkspacesByUserAndRoleNames($user, ['ROLE_WS_MANAGER']);
            // retrieve all groups of workspace that user is manager
            if (count($workspaces) > 0) {
                if ('' === $trimmedSearch) {
                    $groups = $this->groupManager
                        ->getGroupsByWorkspaces($workspaces);
                } else {
                    $groups = $this->groupManager->getGroupsByWorkspacesAndSearch(
                        $workspaces,
                        $search
                    );
                }
            }
            // get groups in which user is subscribed
            $userGroups = $user->getGroups();
            $userGroupsFinal = [];
            if ('' === $trimmedSearch) {
                $userGroupsFinal = $userGroups;
            } else {
                $upperSearch = strtoupper($trimmedSearch);
                foreach ($userGroups as $userGroup) {
                    $upperName = strtoupper($userGroup->getName());
                    if (false !== strpos($upperName, $upperSearch)) {
                        $userGroupsFinal[] = $userGroup;
                    }
                }
            }
            // merge the 2 groups array
            foreach ($userGroupsFinal as $userGroupFinal) {
                if (!in_array($userGroupFinal, $groups, true)) {
                    $groups[] = $userGroupFinal;
                }
            }
            $groups = $this->pagerFactory->createPagerFromArray($groups, $page);
        }
        return ['groups' => $groups, 'search' => $search];
    }
    /**
     * @EXT\Route(
     *     "/contactable/workspaces/page/{page}",
     *     name="claro_message_contactable_workspaces",
     *     options={"expose"=true},
     *     defaults={"page"=1, "search"=""}
     * )
     * @EXT\Route(
     *     "/contactable/workspaces/page/{page}/search/{search}",
     *     name="claro_message_contactable_workspaces_search",
     *     options={"expose"=true},
     *     defaults={"page"=1}
     * )
     * @EXT\ParamConverter("user", options={"authenticatedUser" = true})
     * @EXT\Template()
     *
     * @param int    $page
     * @param string $search
     * @param User   $user
     *
     * @return Response
     */
    public function contactableWorkspacesListAction(User $user, $page, $search)
    {
        $workspaces = $this->workspaceManager->getWorkspacesByManager($user);
        $pager = $this->pagerFactory->createPagerFromArray($workspaces, $page);
        return ['workspaces' => $pager, 'search' => $search];
    }
    public function checkAccess(Message $message, User $user)
    {
        if ($message->getSenderUsername() === $user->getUsername()) {
            return true;
        }
        $userMessage = $this->messageManager
            ->getOneUserMessageByUserAndMessage($user, $message);
        if (!is_null($userMessage)) {
            return true;
        }
        $receiverString = $message->getTo();
        $names = explode(';', $receiverString);
        $usernames = [];
        $groupNames = [];
        $workspaceCodes = [];
        foreach ($names as $name) {
            if ('{' === substr($name, 0, 1)) {
                $groupNames[] = trim($name, '{}');
            } elseif ('[' === substr($name, 0, 1)) {
                $workspaceCodes[] = trim($name, '[]');
            } else {
                $usernames[] = trim($name);
            }
        }
        if (in_array($user->getUsername(), $usernames)) {
            return true;
        }
        foreach ($user->getGroups() as $group) {
            if (in_array($group->getName(), $groupNames)) {
                return true;
            }
        }
        foreach ($this->workspaceManager->getWorkspacesByUser($user) as $workspace) {
            if (in_array($workspace->getCode(), $workspaceCodes)) {
                return true;
            }
        }
        throw new AccessDeniedException();
    }
    /**
     * @EXT\Route(
     *     "/users/usernames",
     *     name="claro_usernames_from_users",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter(
     *     "users",
     *      class="ClarolineCoreBundle:User",
     *      options={"multipleIds" = true, "name" = "userIds"}
     * )
     */
    public function retrieveUsernamesFromUsersAction(array $users)
    {
        $usernames = '';
        foreach ($users as $user) {
            $usernames .= $user->getUsername().';';
        }
        return new Response($usernames, 200);
    }
    /**
     * @EXT\Route(
     *     "/groups/names",
     *     name="claro_names_from_groups",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter(
     *     "groups",
     *      class="ClarolineCoreBundle:Group",
     *      options={"multipleIds" = true, "name" = "groupIds"}
     * )
     */
    public function retrieveNamesFromGroupsAction(array $groups)
    {
        $names = '';
        foreach ($groups as $group) {
            $names .= '{'.$group->getName().'};';
        }
        return new Response($names, 200);
    }
    /**
     * @EXT\Route(
     *     "/workspaces/names",
     *     name="claro_names_from_workspaces",
     *     options = {"expose"=true}
     * )
     * @EXT\ParamConverter(
     *     "workspaces",
     *      class="ClarolineCoreBundle:Workspace\Workspace",
     *      options={"multipleIds" = true, "name" = "workspaceIds"}
     * )
     */
    public function retrieveNamesFromWorkspacesAction(array $workspaces)
    {
        $names = '';
        foreach ($workspaces as $workspace) {
            $names .= '['.$workspace->getCode().'];';
        }
        return new Response($names, 200);
    }
}
