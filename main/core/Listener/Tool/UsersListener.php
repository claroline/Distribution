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
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Event\DisplayToolEvent;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

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
     *     "profileSerializer"    = @DI\Inject("claroline.serializer.profile"),
     *     "parametersSerializer" = @DI\Inject("claroline.serializer.parameters"),
     *     "request"              = @DI\Inject("request_stack")
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
        RequestStack $request
    ) {
        $this->tokenStorage = $tokenStorage;
        $this->om = $om;
        $this->userSerializer = $userSerializer;
        $this->profileSerializer = $profileSerializer;
        $this->parametersSerializer = $parametersSerializer;
        $this->request = $request->getMasterRequest();
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

        $content = $this->templating->render(
            'ClarolineCoreBundle:workspace:users.html.twig', [
                'workspace' => $workspace,
                'restrictions' => [
                    'hasUserManagementAccess' => $this->authorization->isGranted('OPEN', $this->om
                        ->getRepository('ClarolineCoreBundle:Tool\AdminTool')
                        ->findOneBy(['name' => 'user_management'])
                    ),
                ],
            ]
        );

        $event->setContent($content);
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("open_tool_desktop_users")
     *
     * @param DisplayToolEvent $event
     */
    public function onDisplayDesktop(DisplayToolEvent $event)
    {
        $userId = $this->request->query->get('userId');

        $profileUser = $userId ? $this->om->getRepository(User::class)->findOneById($userId) :
          $this->tokenStorage->getToken()->getUser();

        $serializedUser = $this->userSerializer->serialize($profileUser, [Options::SERIALIZE_FACET]);

        $event->setData([
          'user' => [
              'data' => $serializedUser,
              'originalData' => $serializedUser,
          ],
          'facets' => $this->profileSerializer->serialize(),
          'parameters' => $this->parametersSerializer->serialize()['profile'],
        ]);
        $event->stopPropagation();
    }
}
