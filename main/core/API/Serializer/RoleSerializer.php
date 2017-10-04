<?php

namespace Claroline\CoreBundle\API\Serializer;

use Claroline\CoreBundle\Entity\Role;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.role")
 * @DI\Tag("claroline.serializer")
 */
class RoleSerializer extends AbstractSerializer
{
    public function getClass()
    {
        return 'Claroline\CoreBundle\Entity\Role';
    }
}
