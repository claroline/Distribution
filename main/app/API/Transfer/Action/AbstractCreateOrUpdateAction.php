<?php

namespace Claroline\AppBundle\API\Transfer\Action;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\SchemaProvider;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\API\TransferProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;

abstract class AbstractCreateOrUpdateAction extends AbstractAction
{
    abstract public function getClass();

    /**
     * Action constructor.
     *
     * @DI\InjectParams({
     *     "crud" = @DI\Inject("claroline.api.crud"),
     *     "serializer" = @DI\Inject("claroline.api.serializer"),
     *     "transfer" = @DI\Inject("claroline.api.transfer"),
     *     "om" = @DI\Inject("claroline.persistence.object_manager"),
     *     "schema" = @DI\Inject("claroline.api.schema")
     * })
     *
     * @param Crud $crud
     */
    public function __construct(Crud $crud, SerializerProvider $serializer, TransferProvider $transfer, ObjectManager $om, SchemaProvider $schema)
    {
        $this->crud = $crud;
        $this->serializer = $serializer;
        $this->transfer = $transfer;
        $this->om = $om;
        $this->schema = $schema;
    }

    public function execute(array $data, &$successData = [])
    {
        //search the object. It'll look for the 1st identifier it finds so be carreful
        $class = $this->getClass();
        $object = $this->om->getObject($data, $class, $this->schema->getIdentifiers($class)) ?? new $class();
        $object = $this->serializer->deserialize($data, $object);
        $serializedclass = $this->getAction()[0];
        $action = !$object->getId() ? self::MODE_CREATE : self::MODE_UPDATE;
        $action = $serializedclass.'_'.$action;
        //finds and fire the action
        return $this->transfer->getExecutor($action)->execute($data, $successData);
    }

    public function getSchema(array $options = [], array $extra = [])
    {
        return ['$root' => $this->getClass()];
    }
}
