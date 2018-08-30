<?php

namespace Claroline\CoreBundle\Controller\APINew\Resource;

use Claroline\AppBundle\Controller\AbstractCrudController;
use Claroline\AppBundle\Event\StrictDispatcher;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * @EXT\Route("/resource")
 */
class ResourceNodeController extends AbstractCrudController
{
    /** @var TokenStorageInterface */
    private $tokenStorage;

    /**
     * ResourceNodeController constructor.
     *
     * @DI\InjectParams({
     *     "tokenStorage" = @DI\Inject("security.token_storage")
     * })
     *
     * @param TokenStorageInterface $tokenStorage
     */
    public function __construct(
        TokenStorageInterface $tokenStorage)
    {
        $this->tokenStorage = $tokenStorage;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'resource_node';
    }

    /**
     * @EXT\Route("/{parent}", name="apiv2_resource_list", defaults={"parent"=null})
     *
     * @param Request $request
     * @param string  $parent
     * @param string  $class
     *
     * @return JsonResponse
     *
     * @todo do not return hidden resources to standard users
     */
    public function listAction(Request $request, $parent, $class = ResourceNode::class)
    {
        $options = $request->query->all();

        if (!empty($parent)) {
            // grab directory content
            $parentNode = $this->om
                ->getRepository(ResourceNode::class)
                ->findOneBy(['uuid' => $parent]);

            $options['hiddenFilters']['parent'] = $parentNode ? $parentNode->getId() : null;
        } else {
            $options['hiddenFilters']['parent'] = null;
        }
        $options['hiddenFilters']['active'] = true;
        $options['hiddenFilters']['resourceTypeEnabled'] = true;

        return new JsonResponse(
            $this->finder->search(ResourceNode::class, $options)
        );
    }

    /**
     * @EXT\Route("/portal", name="apiv2_portal_index")
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function portalSearchAction(Request $request)
    {
        $options = $request->query->all();

        $options['hiddenFilters']['published'] = true;

        // Limit the search to resource nodes published to portal
        $options['hiddenFilters']['publishedToPortal'] = true;

        // Limit the search to only the authorized resource types which can be displayed on the portal
        $options['hiddenFilters']['resourceType'] = $this->container->get('claroline.manager.portal_manager')->getPortalEnabledResourceTypes();

        return new JsonResponse(
            $this->finder->search(ResourceNode::class, $options)
        );
    }

    /**
     * @EXT\Route(
     *     "{parent}/files",
     *     name="apiv2_resource_files_create"
     * )
     * @EXT\ParamConverter(
     *     "parent",
     *     class="ClarolineCoreBundle:Resource\ResourceNode",
     *     options={"mapping": {"parent": "uuid"}}
     * )
     *
     * @param ResourceNode $parent
     * @param Request      $request
     *
     * @return JsonResponse
     */
    public function resourceFilesCreateAction(ResourceNode $parent, Request $request)
    {
        $files = $request->files->all();
        $handler = $request->get('handler');
        $objects = [];
        /** @var StrictDispatcher */
        $dispatcher = $this->container->get('claroline.event.event_dispatcher');

        foreach ($files as $file) {
            $object = $this->crud->create(
                'Claroline\CoreBundle\Entity\File\PublicFile',
                [],
                ['file' => $file]
            );
            $dispatcher->dispatch(strtolower('upload_file_'.$handler), 'File\UploadFile', [$object]);
            $objects[] = $object;
        }

        return $objects;
    }
}
