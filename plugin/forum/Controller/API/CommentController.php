<?php

namespace Claroline\ForumBundle\Controller\API;

use Claroline\AppBundle\Controller\AbstractCrudController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;

/**
 * @EXT\Route("/forum_comment")
 */
class CommentController extends AbstractCrudController
{
    public function getName()
    {
        return 'forum_comment';
    }

    public function getClass()
    {
        return "Claroline\ForumBundle\Entity\Comment";
    }
}
