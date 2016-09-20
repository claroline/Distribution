<?php

namespace UJM\ExoBundle\Library\Serializer;

interface SerializerInterface
{
    /**
     * Converts entity into a JSON-encodable structure.
     *
     * @param mixed $entity
     * @param array $options
     *
     * @return mixed
     */
    public function serialize($entity, array $options = []);

    /**
     * Converts raw data into entities.
     *
     * If `$options['entity']` is set, it will be populated,
     * else, a new object is created.
     *
     * @param \stdClass $data
     * @param array     $options
     *
     * @return mixed
     */
    public function deserialize($data, array $options = []);
}
