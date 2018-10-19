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

use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\Tool\Tool;
use Claroline\CoreBundle\Event\DisplayToolEvent;
use Claroline\CoreBundle\Manager\ToolManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Bundle\TwigBundle\TwigEngine;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * @DI\Service()
 */
class ToolListener
{
    /** @var FinderProvider */
    private $finder;

    /** @var ObjectManager */
    private $om;

    /** @var SerializerProvider */
    private $serializer;

    /** @var TwigEngine */
    private $templating;

    /** @var TokenStorageInterface */
    private $tokenStorage;

    /** @var ToolManager */
    private $toolManager;

    /**
     * ToolListener constructor.
     *
     * @DI\InjectParams({
     *     "finder"       = @DI\Inject("claroline.api.finder"),
     *     "om"           = @DI\Inject("claroline.persistence.object_manager"),
     *     "serializer"   = @DI\Inject("claroline.api.serializer"),
     *     "templating"   = @DI\Inject("templating"),
     *     "tokenStorage" = @DI\Inject("security.token_storage"),
     *     "toolManager"  = @DI\Inject("claroline.manager.tool_manager")
     * })
     *
     * @param FinderProvider        $finder
     * @param ObjectManager         $om
     * @param SerializerProvider    $serializer
     * @param TwigEngine            $templating
     * @param TokenStorageInterface $tokenStorage
     * @param ToolManager           $toolManager
     */
    public function __construct(
        FinderProvider $finder,
        ObjectManager $om,
        SerializerProvider $serializer,
        TwigEngine $templating,
        TokenStorageInterface $tokenStorage,
        ToolManager $toolManager
    ) {
        $this->finder = $finder;
        $this->om = $om;
        $this->serializer = $serializer;
        $this->templating = $templating;
        $this->tokenStorage = $tokenStorage;
        $this->toolManager = $toolManager;
    }

    /**
     * @DI\Observe("open_tool_desktop_parameters")
     *
     * @param DisplayToolEvent $event
     */
    public function onDisplayDesktopParameters(DisplayToolEvent $event)
    {
        $user = $this->tokenStorage->getToken()->getUser();

        if ('anon.' === $user) {
            throw new AccessDeniedException();
        }
        $roles = array_filter($user->getEntityRoles(), function (Role $role) {
            return Role::PLATFORM_ROLE === $role->getType();
        });
        $toolsRolesConfig = $this->toolManager->getDesktopToolsConfiguration($roles);

        $desktopTools = $this->finder->get(Tool::class)->find(
            ['isDisplayableInDesktop' => true],
            ['property' => 'name', 'direction' => 1]
        );
        $tools = [];

        foreach ($desktopTools as $desktopTool) {
            $toolName = $desktopTool->getName();

            if ('home' !== $toolName && 'parameters' !== $toolName) {
                $tools[] = $desktopTool;
            }
        }
        $orderedTools = $this->toolManager->computeUserOrderedTools($user, $toolsRolesConfig);
        $toolsConfig = [];

        foreach ($orderedTools as $orderedTool) {
            $toolName = $orderedTool->getTool()->getName();
            $toolsConfig[$toolName] = [
                'visible' => $orderedTool->isVisibleInDesktop(),
                'locked' => $orderedTool->isLocked(),
            ];
        }

        $event->setContent(
            $this->templating->render(
                'ClarolineCoreBundle:tool\desktop\parameters:parameters.html.twig',
                [
                    'tools' => array_map(function (Tool $tool) {
                        return $this->serializer->serialize($tool);
                    }, $tools),
                    'toolsConfig' => 0 < count($toolsConfig) ? $toolsConfig : new \stdClass(),
                ]
            )
        );
    }
}
