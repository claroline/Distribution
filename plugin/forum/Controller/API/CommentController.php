<?php

namespace Claroline\ForumBundle\Controller\API;

use Claroline\AppBundle\Annotations\ApiMeta;
use Claroline\AppBundle\Controller\AbstractCrudController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;

/**
 * @EXT\Route("/forum_comment")
 * @ApiMeta(
 *     class="Claroline\ForumBundle\Entity\Comment"
 * )
 */
class CommentController extends AbstractCrudController
{
    public function getName()
    {
        return 'forum_comment';
    }
}
