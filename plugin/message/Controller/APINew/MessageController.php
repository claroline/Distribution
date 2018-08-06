<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\MessageBundle\Controller\APINew;

use Claroline\AppBundle\Controller\AbstractCrudController;
use Claroline\MessageBundle\Entity\Message;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;

/**
 * @EXT\Route("/message")
 */
class MessageController extends AbstractCrudController
{
    /** @return string */
    public function getName()
    {
        return 'message';
    }

    public function getClass()
    {
        return Message::class;
    }
}
