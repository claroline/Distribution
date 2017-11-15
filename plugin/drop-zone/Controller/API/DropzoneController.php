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

use Claroline\CoreBundle\API\FinderProvider;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Security\Collection\ResourceCollection;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Claroline\DropZoneBundle\Entity\Correction;
use Claroline\DropZoneBundle\Entity\Document;
use Claroline\DropZoneBundle\Entity\Drop;
use Claroline\DropZoneBundle\Entity\Dropzone;
use Claroline\DropZoneBundle\Entity\DropzoneTool;
use Claroline\DropZoneBundle\Manager\DropzoneManager;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * @EXT\Route("/dropzone", options={"expose"=true})
 */
class DropzoneController
{
    use PermissionCheckerTrait;

    /** @var FinderProvider */
    private $finder;

    /** @var DropzoneManager */
    private $manager;

    /**
     * DropzoneController constructor.
     *
     * @DI\InjectParams({
     *     "finder"  = @DI\Inject("claroline.api.finder"),
     *     "manager" = @DI\Inject("claroline.manager.dropzone_manager")
     * })
     *
     * @param FinderProvider  $finder
     * @param DropzoneManager $manager
     */
    public function __construct(FinderProvider $finder, DropzoneManager $manager)
    {
        $this->finder = $finder;
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
     * @EXT\Route("/drop/{id}/type/{type}", name="claro_dropzone_documents_add")
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
    public function documentsAddAction(Drop $drop, $type, User $user, Request $request)
    {
        $dropzone = $drop->getDropzone();
        $this->checkPermission('OPEN', $dropzone->getResourceNode(), [], true);
        $this->checkDropEdition($drop, $user);
        $dropData = null;
        $documents = [];

        try {
            switch ($type) {
                case Document::DOCUMENT_TYPE_FILE:
                    $files = $request->files->all();
                    $documents = $this->manager->createFilesDocuments($drop, $user, $files);
                    break;
                case Document::DOCUMENT_TYPE_TEXT:
                case Document::DOCUMENT_TYPE_URL:
                case Document::DOCUMENT_TYPE_RESOURCE:
                    $dropData = $request->request->get('dropData', false);
                    $document = $this->manager->createDocument($drop, $user, intval($type), $dropData);
                    $documents[] = $this->manager->serializeDocument($document);
                    break;
            }

            return new JsonResponse($documents);
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), 422);
        }
    }

    /**
     * Deletes a Document.
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
        $this->checkDropEdition($drop, $user);

        try {
            $documentId = $document->getUuid();
            $this->manager->deleteDocument($document);

            return new JsonResponse($documentId);
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), 422);
        }
    }

    /**
     * Submits Drop.
     *
     * @EXT\Route("/drop/{id}/submit", name="claro_dropzone_drop_submit")
     * @EXT\Method("PUT")
     * @EXT\ParamConverter(
     *     "drop",
     *     class="ClarolineDropZoneBundle:Drop",
     *     options={"mapping": {"id": "uuid"}}
     * )
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     *
     * @param Drop $drop
     * @param User $user
     *
     * @return JsonResponse
     */
    public function dropSubmitAction(Drop $drop, User $user)
    {
        $dropzone = $drop->getDropzone();
        $this->checkPermission('OPEN', $dropzone->getResourceNode(), [], true);
        $this->checkDropEdition($drop, $user);

        try {
            $this->manager->submitDrop($drop);

            return new JsonResponse($this->manager->serializeDrop($drop));
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), 422);
        }
    }

    /**
     * @EXT\Route("/{id}/drops/search", name="claro_dropzone_drops_search")
     * @EXT\Method("GET")
     * @EXT\ParamConverter(
     *     "dropzone",
     *     class="ClarolineDropZoneBundle:Dropzone",
     *     options={"mapping": {"id": "uuid"}}
     * )
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     *
     * @param Dropzone $dropzone
     * @param Request  $request
     *
     * @return JsonResponse
     */
    public function dropsSearchAction(Dropzone $dropzone, Request $request)
    {
        $this->checkPermission('EDIT', $dropzone->getResourceNode(), [], true);
        $params = $request->query->all();

        if (!isset($params['filters'])) {
            $params['filters'] = [];
        }
        $params['filters']['dropzone'] = $dropzone->getUuid();

        $data = $this->finder->search(
            'Claroline\DropZoneBundle\Entity\Drop',
            $params
        );

        return new JsonResponse($data, 200);
    }

    /**
     * @EXT\Route("/drop/{id}", name="claro_dropzone_drop_fetch")
     * @EXT\Method("GET")
     * @EXT\ParamConverter(
     *     "drop",
     *     class="ClarolineDropZoneBundle:Drop",
     *     options={"mapping": {"id": "uuid"}}
     * )
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     *
     * @param Drop $drop
     *
     * @return JsonResponse
     */
    public function dropFetchAction(Drop $drop)
    {
        $dropzone = $drop->getDropzone();
        /* TODO: checks if current user can edit resource or view this drop */
        $this->checkPermission('OPEN', $dropzone->getResourceNode(), [], true);

        return new JsonResponse($this->manager->serializeDrop($drop));
    }

    /**
     * @EXT\Route("/drop/{id}/correction/save", name="claro_dropzone_correction_save")
     * @EXT\Method("POST")
     * @EXT\ParamConverter(
     *     "drop",
     *     class="ClarolineDropZoneBundle:Drop",
     *     options={"mapping": {"id": "uuid"}}
     * )
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     *
     * @param Drop    $drop
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function correctionSaveAction(Drop $drop, Request $request)
    {
        $dropzone = $drop->getDropzone();
        $this->checkPermission('OPEN', $dropzone->getResourceNode(), [], true);

        try {
            $correction = $this->manager->saveCorrection(json_decode($request->getContent(), true));

            return new JsonResponse(
                $this->manager->serializeCorrection($correction)
            );
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), 422);
        }
    }

    /**
     * @EXT\Route("/correction/{id}/submit", name="claro_dropzone_correction_submit")
     * @EXT\Method("PUT")
     * @EXT\ParamConverter(
     *     "correction",
     *     class="ClarolineDropZoneBundle:Correction",
     *     options={"mapping": {"id": "uuid"}}
     * )
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     *
     * @param Correction $correction
     *
     * @return JsonResponse
     */
    public function correctionSubmitAction(Correction $correction)
    {
        $dropzone = $correction->getDrop()->getDropzone();
        $this->checkPermission('OPEN', $dropzone->getResourceNode(), [], true);

        try {
            $this->manager->submitCorrection($correction);

            return new JsonResponse(
                $this->manager->serializeCorrection($correction)
            );
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), 422);
        }
    }

    /**
     * @EXT\Route("/correction/{id}/validation/switch", name="claro_dropzone_correction_validation_switch")
     * @EXT\Method("PUT")
     * @EXT\ParamConverter(
     *     "correction",
     *     class="ClarolineDropZoneBundle:Correction",
     *     options={"mapping": {"id": "uuid"}}
     * )
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     *
     * @param Correction $correction
     *
     * @return JsonResponse
     */
    public function correctionValidationSwitchAction(Correction $correction)
    {
        $dropzone = $correction->getDrop()->getDropzone();
        $this->checkPermission('OPEN', $dropzone->getResourceNode(), [], true);

        try {
            $this->manager->switchCorrectionValidation($correction);

            return new JsonResponse(
                $this->manager->serializeCorrection($correction)
            );
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), 422);
        }
    }

    /**
     * @EXT\Route("/correction/{id}/delete", name="claro_dropzone_correction_delete")
     * @EXT\Method("DELETE")
     * @EXT\ParamConverter(
     *     "correction",
     *     class="ClarolineDropZoneBundle:Correction",
     *     options={"mapping": {"id": "uuid"}}
     * )
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     *
     * @param Correction $correction
     *
     * @return JsonResponse
     */
    public function correctionDeleteAction(Correction $correction)
    {
        $dropzone = $correction->getDrop()->getDropzone();
        $this->checkPermission('OPEN', $dropzone->getResourceNode(), [], true);

        try {
            $serializedCorrection = $this->manager->serializeCorrection($correction);
            $this->manager->deleteCorrection($correction);

            return new JsonResponse($serializedCorrection);
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), 422);
        }
    }

    /**
     * @EXT\Route("/{id}/peer/drop/fetch", name="claro_dropzone_peer_drop_fetch")
     * @EXT\Method("GET")
     * @EXT\ParamConverter(
     *     "dropzone",
     *     class="ClarolineDropZoneBundle:Dropzone",
     *     options={"mapping": {"id": "uuid"}}
     * )
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     *
     * @param Dropzone $dropzone
     * @param User     $user
     *
     * @return JsonResponse
     */
    public function peerDropFetchAction(Dropzone $dropzone, User $user)
    {
        $this->checkPermission('OPEN', $dropzone->getResourceNode(), [], true);
        $drop = $this->manager->getPeerDrop($dropzone, $user);
        $data = empty($drop) ? null : $this->manager->serializeDrop($drop);

        return new JsonResponse($data);
    }

    /**
     * @EXT\Route("/tool/save", name="claro_dropzone_tool_save")
     * @EXT\Method("POST")
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function toolSaveAction(Request $request)
    {
        /* TODO: Checks plugin config access rights */
        try {
            $tool = $this->manager->saveTool(json_decode($request->getContent(), true));

            return new JsonResponse(
                $this->manager->serializeTool($tool)
            );
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), 422);
        }
    }

    /**
     * @EXT\Route("/tool/{tool}/document/{document}", name="claro_dropzone_tool_execute")
     * @EXT\Method("POST")
     * @EXT\ParamConverter(
     *     "tool",
     *     class="ClarolineDropZoneBundle:DropzoneTool",
     *     options={"mapping": {"tool": "uuid"}}
     * )
     * @EXT\ParamConverter(
     *     "document",
     *     class="ClarolineDropZoneBundle:Document",
     *     options={"mapping": {"document": "uuid"}}
     * )
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     *
     * @param DropzoneTool $tool
     * @param Document     $document
     *
     * @return JsonResponse
     */
    public function toolExecuteAction(DropzoneTool $tool, Document $document)
    {
        $dropzone = $document->getDrop()->getDropzone();
        $this->checkPermission('EDIT', $dropzone->getResourceNode(), [], true);

        try {
            $updatedDocument = $this->manager->executeTool($tool, $document);

            return new JsonResponse($this->manager->serializeDocument($updatedDocument));
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), 422);
        }
    }

    private function checkDropEdition(Drop $drop, User $user)
    {
        $dropzone = $drop->getDropzone();
        $collection = new ResourceCollection([$dropzone->getResourceNode()]);

        if ($this->authorization->isGranted('EDIT', $collection)) {
            return;
        }

        if ($dropzone->isDropEnabled()) {
            $roles = $user->getRoles();

            if ($drop->getUser() === $user || in_array($drop->getRole(), $roles)) {
                return;
            }
        }

        throw new AccessDeniedException();
    }
}
