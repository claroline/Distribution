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
use Claroline\CoreBundle\Event\Tool\OpenToolEvent;
use Claroline\CoreBundle\Repository\Resource\ResourceNodeRepository;

class ResourcesListener
{
    /** @var SerializerProvider */
    private $serializer;
    /** @var ResourceNodeRepository */
    private $resourceRepository;

    public function __construct(
        ObjectManager $om,
        SerializerProvider $serializer
    ) {
        $this->serializer = $serializer;
        $this->resourceRepository = $om->getRepository('ClarolineCoreBundle:Resource\ResourceNode');
    }

    /**
     * Displays resources on Desktop.
     */
    public function onDisplayDesktop(OpenToolEvent $event)
    {
        $event->setData([
            'root' => null,
        ]);
        $event->stopPropagation();
    }

    /**
     * Displays resources on Workspace.
     */
    public function onDisplayWorkspace(OpenToolEvent $event)
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
