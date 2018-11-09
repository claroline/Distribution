<?php

namespace Claroline\CoreBundle\API\Serializer\Workspace;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\Tool\OrderedTool;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.workspace.full")
 */
class FullSerializer
{
    use SerializerTrait;

    /** @var SerializerProvider */
    private $serializer;

    /** @var ObjectManager */
    private $om;

    /**
     * WorkspaceSerializer constructor.
     *
     * @DI\InjectParams({
     *     "serializer" = @DI\Inject("claroline.api.serializer"),
     *     "om"         = @DI\Inject("claroline.persistence.object_manager")
     * })
     *

     * @param SerializerProvider $serializer
     */
    public function __construct(
        SerializerProvider $serializer,
        ObjectManager $om
    ) {
        $this->serializer = $serializer;
        $this->om = $om;
    }

    /**
     * Serializes a Workspace entity for the JSON api.
     *
     * @param Workspace $workspace - the workspace to serialize
     * @param array     $options   - a list of serialization options
     *
     * @return array - the serialized representation of the workspace
     */
    public function serialize(Workspace $workspace, array $options = [])
    {
        $serialized = $this->serializer->serialize($workspace);
        $serialized['orderedTools'] = array_map(function (OrderedTool $tool) {
            return $this->serializer->serialize($tool, []);
        }, $workspace->getOrderedTools()->toArray());

        //a voir plus tard pour bouger ce code
        $serialized['home'] = $this->serializeHome($workspace);
        $serialized['resources'] = $this->serializeResources($workspace);

        return $serialized;
    }

    private function serializeHome(Workspace $workspace)
    {
    }

    private function serializeResources(Workspace $workspace)
    {
    }

    /**
     * Deserializes Workspace data into entities.
     *
     * @param array     $data
     * @param Workspace $workspace
     * @param array     $options
     *
     * @return Workspace
     */
    public function deserialize(array $data, array $options = [])
    {
        $defaultRole = $data['registration']['defaultRole'];
        unset($data['registration']['defaultRole']);
        $workspace = $this->serializer->deserialize(Workspace::class, $data);

        foreach ($data['roles'] as $roleData) {
            $roleData['workspace']['uuid'] = $workspace->getUuid();
            $role = $this->serializer->deserialize(Role::class, $roleData);
            $role->setWorkspace($workspace);
            $this->om->persist($role);
        }

        foreach ($workspace->getRoles() as $role) {
            if ($defaultRole['translationKey'] === $role->getTranslationKey()) {
                $workspace->setDefaultRole($role);
            }
        }

        return $workspace;
    }
}
