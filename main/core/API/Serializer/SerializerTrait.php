<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\API\Serializer;

use Claroline\CoreBundle\Entity\Resource\ResourceNode;

/**
 * Allows the target class to checks the current user permissions on a ResourceNode.
 */
trait SerializerTrait
{
    /**
     * Injects Serializer service.
     *
     * @DI\InjectParams({
     *      "serializer" = @DI\Inject("claroline.generic_serializer")
     * })
     *
     * @param GenericSerializer $serializer
     */
    public function setSerializer(GenericSerializer $serializer)
    {
        $this->serializer = $serializer;
    }

    public function serialize($object, array $options = [])
    {
        return $this->serializer->serialize($object, $options);
    }

    public function deserialize($data, $object = null, $class = null, array $options = [])
    {
        return $this->serializer->deserialize($class, $data, $options);
    }
}
