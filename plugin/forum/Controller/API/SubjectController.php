<?php

namespace Claroline\ForumBundle\Controller\API;

use Claroline\AppBundle\Annotations\ApiMeta;
use Claroline\AppBundle\Controller\AbstractCrudController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;

/**
 * @EXT\Route("/forum_subject")
 * @ApiMeta(
 *     class="Claroline\ForumBundle\Entity\Subject"
 * )
 */
class SubjectController extends AbstractCrudController
{
    public function getName()
    {
        return 'forum_subject';
    }
}
