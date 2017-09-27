<?php

namespace Claroline\CoreBundle\API\Serializer;

use JMS\DiExtraBundle\Annotation as DI;

class AbstractSerializer
{
    /** @DI\Inject("claroline.persistence.object_manager") */
    private $om;
}
