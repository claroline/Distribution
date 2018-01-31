<?php

namespace Claroline\CoreBundle\API\Serializer\Log;

use Claroline\CoreBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\API\SerializerProvider;
use Claroline\CoreBundle\Entity\Log\Log;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.log")
 * @DI\Tag("claroline.serializer")
 */
class LogSerializer
{
    use SerializerTrait;

    /** @var SerializerProvider */
    private $serializer;

    /**
     * RoleSerializer constructor.
     *
     * @DI\InjectParams({
     *     "serializer" = @DI\Inject("claroline.api.serializer")
     * })
     *
     * @param SerializerProvider $serializer
     */
    public function __construct(SerializerProvider $serializer)
    {
        $this->serializer = $serializer;
    }

    public function getClass()
    {
        return 'Claroline\CoreBundle\Entity\Log\Log';
    }

    public function getIdentifiers()
    {
        return ['id'];
    }

    /**
     * Serializes a Book reference entity.
     *
     * @param Log   $log
     * @param array $options
     *
     * @return array
     */
    public function serialize(Log $log, array $options = [])
    {
        $doer = null;
        if (!is_null($log->getDoer())) {
            $doer = $log->getDoer()->getId();
        }

        $workspace = null;
        if (!is_null($log->getWorkspace())) {
            $doer = $log->getWorkspace()->getId();
        }

        $resourceNode = null;
        if (!is_null($log->getResourceNode())) {
            $resourceNode = $log->getResourceNode()->getId();
        }

        $resourceType = null;
        if (!is_null($log->getResourceType())) {
            $resourceType = $log->getResourceType()->getName();
        }

        return [
            'id' => $log->getId(),
            'action' => $log->getAction(),
            'dateLog' => $log->getDateLog(),
            'details' => $log->getDetails(),
            'doer' => $doer,
            'workspace' => $workspace,
            'resourceNode' => $resourceNode,
            'resourceType' => $resourceType,
        ];
    }
}
