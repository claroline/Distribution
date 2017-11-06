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

use Claroline\CoreBundle\Entity\Organization\Location;
use Claroline\CoreBundle\Annotations\ApiMeta;
use FOS\RestBundle\Controller\Annotations\View;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * @ApiMeta(class="Claroline\CoreBundle\Entity\Organization\Location")
 * @Route("location")
 */
class LocationController extends AbstractController
{
    /**
     * @Route("/{uuid}/geolocate", name="apiv2_location_geolocate")
     * @Method("GET")
     * @ParamConverter("location", class = "Claroline\CoreBundle\Entity\Organization\Location", options = {"uuid" = "location"})
     */
    public function geolocateAction(Location $location)
    {
        $this->container->get('claroline.manager.organization.location_manager')->setCoordinates($location);

        return new JsonResponse($this->serializer->get('Claroline\CoreBundle\Entity\Organization\Location')->serialize($location));
    }
}
