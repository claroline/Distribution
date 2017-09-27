<?php

namespace Claroline\CoreBundle\API;

use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.api.crud")
 */
class Crud
{
    /**
     * Finder constructor.
     *
     * @DI\InjectParams({
     *     "om"         = @DI\Inject("claroline.persistence.object_manager"),
     *     "serializer" = @DI\Inject("claroline.api.serializer")
     * })
     *
     * @param ObjectManager      $om
     * @param SerializerProvider $serializer
     */
    public function __construct(ObjectManager $om, SerializerProvider $serializer)
    {
        $this->om = $om;
        $this->serializer = $serializer;
    }

    public function create($class, $data)
    {
        $this->validate($class, $data);
        $object = $this->serializer->deserialize($class, $data);
        //pre create
        $this->om->save($object);
        //post create
    }

    public function update($class, $data)
    {
        $this->validate($class, $data);
        $object = $this->serializer->deserialize($class, $data);
        //pre update
        $this->om->save($object);
        //post update
    }

    public function delete($class, $data)
    {
        //pre remove

        //post remove
    }

    public function deleteBulk($class, array $data)
    {
        foreach ($data as $el) {
            $this->delete($class, $el);
        }
    }

    public function validate($class, $data)
    {
    }
}
