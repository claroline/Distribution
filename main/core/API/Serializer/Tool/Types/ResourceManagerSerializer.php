<?php

namespace Claroline\CoreBundle\API\Serializer\Tool\Types;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Resource\ResourceType;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Manager\UserManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;

/**
 * @DI\Service("claroline.serializer.tool.resource_manager")

 * Not a true Serializer I guess. Move this elsewhere ?
 */
class ResourceManagerSerializer
{
    use SerializerTrait;

    /**
     * WorkspaceSerializer constructor.
     *
     * @DI\InjectParams({
     *     "serializer"   = @DI\Inject("claroline.api.serializer"),
     *     "finder"       = @DI\Inject("claroline.api.finder"),
     *     "crud"         = @DI\Inject("claroline.api.crud"),
     *     "tokenStorage" = @DI\Inject("security.token_storage"),
     *     "userManager"  = @DI\Inject("claroline.manager.user_manager"),
     *     "om"           = @DI\Inject("claroline.persistence.object_manager")
     * })
     *

     * @param SerializerProvider $serializer
     */
    public function __construct(
        SerializerProvider $serializer,
        UserManager $userManager,
        FinderProvider $finder,
        Crud $crud,
        TokenStorage $tokenStorage,
        ObjectManager $om
      ) {
        $this->serializer = $serializer;
        $this->om = $om;
        $this->finder = $finder;
        $this->crud = $crud;
        $this->tokenStorage = $tokenStorage;
        $this->userManager = $userManager;
    }

    /**
     * @return array
     */
    public function serialize(Workspace $workspace, array $options): array
    {
        $root = $this->om->getRepository(ResourceNode::class)->findOneBy(['parent' => null, 'workspace' => $workspace->getId()]);

        return ['root' => $this->serializer->serialize($root, array_merge($options, [Options::IS_RECURSIVE, Options::SERIALIZE_RESOURCE]))];
    }

    public function deserialize(array $data, Workspace $workspace)
    {
        return $this->deserializeResources($data['root'], $workspace);
    }

    private function deserializeResources(array $data, Workspace $workspace)
    {
        $node = $this->deserializeResource($data, $workspace);

        foreach ($data['children'] as $child) {
            $child = $this->deserializeResources($child, $workspace);
            $child->setParent($node);
        }

        return $node;
    }

    private function deserializeResource(array $data, Workspace $workspace)
    {
        $rights = $data['rights'];
        unset($data['rights']);
        $node = $this->serializer->deserialize(ResourceNode::class, $data);
        $node->setWorkspace($workspace);
        $this->serializer->get(ResourceNode::class)->deserialize(['rights' => $rights], $node);
        if ($this->tokenStorage->getToken()) {
            $node->setCreator($this->tokenStorage->getToken()->getUser());
        } else {
            $creator = $this->userManager->getDefaultClarolineAdmin();
            $node->setCreator($creator);
        }
        $this->om->persist($node);
        $resourceType = $this->om->getRepository(ResourceType::class)->findOneByName($data['meta']['type']);
        $class = $resourceType->getClass();
        $this->om->flush();
        $resource = new $class();
        $this->serializer->deserialize($class, $data['resource']);
        $resource->setResourceNode($node);
        $this->om->persist($resource);
        $this->om->flush();

        return $node;
    }
}
