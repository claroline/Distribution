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

use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Event\DisplayToolEvent;
use Claroline\CoreBundle\Repository\ResourceNodeRepository;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service
 */
class ResourcesListener
{
    /** @var SerializerProvider */
    private $serializer;
    /** @var ResourceNodeRepository */
    private $resourceRepository;

    /**
     * ResourcesListener constructor.
     *
     * @DI\InjectParams({
     *     "om"         = @DI\Inject("claroline.persistence.object_manager"),
     *     "serializer" = @DI\Inject("claroline.api.serializer")
     * })
     *
     * @param ObjectManager      $om
     * @param SerializerProvider $serializer
     */
    public function __construct(
        ObjectManager $om,
        SerializerProvider $serializer
    ) {
        $this->serializer = $serializer;
        $this->resourceRepository = $om->getRepository('ClarolineCoreBundle:Resource\ResourceNode');
    }

    /**
     * Displays resources on Desktop.
     *
     * @DI\Observe("open_tool_desktop_resource_manager")
     *
     * @param DisplayToolEvent $event
     */
    public function onDisplayDesktop(DisplayToolEvent $event)
    {
        $event->setData([
            'root' => null,
        ]);
        $event->stopPropagation();
    }

    /**
     * Displays resources on Workspace.
     *
     * @DI\Observe("open_tool_workspace_resource_manager")
     *
     * @param DisplayToolEvent $event
     */
    public function onDisplayWorkspace(DisplayToolEvent $event)
    {
        $workspace = $event->getWorkspace();

        $event->setData([
            'root' => $this->serializer->serialize(
                $this->resourceRepository->findWorkspaceRoot($workspace)
            ),
        ]);
        $event->stopPropagation();
    }
}
