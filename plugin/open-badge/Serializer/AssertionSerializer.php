<?php

namespace Claroline\OpenBadgeBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\OpenBadgeBundle\Entity\Assertion;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service()
 * @DI\Tag("claroline.serializer")
 */
class AssertionSerializer
{
    use SerializerTrait;

    public function __construct()
    {
    }

    public function getClass()
    {
        return Assertion::class;
    }
}
