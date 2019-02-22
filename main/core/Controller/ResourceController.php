<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller;

use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\MenuAction;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Resource\ResourceRights;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Exception\ResourceAccessException;
use Claroline\CoreBundle\Library\Security\Collection\ResourceCollection;
use Claroline\CoreBundle\Library\Security\Utilities;
use Claroline\CoreBundle\Manager\Exception\ResourceNotFoundException;
use Claroline\CoreBundle\Manager\Resource\ResourceActionManager;
use Claroline\CoreBundle\Manager\Resource\ResourceRestrictionsManager;
use Claroline\CoreBundle\Manager\ResourceManager;
use Claroline\CoreBundle\Repository\ResourceRightsRepository;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Templating\EngineInterface;

/**
 * Manages platform resources.
 * ATTENTION. be careful if you change routes order.
 *
 * @EXT\Route("/resources", options={"expose"=true})
 */
class ResourceController
{
    /** @var TokenStorageInterface */
    private $tokenStorage;

    /** @var AuthorizationCheckerInterface */
    private $authorization;

    /** @var EngineInterface */
    private $templating;

    /** @var Utilities */
    private $security;

    /** @var SerializerProvider */
    private $serializer;

    /** @var ResourceManager */
    private $manager;

    /** @var ResourceActionManager */
    private $actionManager;

    /** @var ResourceRestrictionsManager */
    private $restrictionsManager;

    /** @var ObjectManager */
    private $om;

    /** @var ResourceRightsRepository */
    private $rightsRepo;

    /**
     * ResourceController constructor.
     *
     * @DI\InjectParams({
     *     "tokenStorage"        = @DI\Inject("security.token_storage"),
     *     "templating"          = @DI\Inject("templating"),
     *     "security"            = @DI\Inject("claroline.security.utilities"),
     *     "serializer"          = @DI\Inject("claroline.api.serializer"),
     *     "manager"             = @DI\Inject("claroline.manager.resource_manager"),
     *     "actionManager"       = @DI\Inject("claroline.manager.resource_action"),
     *     "restrictionsManager" = @DI\Inject("claroline.manager.resource_restrictions"),
     *     "om"                  = @DI\Inject("claroline.persistence.object_manager"),
     *     "authorization"       = @DI\Inject("security.authorization_checker")
     * })
     *
     * @param TokenStorageInterface         $tokenStorage
     * @param EngineInterface               $templating
     * @param Utilities                     $security
     * @param SerializerProvider            $serializer
     * @param ResourceManager               $manager
     * @param ResourceActionManager         $actionManager
     * @param ResourceRestrictionsManager   $restrictionsManager
     * @param ObjectManager                 $om
     * @param AuthorizationCheckerInterface $authorization
     */
    public function __construct(
        TokenStorageInterface $tokenStorage,
        AuthorizationCheckerInterface $authorization,
        EngineInterface $templating,
        Utilities $security,
        SerializerProvider $serializer,
        ResourceManager $manager,
        ResourceActionManager $actionManager,
        ResourceRestrictionsManager $restrictionsManager,
        ObjectManager $om
    ) {
        $this->tokenStorage = $tokenStorage;
        $this->templating = $templating;
        $this->security = $security;
        $this->serializer = $serializer;
        $this->manager = $manager;
        $this->actionManager = $actionManager;
        $this->restrictionsManager = $restrictionsManager;
        $this->om = $om;
        $this->rightsRepo = $om->getRepository(ResourceRights::class);
        $this->authorization = $authorization;
    }

    /**
     * Renders a resource application.
     *
     * @EXT\Route("/show/{id}", name="claro_resource_show_short")
     * @EXT\Route("/show/{type}/{id}", name="claro_resource_show")
     * @EXT\Method("GET")
     * @EXT\ParamConverter("currentUser", converter="current_user", options={"allowAnonymous"=true})
     * @EXT\Template()
     *
     * @param int|string $id          - the id of the target node (we don't use ParamConverter to support ID and UUID)
     * @param User       $currentUser
     *
     * @return array
     *
     * @throws ResourceNotFoundException
     */
    public function showAction($id, User $currentUser = null)
    {
        /** @var ResourceNode $resourceNode */
        $resourceNode = $this->om->find(ResourceNode::class, $id);
        if (!$resourceNode) {
            throw new ResourceNotFoundException();
        }

        // TODO : not pretty, but might want on some case to download files instead ?
        // TODO : find a way to do it in the link plugin
        if ('shortcut' === $resourceNode->getResourceType()->getName()) {
            $shortcut = $this->manager->getResourceFromNode($resourceNode);
            $resourceNode = $shortcut->getTarget();
        }

        // do a minimal security check to redirect user which are not authenticated if needed.
        if (empty($currentUser) && 0 >= $this->rightsRepo->findMaximumRights([], $resourceNode)) {
            // user is not authenticated and the current node is not opened to anonymous
            throw new AccessDeniedException();
        }

        return [
            'resourceNode' => $resourceNode,
        ];
    }

