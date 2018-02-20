<?php

namespace Claroline\CoreBundle\Controller\APINew;

use Claroline\AppBundle\Controller\AbstractCrudController;
use Claroline\AppBundle\Annotations\ApiMeta;
use Claroline\CoreBundle\Controller\APINew\Model\HasUsersTrait;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

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
