<?php

namespace Claroline\CoreBundle\Manager\Workspace;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Utils\FileBag;
use Claroline\AppBundle\API\ValidatorProvider;
use Claroline\AppBundle\Event\StrictDispatcher;
use Claroline\AppBundle\Manager\File\TempFileManager;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\Workspace\FullSerializer;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use JMS\DiExtraBundle\Annotation as DI;

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

    /** @var ValidatorProvider */
    private $validator;

    /**
     * Crud constructor.
     *
     * @DI\InjectParams({
     *     "om"                  = @DI\Inject("claroline.persistence.object_manager"),
     *     "dispatcher"          = @DI\Inject("claroline.event.event_dispatcher"),
     *     "fullSerializer"      = @DI\Inject("claroline.serializer.workspace.full"),
     *     "validator"           = @DI\Inject("claroline.api.validator"),
     *     "tempFileManager"  = @DI\Inject("claroline.manager.temp_file")
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
      FullSerializer $fullSerializer,
      ValidatorProvider $validator,
      TempFileManager $tempFileManager
    ) {
        $this->om = $om;
        $this->dispatcher = $dispatcher;
        $this->fullSerializer = $fullSerializer;
        $this->validator = $validator;
        $this->tempFileManager = $tempFileManager;
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
        $workspace = $this->fullSerializer->deserialize($data);

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
        $data = $this->fullSerializer->serialize($workspace);
        $this->fullSerializer->exportFiles($data, $fileBag);
        //var_dump($data);
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
}
