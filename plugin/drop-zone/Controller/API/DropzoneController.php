<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\DropZoneBundle\Controller\API;

use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Claroline\DropZoneBundle\Entity\Dropzone;
use Claroline\DropZoneBundle\Manager\DropzoneManager;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * @EXT\Route("/dropzone", options={"expose"=true})
 */
class DropzoneController
{
    use PermissionCheckerTrait;

    /** @var DropzoneManager */
    private $manager;

    /**
     * DropzoneController constructor.
     *
     * @DI\InjectParams({
     *     "manager" = @DI\Inject("claroline.manager.dropzone_manager")
     * })
     *
     * @param DropzoneManager $manager
     */
    public function __construct(DropzoneManager $manager)
    {
        $this->manager = $manager;
    }

    /**
     * Updates a Dropzone resource.
     *
     * @EXT\Route("/{id}", name="claro_dropzone_update")
     * @EXT\Method("PUT")
     * @EXT\ParamConverter(
     *     "dropzone",
     *     class="ClarolineDropZoneBundle:Dropzone"
     * )
     *
     * @param Dropzone $dropzone
     * @param Request  $request
     *
     * @return JsonResponse
     */
    public function dropzoneUpdateAction(Dropzone $dropzone, Request $request)
    {
        $this->checkPermission('EDIT', $dropzone, [], true);

        try {
            $this->manager->update($dropzone, json_decode($request->getContent(), true));

            return new JsonResponse(
                $this->manager->serialize($dropzone)
            );
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), 422);
        }
    }

    /**
     * Deletes a Dropzone resource.
     *
     * @EXT\Route("/{id}", name="claro_dropzone_delete")
     * @EXT\Method("DELETE")
     * @EXT\ParamConverter(
     *     "dropzone",
     *     class="ClarolineDropZoneBundle:Dropzone"
     * )
     *
     * @param Dropzone $dropzone
     *
     * @return JsonResponse
     */
    public function dropzoneDeleteAction(Dropzone $dropzone)
    {
        $this->checkPermission('DELETE', $dropzone, [], true);

        try {
            $this->manager->delete($dropzone);

            return new JsonResponse(null, 204);
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), 422);
        }
    }
}
