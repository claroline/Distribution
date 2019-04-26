<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace FormaLibre\ReservationBundle\Controller\API;

use Claroline\AppBundle\Controller\AbstractCrudController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

/**
 * @Route("/reservationresourcerights")
 */
class ResourceRightsController extends AbstractCrudController
{
    public function getClass()
    {
        return 'FormaLibre\ReservationBundle\Entity\ResourceRights';
    }

    public function getName()
    {
        return 'reservation_resource_rights';
    }
}
