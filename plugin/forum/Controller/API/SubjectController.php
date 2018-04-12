<?php

namespace Claroline\ForumBundle\Controller\API;

use Claroline\AppBundle\Controller\AbstractCrudController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;

/**
 * @EXT\Route("/forum_subject")
 */
class SubjectController extends AbstractCrudController
{
    public function getName()
    {
        return 'forum_subject';
    }

    public function getClass()
    {
        return "Claroline\ForumBundle\Entity\Subject";
    }
}
