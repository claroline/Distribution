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

use Claroline\CoreBundle\API\AbstractController;
use Claroline\CoreBundle\API\FinderProvider;
use Claroline\CoreBundle\API\SerializerProvider;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations\NamePrefix;
use FOS\RestBundle\Controller\Annotations\View;
use FOS\RestBundle\Controller\FOSRestController;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @NamePrefix("api_")
 */
class RoleController extends AbstractController
{
    /**
     * @DI\InjectParams({
     *     "finder" = @DI\Inject("claroline.api.finder"),
     *     "serializer" = @DI\Inject("claroline.api.serializer")
     * })
     */
    public function __construct(
      FinderProvider $finder,
      SerializerProvider $serializer
    ) {
        $this->finder = $finder;
        $this->serializer = $serializer;
    }

    /**
     * @Get("/roles/page/{page}/limit/{limit}/search", name="get_search_roles", options={ "method_prefix" = false })
     */
    public function getSearchRolesAction($page, $limit)
    {
        return $this->finder->search(
            'Claroline\CoreBundle\Entity\Role',
            $page,
            $limit,
            $this->container->get('request')->query->all()
        );
    }

    /**
     * @Get("/roles/add", name="api_add_role", options={ "method_prefix" = false })
     */
    public function addRoleAction()
    {
        $data = $this->decodeRequestData($request);
        $role = $this->serializer->unserialize();
    }
}
