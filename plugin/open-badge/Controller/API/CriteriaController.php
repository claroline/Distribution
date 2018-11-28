<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\OpenBadgeBundle\Controller\API;

use Claroline\AppBundle\Controller\AbstractCrudController;
use Claroline\OpenBadgeBundle\Entity\Criteria;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

/**
 * @Route("/badge-criteria")
 */
class CriteriaController extends AbstractCrudController
{
    public function getName()
    {
        return 'badge-criteria';
    }

    public function getClass()
    {
        return Criteria::class;
    }
}
