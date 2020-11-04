<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\BookingBundle\Controller;

use Claroline\AppBundle\Controller\AbstractCrudController;
use Claroline\BookingBundle\Entity\Room;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/booking_room")
 */
class RoomController extends AbstractCrudController
{
    public function getName()
    {
        return 'booking_room';
    }

    public function getClass()
    {
        return Room::class;
    }
}
