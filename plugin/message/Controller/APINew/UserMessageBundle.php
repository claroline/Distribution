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

use Claroline\AppBundle\Annotations\ApiMeta;
use Claroline\AppBundle\Controller\AbstractCrudController;
use Claroline\MessageBundle\Entity\UserMessage;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;

/**
 * @ApiMeta(
 *     class="Claroline\MessageBundle\Entity\UserMessage"
 * )
 * @EXT\Route("/usermessage")
 */
class MessageController extends AbstractCrudController
{
    /** @return string */
    public function getName()
    {
        return 'usermessage';
    }

    public function getClass()
    {
        return UserMessage::class;
    }
}