    /**
     * Embeds a resource inside a rich text content.
     *
     * @EXT\Route("/embed/{id}", name="claro_resource_embed_short")
     * @EXT\Route("/embed/{type}/{id}", name="claro_resource_embed")
     *
     * @param ResourceNode $resourceNode
     *
     * @return Response
     */
    public function embedAction(ResourceNode $resourceNode)
    {
        $mimeType = explode('/', $resourceNode->getMimeType());

        $view = 'default';
        if ($mimeType[0] && in_array($mimeType[0], ['video', 'audio', 'image'])) {
            $view = $mimeType[0];
        }

        return new Response(
            $this->templating->render("ClarolineCoreBundle:resource:embed/{$view}.html.twig", [
                'resource' => $this->manager->getResourceFromNode($resourceNode),
            ])
        );
    }

    /**
     * Downloads a list of Resources.
     *
     * @EXT\Route(
     *     "/download",
     *     name="claro_resource_download",
     *     defaults ={"forceArchive"=false}
     * )
     * @EXT\Route(
     *     "/download/{forceArchive}",
     *     name="claro_resource_download",
     *     requirements={"forceArchive" = "^(true|false|0|1)$"},
     * )
     *
     * @param bool    $forceArchive
     * @param Request $request
     *
     * @return Response
     */
    public function downloadAction($forceArchive = false, Request $request)
    {
        $ids = $request->query->get('ids');
        $nodes = $this->om->findList(ResourceNode::class, 'uuid', $ids);

        $collection = new ResourceCollection($nodes);

        if (!$this->authorization->isGranted('EXPORT', $collection)) {
            throw new ResourceAccessException($collection->getErrorsForDisplay(), $collection->getResources());
        }

        $data = $this->manager->download($nodes, $forceArchive);

        $file = $data['file'] ?: tempnam('tmp', 'tmp');
        $fileName = $data['name'];
        $response = new BinaryFileResponse($file);

        $fileName = null === $fileName ? $response->getFile()->getFilename() : $fileName;
        $fileName = str_replace('/', '_', $fileName);
        $fileName = str_replace('\\', '_', $fileName);

        $response->setContentDisposition(
            ResponseHeaderBag::DISPOSITION_ATTACHMENT,
            $fileName
        );

        return $response;
    }

    /**
     * Submit access code.
     *
     * @EXT\Route("/unlock/{id}", name="claro_resource_unlock")
     * @EXT\Method("POST")
     * @EXT\ParamConverter("resourceNode", class="ClarolineCoreBundle:Resource\ResourceNode", options={"mapping": {"id": "uuid"}})
     *
     * @param ResourceNode $resourceNode
     * @param Request      $request
     *
     * @return JsonResponse
     */
    public function unlockAction(ResourceNode $resourceNode, Request $request)
    {
        $this->restrictionsManager->unlock($resourceNode, json_decode($request->getContent(), true)['code']);

        return new JsonResponse(null, 204);
    }

