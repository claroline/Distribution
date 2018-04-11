<?php

namespace Claroline\ForumBundle\Controller\API;

use Claroline\AppBundle\Annotations\ApiMeta;
use Claroline\AppBundle\Controller\AbstractCrudController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;

/**
 * @EXT\Route("/forum")
 * @ApiMeta(
 *     class="Claroline\ForumBundle\Entity\Forum"
 * )
 */
class ForumController extends AbstractCrudController
{
    public function getName()
    {
        return 'forum';
    }
}
