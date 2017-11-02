<?php

namespace Claroline\CoreBundle\API\Serializer\User;

use Claroline\CoreBundle\API\Serializer\AbstractSerializer;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.group")
 * @DI\Tag("claroline.serializer")
 */
class GroupSerializer
{
    use SerializerTrait;

    public function getClass()
    {
        return 'Claroline\CoreBundle\Entity\Group';
    }
}
