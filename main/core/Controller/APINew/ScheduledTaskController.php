<?php

namespace Claroline\CoreBundle\Controller\APINew;

use Claroline\CoreBundle\Annotations\ApiMeta;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Claroline\CoreBundle\Controller\APINew\Model\HasUsersTrait;

/**
 * @ApiMeta(class="Claroline\CoreBundle\Entity\Task\ScheduledTask")
 * @Route("/scheduledtask")
 */
class ScheduledTaskController extends AbstractCrudController
{
    use HasUsersTrait;

    public function getName()
    {
        return 'scheduledtask';
    }
}
