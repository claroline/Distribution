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
use Claroline\BookingBundle\Entity\Material;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/booking_material")
 */
class MaterialController extends AbstractCrudController
{
    public function getName()
    {
        return 'booking_material';
    }

    public function getClass()
    {
        return Material::class;
    }
}
