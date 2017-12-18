<?php

namespace Claroline\CoreBundle\API;

use Claroline\CoreBundle\Event\StrictDispatcher;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Security\ObjectCollection;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * Provides common CRUD operations.
 *
 * @DI\Service("claroline.api.crud")
 */
class Crud
{
    use PermissionCheckerTrait;

    /** @var string */
    const COLLECTION_ADD = 'add';
    /** @var string */
    const COLLECTION_REMOVE = 'remove';

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
     *     "om"         = @DI\Inject("claroline.persistence.object_manager"),
     *     "dispatcher" = @DI\Inject("claroline.event.event_dispatcher"),
     *     "serializer" = @DI\Inject("claroline.api.serializer"),
     *     "validator" = @DI\Inject("claroline.api.validator")
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
      SerializerProvider $serializer,
      ValidatorProvider $validator
    ) {
        $this->om = $om;
        $this->dispatcher = $dispatcher;
        $this->serializer = $serializer;
        $this->validator = $validator;
    }

    /**
     * Creates a new entry for `class` and populates it with `data`.
     *
     * @param string $class   - the class of the entity to create
     * @param mixed  $data    - the serialized data of the object to create
     * @param array  $options - additional creation options
     *
     * @return object
     */
    public function create($class, $data, array $options = [])
    {
        // validates submitted data.
        $errors = $this->validate($class, $data, ValidatorProvider::CREATE);

        if (count($errors) > 0) {
            return $errors;
        }

        // gets entity from raw data.
        $object = $this->serializer->deserialize($class, $data, $options);

        // creates the entity if allowed
        //$this->checkPermission('CREATE', $object, [], true);

        if ($this->dispatch('crud_pre_create_object', $object, $options)) {
            $this->om->save($object);
            $this->dispatch('crud_post_create_object', $object, $options);
        }

        return $object;
    }

    /**
     * Updates an entry of `class` with `data`.
     *
     * @param string $class   - the class of the entity to updates
     * @param mixed  $data    - the serialized data of the object to create
     * @param array  $options - additional update options
     *
     * @return object
     */
    public function update($class, $data, array $options = [])
    {
        // validates submitted data.
        $this->validate($class, $data, ValidatorProvider::UPDATE);
        // gets entity from raw data.
        $object = $this->serializer->deserialize($class, $data, $options);

        // updates the entity if allowed
        $this->checkPermission('EDIT', $object, [], true);

        if ($this->dispatch('crud_pre_update_object', $object, $options)) {
            $this->om->save($object);
            $this->dispatch('crud_post_update_object', $object, $options);
        }

        return $object;
    }

    /**
     * Deletes an entry `object`.
     *
     * @param object $object  - the entity to delete
     * @param array  $options - additional delete options
     */
    public function delete($object, array $options = [])
    {
        $this->checkPermission('DELETE', $object, [], true);

        if ($this->dispatch('crud_pre_delete_object', $object, $options)) {
            if (!in_array(Options::SOFT_DELETE, $options)) {
                $this->om->remove($object);
                $this->om->flush();
            }
            $this->dispatch('crud_post_delete_object', $object, $options);
        }
    }

    /**
     * Deletes a list of entries of `class`.
     *
     * @param array $data    - the list of entries to delete
     * @param array $options - additional delete options
     */
    public function deleteBulk(array $data, array $options = [])
    {
        $this->om->startFlushSuite();

        foreach ($data as $el) {
            //get the element
            $this->delete($el, $options);
        }

        $this->om->endFlushSuite();
    }

    /**
     * Patches a collection in `object`. It will also work for collection with the add/delete method.
     *
     * @param object $object   - the entity to update
     * @param string $property - the name of the property which holds the collection
     * @param string $action   - the action to execute on the collection (aka. add/remove/set)
     * @param array  $elements - the collection to patch
     * @param array  $options
     */
    public function patch($object, $property, $action, array $elements, array $options = [])
    {
        $methodName = $action.ucfirst(strtolower($property));

        if (!method_exists($object, $methodName)) {
            throw new \LogicException(
                sprintf('You have requested a non implemented action %s on %s', $methodName, get_class($object))
            );
        }

        //add the options to pass on here
        $this->checkPermission('PATCH', $object, ['collection' => new ObjectCollection($elements)], true);
        //we'll need to pass the $action and $data here aswell later

        if ($this->dispatch('crud_pre_patch_object', $object, $options)) {
            foreach ($elements as $element) {
                $object->$methodName($element);
            }

            $this->om->save($object);
            $this->dispatch('crud_post_patch_object', $object, $options);
        }
    }

    /**
     * Patches a property in `object`.
     *
     * @param object $object   - the entity to update
     * @param string $property - the property to update
     * @param mixed  $data     - the data that must be set
     * @param array  $options  - an array of options

     */
    public function replace($object, $property, $data, array $options = [])
    {
        $methodName = 'set'.ucfirst(strtolower($property));

        if (!method_exists($object, $methodName)) {
            throw new \LogicException(
                sprintf('You have requested a non implemented action \'set\' on %s', get_class($object))
            );
        }

        //add the options to pass on here
        $this->checkPermission('PATCH', $object, [], true);
        //we'll need to pass the $action and $data here aswell later
        if ($this->dispatch('crud_pre_patch_object', $object, $options)) {
            $object->$methodName($data);

            $this->om->save($object);
            $this->dispatch('crud_post_patch_object', $object, $options);
        }
    }

    /**
     * Validates `data` with the available validator for `class`.
     *
     * @param string $class - the class of the entity used for validation
     * @param mixed  $data  - the serialized data to validate
     * @param string $mode  - the validation mode
     */
    public function validate($class, $data, $mode)
    {
        $errors = [];

        if ($this->validator->has($class)) {
            // calls the validator for class. It will throw exception on error
            $errors = $this->validator->validate($class, $data, $mode, true);
        }

        return $errors;
    }

    /**
     * We dispatch 2 events: a generic one and an other with a custom name.
     * Listen to what you want. Both have their uses.
     *
     * @param string $name
     * @param mixed  $object
     * @param array  $options
     *
     * @return bool
     */
    public function dispatch($name, $object, array $options = [])
    {
        $generic = $this->dispatcher->dispatch($name, 'Crud', [$object, $options]);
        $serializedName = $name.'_'.strtolower(str_replace('\\', '_', get_class($object)));
        $specific = $this->dispatcher->dispatch($serializedName, 'Crud', [$object, $options]);

        return $generic->isAllowed() && $specific->isAllowed();
    }
}
