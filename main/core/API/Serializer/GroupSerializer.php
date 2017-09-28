<?php

namespace Claroline\CoreBundle\API\Serializer;

use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.group")
 * @DI\Tag("claroline.serializer")
 */
class GroupSerializer extends AbstractSerializer
{
    public function getClass()
    {
        return 'Claroline\CoreBundle\Entity\Group';
    }
}
