<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\APINew\Resource\Types;

use Claroline\AppBundle\Controller\AbstractCrudController;
use Claroline\AppBundle\Event\StrictDispatcher;
use Claroline\CoreBundle\Entity\Resource\File;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Manager\ResourceManager;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * @EXT\Route("resource_file")
 */
class FileController extends AbstractCrudController
{
    /** @var StrictDispatcher */
    private $eventDispatcher;

    /** @var ResourceManager */
    private $resourceManager;

    /**
     * ResourceNodeController constructor.
     *
     * @DI\InjectParams({
     *     "eventDispatcher" = @DI\Inject("claroline.event.event_dispatcher"),
     *     "resourceManager" = @DI\Inject("claroline.manager.resource_manager")
     * })
     *
     * @param StrictDispatcher $eventDispatcher
     * @param ResourceManager  $resourceManager
     */
    public function __construct(
        StrictDispatcher $eventDispatcher,
        ResourceManager $resourceManager
    ) {
        $this->eventDispatcher = $eventDispatcher;
        $this->resourceManager = $resourceManager;
    }

    public function getName()
    {
        return 'resource_file';
    }

    public function getClass()
    {
        return File::class;
    }

    public function getIgnore()
    {
        return ['create', 'update', 'exist', 'list', 'copyBulk', 'deleteBulk', 'schema', 'find', 'get'];
    }

    /**
     * @EXT\Route(
     *     "{node}/file/change",
     *     name="apiv2_resource_file_change"
     * )
     * @EXT\ParamConverter(
     *     "node",
     *     class="ClarolineCoreBundle:Resource\ResourceNode",
     *     options={"mapping": {"node": "uuid"}}
     * )
     *
     * @param ResourceNode $node
     * @param Request      $request
     *
     * @return JsonResponse
     */
    public function fileChangeAction(ResourceNode $node, Request $request)
    {
        $files = $request->files->all();

        $file = isset($files['file']) ? $files['file'] : null;

        if ($file) {
            $handler = $request->get('handler');
            $publicFile = $this->crud->create(
                'Claroline\CoreBundle\Entity\File\PublicFile',
                [],
                ['file' => $file]
            );
            $this->eventDispatcher->dispatch(
                strtolower('upload_file_'.$handler),
                'File\UploadFile',
                [$publicFile]
            );
            $resource = $this->resourceManager->getResourceFromNode($node);

            if ($resource) {
                $resource->setHashName($publicFile->getUrl());
                $resource->setMimeType($publicFile->getMimeType());
                $resource->setSize($publicFile->getSize());
                $this->om->persist($resource);
                $this->om->flush();
            }
        }

        return new JsonResponse($this->serializer->serialize($node));
    }
}
