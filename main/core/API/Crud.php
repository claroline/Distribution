<?php

namespace Claroline\CoreBundle\API;

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
     *     "om" = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param ObjectManager      $om
     * @param SerializerProvider $serializer
     */
    public function __construct(ObjectManager $om)
    {
        $this->om = $om;
    }

    public function create($class, $data)
    {
    }

    public function update($class, $data)
    {
    }

    public function delete($class, $data)
    {
    }

    public function validate($class, $data)
    {
    }
}
