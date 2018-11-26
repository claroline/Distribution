<?php

namespace Claroline\CoreBundle\Manager\Workspace;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\API\Utils\FileBag;
use Claroline\AppBundle\API\ValidatorProvider;
use Claroline\AppBundle\Event\StrictDispatcher;
use Claroline\AppBundle\Manager\File\TempFileManager;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\Workspace\FullSerializer;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\Tool\OrderedTool;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Manager\Workspace\Transfer\OrderedToolTransfer;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;

/**
 * @DI\Service("claroline.manager.workspace.transfer")
 */
class TransferManager
{
    use PermissionCheckerTrait;

    /** @var ObjectManager */
    private $om;

    /** @var StrictDispatcher */
    private $dispatcher;

    /** @var SerializerProvider */
    private $serializer;

    /**
     * Crud constructor.
     *
     * @DI\InjectParams({
     *     "om"                  = @DI\Inject("claroline.persistence.object_manager"),
     *     "dispatcher"          = @DI\Inject("claroline.event.event_dispatcher"),
     *     "fullSerializer"      = @DI\Inject("claroline.serializer.workspace.full"),
     *     "tempFileManager"     = @DI\Inject("claroline.manager.temp_file"),
     *     "serializer"          = @DI\Inject("claroline.api.serializer"),
     *     "finder"              = @DI\Inject("claroline.api.finder"),
     *     "ots"                 = @DI\Inject("claroline.transfer.ordered_tool"),
     *     "crud"                = @DI\Inject("claroline.api.crud"),
     *     "tokenStorage"        = @DI\Inject("security.token_storage")
     * })
     *
     * @param ObjectManager      $om
     * @param StrictDispatcher   $dispatcher
     * @param SerializerProvider $serializer
     * @param ValidatorProvider  $validator
     */
    public function __construct(
      ObjectManager $om,
      StrictDispatcher $dispatcher,
      TempFileManager $tempFileManager,
      SerializerProvider $serializer,
      OrderedToolTransfer $ots,
      FinderProvider $finder,
      Crud $crud,
      TokenStorage $tokenStorage
    ) {
        $this->om = $om;
        $this->dispatcher = $dispatcher;
        $this->tempFileManager = $tempFileManager;
        $this->serializer = $serializer;
        $this->finder = $finder;
        $this->crud = $crud;
        $this->tokenStorage = $tokenStorage;
        $this->ots = $ots;
    }

    /**
     * @param mixed $data - the serialized data of the object to create
     *
     * @return object
     */
    public function create(array $data)
    {
        $options = [Options::LIGHT_COPY];
        // gets entity from raw data.
        $workspace = $this->deserialize($data);
        $this->importFiles

        // creates the entity if allowed
        $this->checkPermission('CREATE', $workspace, [], true);

        if ($this->dispatch('create', 'pre', [$workspace, $options])) {
            $this->om->save($workspace);
            $this->dispatch('create', 'post', [$workspace, $options]);
        }

        return $workspace;
    }

    //copied from crud
    public function dispatch($action, $when, array $args)
    {
        $name = 'crud_'.$when.'_'.$action.'_object';
        $eventClass = ucfirst($action);
        $generic = $this->dispatcher->dispatch($name, 'Claroline\\AppBundle\\Event\\Crud\\'.$eventClass.'Event', $args);
        $className = $this->om->getMetadataFactory()->getMetadataFor(get_class($args[0]))->getName();
        $serializedName = $name.'_'.strtolower(str_replace('\\', '_', $className));
        $specific = $this->dispatcher->dispatch($serializedName, 'Claroline\\AppBundle\\Event\\Crud\\'.$eventClass.'Event', $args);

        return $generic->isAllowed() && $specific->isAllowed();
    }

    public function export(Workspace $workspace)
    {
        $fileBag = new FileBag();
        $data = $this->serialize($workspace);
        $data = $this->exportFiles($data, $fileBag);
        $archive = new \ZipArchive();
        $pathArch = $this->tempFileManager->generate();
        $archive->open($pathArch, \ZipArchive::CREATE);
        $archive->addFromString('workspace.json', json_encode($data, JSON_PRETTY_PRINT));

        foreach ($fileBag->all() as $archPath => $realPath) {
            $archive->addFile($realPath, $archPath);
        }

        $archive->close();

        return $pathArch;
    }

    /**
     * Returns a json description of the entire workspace.
     *
     * @param Workspace $workspace - the workspace to serialize
     *
     * @return array - the serialized representation of the workspace
     */
    public function serialize(Workspace $workspace)
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
     * @param array $data
     * @param array $options
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

    //once everything is serialized, we add files to the archive.
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

    public function importFiles($data, Workspace $workspace)
    {
        foreach ($data['orderedTools'] as $key => $orderedToolData) {
            //copied from crud
            $name = 'import_tool_'.$orderedToolData['name'];
            //use an other even. StdClass is not pretty
            if (isset($orderedToolData['data'])) {
                $event = $this->dispatcher->dispatch($name, 'Claroline\\CoreBundle\\Event\\ImportObjectEvent', [
                  new \StdClass(), $fileBag, $orderedToolData['data'],
              ]);
                $data['orderedTools'][$key] = $event->getData();
            }
        }

        return $data;
    }
}
