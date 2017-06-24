<?php

namespace Claroline\CoreBundle\API;

use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.API.serializer")
 */
class SerializerProvider
{
    /**
     * The list of registered serializers in the platform.
     *
     * @var array
     */
    private $serializers = [];

    /**
     * Registers a new serializer.
     *
     * @param mixed $serializer
     *
     * @throws \Exception
     */
    public function add($serializer)
    {
        if (!method_exists($serializer, 'serialize')) {
            throw new \Exception('The serializer '.get_class($serializer).' must implement the method serialize');
        }

        $this->serializers[] = $serializer;
    }

    /**
     * Gets a registered serializer instance.
     *
     * @param mixed $object
     *
     * @return mixed
     *
     * @throws \Exception
     */
    public function get($object)
    {
        foreach ($this->serializers as $serializer) {
            $p = new \ReflectionParameter([get_class($serializer), 'serialize'], 0);
            $className = $p->getClass()->getName();

            if ($object instanceof $className) {
                return $serializer;
            }
        }

        throw new \Exception(
            sprintf('No serializer found for class "%s" Maybe you forgot to add the "claroline.serializer" tag to your serializer.', get_class($object))
        );
    }

    /**
     * Serializes an object.
     *
     * @param $object - the object to serialize.
     *
     * @return mixed - a json serializable structure.
     */
    public function serialize($object)
    {
        return $this->get($object)->serialize($object);
    }
}
