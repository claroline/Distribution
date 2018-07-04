<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\APINew\Tool\Home;

use Claroline\AppBundle\Controller\AbstractCrudController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * @EXT\Route("/home")
 */
class HomeController extends AbstractCrudController
{
    /**
     * @EXT\Route(
     *    "/update",
     *    name="apiv2_home_update",
     *    options={ "method_prefix" = false }
     * )
     * @EXT\Method("PUT")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function updateHomeAction(Request $request)
    {
        $tabs = $this->decodeRequest($request);
        //here we assume we got the data properly

        foreach ($tabs as $tab) {
            $this->crud->update('Claroline\CoreBundle\Entity\Tool\Home\HomeTab', $tab);
        }

        return new JsonResponse([]);
    }

    /** @return string */
    public function getName()
    {
        return 'home';
    }
}
