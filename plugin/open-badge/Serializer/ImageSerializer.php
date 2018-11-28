<?php

namespace Claroline\OpenBadgeBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service()
 * @DI\Tag("claroline.serializer")
 */
class ImageSerializer
{
    use SerializerTrait;

    public function __construct()
    {
    }

    public function getClass()
    {
        return self::class;
    }
}
