<?php

namespace Claroline\CoreBundle\Controller\API\Admin;

use Claroline\CoreBundle\Entity\Theme\Theme;
use Claroline\CoreBundle\Manager\ThemeManager;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * @EXT\Route("/themes", name="claro_theme", options={"expose" = true})
 */
class ThemeController
{
    private $manager;

    public function __construct(ThemeManager $manager)
    {
        $this->manager = $manager;
    }

    /**
     * Creates a new theme.
     *
     * @EXT\Route("", name="claro_theme_create")
     * @EXT\Method("POST")
     *
     * @return JsonResponse
     */
    public function createAction()
    {
        return new JsonResponse(
            null, 201
        );
    }

    /**
     * Updates an existing theme.
     *
     * @EXT\Route("/{uuid}", name="claro_theme_update")
     * @EXT\Method("PUT")
     *
     * @param Theme $theme
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function updateAction(Theme $theme, Request $request)
    {
        return new JsonResponse(
            null, 200
        );
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
        return new JsonResponse(
            null, 204
        );
    }

    public function importAction()
    {

    }

    public function exportAction(Theme $theme)
    {

    }
}
