<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\APINew;

use Claroline\CoreBundle\Annotations\ApiMeta;
use FOS\RestBundle\Controller\Annotations\View;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * @ApiMeta(
 *     class="Claroline\CoreBundle\Entity\Organization\Organization",
 *     prefix="organization"
 * )
 */
class OrganizationController extends AbstractController
{
    public function list(Request $request, $class, $env)
    {
        return new JsonResponse($this->finder->search($class, $request->query->all(), ['recursive' => true]));
    }
}
