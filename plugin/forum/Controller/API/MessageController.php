<?php

namespace Claroline\ForumBundle\Controller\API;

use Claroline\AppBundle\Controller\AbstractCrudController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;

/**
 * @EXT\Route("/forum_message")
 */
class MessageController extends AbstractCrudController
{
    public function getName()
    {
        return 'forum_message';
    }

    public function getClass()
    {
        return "Claroline\ForumBundle\Entity\Message";
    }
}
