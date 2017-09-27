<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\API\User;

use Claroline\CoreBundle\Annotations\ApiMeta;
use Claroline\CoreBundle\Controller\API\AbstractController;
use FOS\RestBundle\Controller\Annotations\View;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

/**
 * @ApiMeta(
 *     class="Claroline\CoreBundle\Entity\Role",
 *     prefix="role"
 * )
 */
class RoleController extends AbstractController
{
    /**
     * Render the home page of the platform.
     *
     * @Route("/test/custom", name="claro_test_custom")
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function testCustom($type)
    {
    }
}
