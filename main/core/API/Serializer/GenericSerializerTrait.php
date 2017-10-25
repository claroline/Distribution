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

use JMS\DiExtraBundle\Annotation as DI;

/**
 * Default serialization if wanted. We don't use inheritance to be able to still use type hinting
 * in some case because and avoid issues due to this:.
 *
 * @url(https://en.wikipedia.org/wiki/Covariance_and_contravariance_%28computer_science%29)
 */
trait GenericSerializerTrait
{
    /**
     * @DI\Inject("claroline.generic_serializer")
     */
    private $serializer;

    public function serialize($object, array $options = [])
    {
        return $this->serializer->serialize($object, $options);
    }

    public function deserialize($class, $data, array $options = [])
    {
        return $this->serializer->serialize($class, $data, $options);
    }
}
