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
use Claroline\OpenBadgeBundle\Entity\Assertion;
use Claroline\OpenBadgeBundle\Entity\BadgeClass;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * @EXT\Route("/assertion")
 */
class AssertionController extends AbstractCrudController
{
    public function getName()
    {
        return 'badge-assertion';
    }

    /**
     * @EXT\Route("/badge/{badge}", name="apiv2_assertion_badges")
     * @EXT\Method("GET")
     * @EXT\ParamConverter("badge", class="ClarolineOpenBadgeBundle:BadgeClass", options={"mapping": {"badge": "uuid"}})
     *
     * @return JsonResponse
     */
    public function getBadgeAssertionsAction(Request $request, BadgeClass $badge)
    {
        $params = $request->query->all();

        return new JsonResponse(
            $this->finder->search(Assertion::class, array_merge(
                $request->query->all(),
                ['hiddenFilters' => ['badge' => $badge->getUuid(), 'revoked' => false]]
            ))
        );
    }

    public function getClass()
    {
        return Assertion::class;
    }
}
