<?php

namespace Claroline\CoreBundle\Manager\Workspace;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\ValidatorProvider;
use Claroline\AppBundle\Event\StrictDispatcher;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\Workspace\FullSerializer;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.manager.workspace.importer")
 */
class Importer
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
     *     "validator"           = @DI\Inject("claroline.api.validator")
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
      ValidatorProvider $validator
    ) {
        $this->om = $om;
        $this->dispatcher = $dispatcher;
        $this->fullSerializer = $fullSerializer;
        $this->validator = $validator;
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
}
