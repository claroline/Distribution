<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\BookingBundle\Security\Voter;

use Claroline\BookingBundle\Entity\Room;
use Claroline\CoreBundle\Security\Voter\AbstractVoter;

class RoomVoter extends AbstractVoter
{
    public function getClass()
    {
        return Room::class;
    }
}
