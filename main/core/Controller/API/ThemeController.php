<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\API;

use Claroline\CoreBundle\API\SerializerProvider;
use Claroline\CoreBundle\Entity\Theme\Theme;
use Claroline\CoreBundle\Manager\ThemeManager;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * @EXT\Route("/themes", name="claro_theme", options={"expose" = true})
 */
class ThemeController
{
    /** @var SerializerProvider */
    private $serializer;

    /** @var ThemeManager */
    private $manager;

    /**
     * ThemeController constructor.
     *
     * @DI\InjectParams({
     *     "serializer" = @DI\Inject("claroline.api.serializer"),
     *     "manager"    = @DI\Inject("claroline.manager.theme_manager")
     * })
     *
     * @param SerializerProvider $serializer
     * @param ThemeManager $manager
     */
    public function __construct(
        SerializerProvider $serializer,
        ThemeManager $manager)
    {
        $this->serializer = $serializer;
        $this->manager = $manager;
    }

    /**
     * Creates a new theme.
     *
     * @EXT\Route("", name="claro_theme_create")
     * @EXT\Method("POST")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function createAction(Request $request)
    {
        try {
            $created = $this->manager->create(json_decode($request->getContent(), true));

            return new JsonResponse($created, 201);
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), 422);
        }
    }

    /**
     * Updates an existing theme.
     *
     * @EXT\Route("/{uuid}", name="claro_theme_update")
     * @EXT\Method("PUT")
     *
     * @param Theme   $theme
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function updateAction(Theme $theme, Request $request)
    {
        try {
            $updated = $this->manager->update($theme, json_decode($request->getContent(), true));

            return new JsonResponse($updated, 200);
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), 422);
        }
    }

    /**
     * Deletes a theme.
     *
     * @EXT\Route("/{uuid}", name="claro_theme_delete")
     * @EXT\Method("DELETE")
     *
     * @param Theme $theme
     *
     * @return JsonResponse
     */
    public function deleteAction(Theme $theme)
    {
        try {
            $this->manager->delete($theme);

            return new JsonResponse(null, 204);
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), 422);
        }
    }

    public function importAction()
    {
    }

    public function exportAction(Theme $theme)
    {
    }
}
