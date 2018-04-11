<?php

namespace Claroline\ForumBundle\Controller\API;

use Claroline\AppBundle\Annotations\ApiMeta;
use Claroline\AppBundle\Controller\AbstractCrudController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;

/**
 * @EXT\Route("/forum_message")
 * @ApiMeta(
 *     class="Claroline\ForumBundle\Entity\Message"
 * )
 */
class MessageController extends AbstractCrudController
{
    public function getName()
    {
        return 'forum_message';
    }
}
