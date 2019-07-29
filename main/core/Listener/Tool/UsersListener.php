<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Listener\Tool;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\ParametersSerializer;
use Claroline\CoreBundle\API\Serializer\User\ProfileSerializer;
use Claroline\CoreBundle\API\Serializer\User\UserSerializer;
use Claroline\CoreBundle\API\Serializer\Workspace\WorkspaceSerializer;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Event\DisplayToolEvent;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * @DI\Service
 */
class UsersListener
{
    /**
     * ProfileController constructor.
     *
     * @DI\InjectParams({
     *     "tokenStorage"         = @DI\Inject("security.token_storage"),
     *     "om"                   = @DI\Inject("claroline.persistence.object_manager"),
     *     "userSerializer"       = @DI\Inject("claroline.serializer.user"),
     *     "workspaceSerializer"  = @DI\Inject("claroline.serializer.workspace"),
     *     "profileSerializer"    = @DI\Inject("claroline.serializer.profile"),
     *     "parametersSerializer" = @DI\Inject("claroline.serializer.parameters"),
     *     "request"              = @DI\Inject("request_stack"),
     *     "authorization"        = @DI\Inject("security.authorization_checker"),
     * })
     *
     * @param ObjectManager        $om
     * @param UserSerializer       $userSerializer
     * @param ProfileSerializer    $profileSerializer
     * @param ParametersSerializer $parametersSerializer
     */
    public function __construct(
        TokenStorageInterface $tokenStorage,
        ObjectManager $om,
        UserSerializer $userSerializer,
        ProfileSerializer $profileSerializer,
        ParametersSerializer $parametersSerializer,
        RequestStack $request,
        AuthorizationCheckerInterface $authorization,
        WorkspaceSerializer $workspaceSerializer
    ) {
        $this->tokenStorage = $tokenStorage;
        $this->authorization = $authorization;
        $this->om = $om;
        $this->userSerializer = $userSerializer;
        $this->profileSerializer = $profileSerializer;
        $this->parametersSerializer = $parametersSerializer;
        $this->request = $request->getMasterRequest();
        $this->workspaceSerializer = $workspaceSerializer;
    }

    /**
     * Displays users on Workspace.
     *
     * @DI\Observe("open_tool_workspace_users")
     *
     * @param DisplayToolEvent $event
     */
    public function onDisplayWorkspace(DisplayToolEvent $event)
    {
        //change this
        $workspace = $event->getWorkspace();

        $event->setData([
            'parameters' => $this->workspaceSerializer->serialize($workspace),
            'restrictions' => [
                // TODO: computes rights more accurately
                'hasUserManagementAccess' => $this->authorization->isGranted('ROLE_ADMIN'),
            ],
            'user' => [
              'data' => [],
              'originalData' => [],
            ],
            'facets' => [],
        ]);
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("open_tool_desktop_users")
     *
     * @param DisplayToolEvent $event
     */
    public function onDisplayDesktop(DisplayToolEvent $event)
    {
        $publicUrl = $this->request->query->get('publicUrl');

        $profileUser = $publicUrl ? $this->om->getRepository(User::class)->findOneByPublicUrl($publicUrl) :
          $this->tokenStorage->getToken()->getUser();

        $serializedUser = $this->userSerializer->serialize($profileUser, [Options::SERIALIZE_FACET]);

        $event->setData([
          'user' => [
              'data' => $serializedUser,
              'originalData' => $serializedUser,
          ],
          'restrictions' => [],
          'facets' => $this->profileSerializer->serialize(),
          'parameters' => $this->parametersSerializer->serialize()['profile'],
        ]);

        $event->stopPropagation();
    }
}