    /**
     * Executes an action on a collection of resources.
     *
     * @EXT\Route("/collection/{action}", name="claro_resource_collection_action")
     *
     * @param string  $action
     * @param Request $request
     *
     * @return JsonResponse
     *
     * @throws NotFoundHttpException
     */
    public function executeCollectionAction($action, Request $request)
    {
        $ids = $request->query->get('ids');

        /** @var ResourceNode[] $resourceNodes */
        $resourceNodes = $this->om->findList(ResourceNode::class, 'uuid', $ids);
        $responses = [];

        // read request and get user query
        $parameters = $request->query->all();
        $content = null;

        if (!empty($request->getContent())) {
            $content = json_decode($request->getContent(), true);
        }
        $files = $request->files->all();

        $this->om->startFlushSuite();

        foreach ($resourceNodes as $resourceNode) {
            // check the requested action exists
            if (!$this->actionManager->support($resourceNode, $action, $request->getMethod())) {
                // undefined action
                throw new NotFoundHttpException(
                    sprintf('The action %s with method [%s] does not exist for resource type %s.', $action, $request->getMethod(), $resourceNode->getResourceType()->getName())
                );
            }

            // check current user rights
            $this->checkAccess($this->actionManager->get($resourceNode, $action), [$resourceNode]);

            // dispatch action event
            $responses[] = $this->actionManager->execute($resourceNode, $action, $parameters, $content, $files);
        }

        $this->om->endFlushSuite();

        return new JsonResponse(array_map(function (Response $response) {
            return json_decode($response->getContent(), true);
        }, $responses));
    }

    /**
     * Gets a resource.
     *
     * @EXT\Route("/{id}", name="claro_resource_load_short")
     * @EXT\Route("/{type}/{id}", name="claro_resource_load")
     * @EXT\Route("/{type}/{id}/embedded/{embedded}", name="claro_resource_load_embedded")
     * @EXT\Method("GET")
     *
     * @param int|string $id       - the id of the target node (we don't use ParamConverter to support ID and UUID)
     * @param int        $embedded
     *
     * @return JsonResponse
     *
     * @throws ResourceNotFoundException
     */
    public function getAction($id, $embedded = 0)
    {
        /** @var ResourceNode $resourceNode */
        $resourceNode = $this->om->find(ResourceNode::class, $id);
        if (!$resourceNode) {
            throw new ResourceNotFoundException();
        }

        // gets the current user roles to check access restrictions
        $userRoles = $this->security->getRoles($this->tokenStorage->getToken());

        $accessErrors = $this->restrictionsManager->getErrors($resourceNode, $userRoles);
        if (empty($accessErrors) || $this->manager->isManager($resourceNode)) {
            $loaded = $this->manager->load($resourceNode, intval($embedded) ? true : false);
            if (isset($loaded['serverErrors']) && !empty($loaded['serverErrors'])) {
              return new JsonResponse($loaded['serverErrors'], 500);
            }

            return new JsonResponse(
                array_merge([
                    // append access restrictions to the loaded node
                    // if any to let know the manager that other user can not enter the resource
                    'accessErrors' => $accessErrors,
                ], $loaded)
            );
        }

        return new JsonResponse($accessErrors, 403);
    }

    /**
     * Executes an action on one resource.
     *
     * @EXT\Route("/{action}/{id}", name="claro_resource_action_short")
     * @EXT\Route("/{type}/{action}/{id}", name="claro_resource_action")
     *
     * @param string       $action
     * @param ResourceNode $resourceNode
     * @param Request      $request
     *
     * @return Response
     *
     * @throws NotFoundHttpException
     */
    public function executeAction($action, ResourceNode $resourceNode, Request $request)
    {
        // check the requested action exists
        if (!$this->actionManager->support($resourceNode, $action, $request->getMethod())) {
            // undefined action
            throw new NotFoundHttpException(
                sprintf('The action %s with method [%s] does not exist for resource type %s.', $action, $request->getMethod(), $resourceNode->getResourceType()->getName())
            );
        }

        // check current user rights
        $this->checkAccess($this->actionManager->get($resourceNode, $action), [$resourceNode]);

        // read request and get user query
        $parameters = $request->query->all();

        $content = null;

        if (!empty($request->getContent())) {
            $content = json_decode($request->getContent(), true);
        }
        $files = $request->files->all();

        // dispatch action event
        return $this->actionManager->execute($resourceNode, $action, $parameters, $content, $files);
    }

    /**
     * Checks the current user can execute the action on the requested nodes.
     *
     * @param MenuAction $action
     * @param array      $resourceNodes
     * @param array      $attributes
     */
    private function checkAccess(MenuAction $action, array $resourceNodes, array $attributes = [])
    {
        $collection = new ResourceCollection($resourceNodes);
        $collection->setAttributes($attributes);

        if (!$this->actionManager->hasPermission($action, $collection)) {
            throw new ResourceAccessException($collection->getErrorsForDisplay(), $collection->getResources());
        }
    }
}
