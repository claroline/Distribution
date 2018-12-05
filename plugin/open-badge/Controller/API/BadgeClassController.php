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
use Claroline\CoreBundle\Entity\User;
use Claroline\OpenBadgeBundle\Entity\Assertion;
use Claroline\OpenBadgeBundle\Entity\BadgeClass;
use Claroline\OpenBadgeBundle\Manager\OpenBadgeManager;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * @EXT\Route("/badge-class")
 */
class BadgeClassController extends AbstractCrudController
{
    /**
     * @DI\InjectParams({
     *     "tokenStorage" = @DI\Inject("security.token_storage"),
     *     "manager"      = @DI\Inject("claroline.manager.open_badge_manager"),
     * })
     *
     * @param TwigEngine     $templating
     * @param FinderProvider $finder
     */
    public function __construct(
        TokenStorageInterface $tokenStorage,
        OpenBadgeManager $manager
    ) {
        $this->manager = $manager;
        $this->tokenStorage = $tokenStorage;
    }

    public function getName()
    {
        return 'badge-class';
    }

    public function getClass()
    {
        return BadgeClass::class;
    }

    /**
     * @EXT\Route("/{badge}/users/add", name="apiv2_badge_add_users")
     * @EXT\Method("PATCH")
     * @EXT\ParamConverter("badge", class="ClarolineOpenBadgeBundle:BadgeClass", options={"mapping": {"badge": "uuid"}})
     *
     * @return JsonResponse
     */
    public function addUserAction(BadgeClass $badge, Request $request)
    {
        $users = $this->decodeIdsString($request, User::class);

        foreach ($users as $user) {
            $this->manager->addAssertion($badge, $user);
        }

        return new JsonResponse(
            $this->serializer->serialize($badge)
        );
    }

    /**
     * @EXT\Route("/{badge}/users/remove", name="apiv2_badge_remove_users")
     * @EXT\Method("DELETE")
     * @EXT\ParamConverter("badge", class="ClarolineOpenBadgeBundle:BadgeClass", options={"mapping": {"badge": "uuid"}})
     *
     * @return JsonResponse
     */
    public function removeUserAction(BadgeClass $badge, Request $request)
    {
        $users = $this->decodeIdsString($request, User::class);

        foreach ($users as $user) {
            $this->manager->revokeAssertion($badge, $user);
        }

        return new JsonResponse(
            $this->serializer->serialize($badge)
        );
    }

    /**
     * @EXT\Route("/{badge}/assertions/users", name="apiv2_badge_users_list")
     * @EXT\Method("GET")
     * @EXT\ParamConverter("badge", class="ClarolineOpenBadgeBundle:BadgeClass", options={"mapping": {"badge": "uuid"}})
     *
     * @return JsonResponse
     */
    public function getAssertionsUsersAction(Request $request, BadgeClass $badge)
    {
        $params = $request->query->all();

        $assertions = $this->finder->fetch(
          Assertion::class,
          ['badge' => $badge->getUuid(), 'revoked' => false],
          [],
          $params['page'],
          $params['limit']
        );

        $total = $this->finder->fetch(Assertion::class,
            ['badge' => $badge->getUuid(), 'revoked' => false],
            [],
            $params['page'],
            $params['limit'],
            true
        );

        //not really clean but it allows us to not add anything to the core bundle for now
        $users = array_map(function (Assertion $assertion) {
            return $this->serializer->serialize($assertion->getRecipient());
        }, $assertions);

        return new JsonResponse(
          ['data' => $users, 'page' => $params['page'], 'limit' => $params['limit'], 'totalResults' => $total]
        );
    }

    /**
     * @EXT\Route("/current-user", name="apiv2_badge-class_current_user_list")
     * @EXT\Method("GET")
     *
     * @return JsonResponse
     */
    public function getMyBadgesAction(Request $request)
    {
        $user = $this->tokenStorage->getToken()->getUser();

        return new JsonResponse(
            $this->finder->search(BadgeClass::class, array_merge(
                $request->query->all(),
                ['hiddenFilters' => ['recipient' => $user->getUuid()]]
            ))
        );
    }
}
