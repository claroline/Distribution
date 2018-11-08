<?php

namespace Claroline\CoreBundle\API\Serializer\Workspace;

use Claroline\AppBundle\API\Options;
use Claroline\CoreBundle\API\Serializer\Tool\ToolSerializer;
use Claroline\CoreBundle\API\Serializer\User\RoleSerializer;
use Claroline\CoreBundle\Entity\Tool\OrderedTool;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.ordered_tool")
 * @DI\Tag("claroline.serializer")
 */
class OrderedToolSerializer
{
    /** @var ToolSerializer */
    private $toolSerializer;

    /**
     * PendingRegistrationSerializer constructor.
     *
     * @DI\InjectParams({
     *     "toolSerializer" = @DI\Inject("claroline.serializer.tool"),
     *     "roleSerializer" = @DI\Inject("claroline.serializer.role")
     * })
     *
     * @param ToolSerializer $toolSerializer
     */
    public function __construct(ToolSerializer $toolSerializer, RoleSerializer $roleSerializer)
    {
        $this->toolSerializer = $toolSerializer;
        $this->roleSerializer = $roleSerializer;
    }

    public function getClass()
    {
        return OrderedTool::class;
    }

    public function serialize(OrderedTool $orderedTool): array
    {
        return [
          //maybe remove tools. See later
          'id' => $orderedTool->getUuid(),
          'tool' => $this->toolSerializer->serialize($orderedTool->getTool()),
          'position' => $orderedTool->getOrder(),
          'restrictions' => $this->serializeRestrictions($orderedTool),
        ];
    }

    private function serializeRestrictions(OrderedTool $orderedTool): array
    {
        $restrictions = [];

        foreach ($orderedTool->getRights() as $right) {
            $restrictions['roles'][] = [
              'role' => $this->roleSerializer->serialize($right->getRole(), [Options::SERIALIZE_MINIMAL]),
              'mask' => $right->getMask(),
          ];
        }

        return $restrictions;
    }
}
