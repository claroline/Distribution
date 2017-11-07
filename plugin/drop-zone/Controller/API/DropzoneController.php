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

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Claroline\DropZoneBundle\Entity\Document;
use Claroline\DropZoneBundle\Entity\Drop;
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
     *     class="ClarolineDropZoneBundle:Dropzone",
     *     options={"mapping": {"id": "uuid"}}
     * )
     *
     * @param Dropzone $dropzone
     * @param Request  $request
     *
     * @return JsonResponse
     */
    public function dropzoneUpdateAction(Dropzone $dropzone, Request $request)
    {
        $this->checkPermission('EDIT', $dropzone->getResourceNode(), [], true);

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
     *     class="ClarolineDropZoneBundle:Dropzone",
     *     options={"mapping": {"id": "uuid"}}
     * )
     *
     * @param Dropzone $dropzone
     *
     * @return JsonResponse
     */
    public function dropzoneDeleteAction(Dropzone $dropzone)
    {
        $this->checkPermission('DELETE', $dropzone->getResourceNode(), [], true);

        try {
            $this->manager->delete($dropzone);

            return new JsonResponse(null, 204);
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), 422);
        }
    }

    /**
     * Adds a Document to a Drop.
     *
     * @EXT\Route("/drop/{id}/type/{type}", name="claro_dropzone_document_add")
     * @EXT\Method("POST")
     * @EXT\ParamConverter(
     *     "drop",
     *     class="ClarolineDropZoneBundle:Drop",
     *     options={"mapping": {"id": "uuid"}}
     * )
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     *
     * @param Drop    $drop
     * @param int     $type
     * @param User    $user
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function documentAddAction(Drop $drop, $type, User $user, Request $request)
    {
        $dropzone = $drop->getDropzone();
        $this->checkPermission('OPEN', $dropzone->getResourceNode(), [], true);
        $dropData = null;

        switch ($type) {
            case Document::DOCUMENT_TYPE_FILE:
                $dropData = $request->files->get('dropData', false);
                break;
            case Document::DOCUMENT_TYPE_TEXT:
            case Document::DOCUMENT_TYPE_URL:
            case Document::DOCUMENT_TYPE_RESOURCE:
                $dropData = $request->request->get('dropData', false);
                break;
        }

        try {
            $document = $this->manager->createDocument($drop, $user, intval($type), $dropData);

            return new JsonResponse($this->manager->serializeDocument($document));
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), 422);
        }
    }

    /**
     * Adds a Document to a Drop.
     *
     * @EXT\Route("/document/{id}", name="claro_dropzone_document_delete")
     * @EXT\Method("DELETE")
     * @EXT\ParamConverter(
     *     "document",
     *     class="ClarolineDropZoneBundle:Document",
     *     options={"mapping": {"id": "uuid"}}
     * )
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     *
     * @param Document $document
     * @param User     $user
     *
     * @return JsonResponse
     */
    public function documentDeleteAction(Document $document, User $user)
    {
        $drop = $document->getDrop();
        $dropzone = $drop->getDropzone();
        $this->checkPermission('OPEN', $dropzone->getResourceNode(), [], true);

        try {
            $documentId = $document->getUuid();
            $this->manager->deleteDocument($document);

            return new JsonResponse($documentId);
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), 422);
        }
    }
}
