<?php

namespace Claroline\CoreBundle\API\Serializer\Workspace;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\Tool\OrderedTool;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;

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
     *     "serializer"   = @DI\Inject("claroline.api.serializer"),
     *     "tokenStorage" = @DI\Inject("security.token_storage"),
     *     "om"           = @DI\Inject("claroline.persistence.object_manager")
     * })
     *

     * @param SerializerProvider $serializer
     */
    public function __construct(
        SerializerProvider $serializer,
        TokenStorage $tokenStorage,
        ObjectManager $om
    ) {
        $this->serializer = $serializer;
        $this->om = $om;
        $this->tokenStorage = $tokenStorage;
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
        $serialized['root'] = $this->serializeResources($workspace);

        $keyToRemove = [];

        return $serialized;
    }

    private function serializeHome(Workspace $workspace)
    {
    }

    private function serializeResources(Workspace $workspace)
    {
        $root = $this->om->getRepository(ResourceNode::class)->findOneBy(['parent' => null, 'workspace' => $workspace->getId()]);

        return $this->serializer->serialize($root, [Options::IS_RECURSIVE]);
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

        $this->om->persist($workspace);
        $this->om->forceFlush();

        $data['root']['meta']['workspace']['uuid'] = $workspace->getUuid();
        $root = $this->deserializeResource($data['root']);

        return $workspace;
    }

    private function deserializeResource(array $data)
    {
        $node = $this->serializer->deserialize(ResourceNode::class, $data);
        $node->setCreator($this->tokenStorage->getToken()->getUser());

        $this->om->persist($node);
        $this->om->flush();
    }
}
