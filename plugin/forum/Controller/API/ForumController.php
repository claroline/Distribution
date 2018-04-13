<?php

namespace Claroline\ForumBundle\Controller\API;

use Claroline\AppBundle\Controller\AbstractCrudController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;

/**
 * @EXT\Route("/forum")
 */
class ForumController extends AbstractCrudController
{
    public function getName()
    {
        return 'forum';
    }

    public function getClass()
    {
        return "Claroline\ForumBundle\Entity\Forum";
    }
}
