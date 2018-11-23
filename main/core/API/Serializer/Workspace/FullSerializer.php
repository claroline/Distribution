<?php

namespace Claroline\CoreBundle\API\Serializer\Workspace;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\API\Utils\FileBag;
use Claroline\AppBundle\Event\StrictDispatcher;
use Claroline\AppBundle\Persistence\ObjectManager;
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

    /** @var FinderProvider */
    private $finder;

    /** @var Crud */
    private $crud;

    /** @var ObjectManager */
    private $om;

    /**
     * WorkspaceSerializer constructor.
     *
     * @DI\InjectParams({
     *     "serializer"   = @DI\Inject("claroline.api.serializer"),
     *     "finder"       = @DI\Inject("claroline.api.finder"),
     *     "dispatcher"   = @DI\Inject("claroline.event.event_dispatcher"),
     *     "ots"          = @DI\Inject("claroline.serializer.ordered_tool"),
     *     "crud"         = @DI\Inject("claroline.api.crud"),
     *     "tokenStorage" = @DI\Inject("security.token_storage"),
     *     "om"           = @DI\Inject("claroline.persistence.object_manager")
     * })
     *

     * @param SerializerProvider $serializer
     */
    public function __construct(
        SerializerProvider $serializer,
        StrictDispatcher $dispatcher,
        OrderedToolSerializer $ots,
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
        $this->ots = $ots;
        $this->dispatcher = $dispatcher;
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
        $serialized = $this->serializer->serialize($workspace, [Options::REFRESH_UUID]);

        $serialized['orderedTools'] = array_map(function (OrderedTool $tool) {
            return $this->ots->serialize($tool, [Options::SERIALIZE_TOOL, Options::REFRESH_UUID]);
        }, $workspace->getOrderedTools()->toArray());

        return $serialized;
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

        foreach ($data['orderedTools'] as $orderedToolData) {
            $orderedTool = new OrderedTool();
            $this->ots->deserialize($orderedToolData, $orderedTool, [], $workspace);
        }

        return $workspace;
    }

    public function exportFiles($data, FileBag $fileBag)
    {
        foreach ($data['orderedTools'] as $key => $orderedToolData) {
            //copied from crud
            $name = 'export_tool_'.$orderedToolData['name'];
            //use an other even. StdClass is not pretty
            if (isset($orderedToolData['data'])) {
                $event = $this->dispatcher->dispatch($name, 'Claroline\\CoreBundle\\Event\\ExportObjectEvent', [
                  new \StdClass(), $fileBag, $orderedToolData['data'],
              ]);
                $data['orderedTools'][$key] = $event->getData();
            }
        }

        return $data;
    }
}
