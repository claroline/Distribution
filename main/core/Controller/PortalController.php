<?php
/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * Author: Panagiotis TSAVDARIS
 *
 * Date: 5/23/16
 */

namespace Claroline\CoreBundle\Controller;

use Claroline\AppBundle\API\FinderProvider;
use JMS\DiExtraBundle\Annotation as DI;
use JMS\Serializer\SerializerBuilder;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class PortalController extends Controller
{
    /** @var FinderProvider */
    private $finder;

    /**
     * PortalController constructor.
     *
     * @DI\InjectParams({
     *     "finder" = @DI\Inject("claroline.api.finder")
     * })
     *
     * @param FinderProvider $finder
     */
    public function __construct(FinderProvider $finder)
    {
        $this->finder = $finder;
    }

    /**
     * @EXT\Route("/", name="claro_portal_index")
     * @EXT\Route("/{path}", name="claro_portal_index_2", requirements={"path" = "^((?!api).)*$"})
     * @EXT\Method({"GET", "HEAD"})
     * @EXT\Template("ClarolineCoreBundle:portal:index.html.twig")
     */
    public function indexAction()
    {
        return [
            'resources' => $this->finder->search('Claroline\CoreBundle\Entity\Resource\ResourceNode', [
                'limit' => 20,
                'hiddenFilters' => [
                    'published' => true,
                    // Limit the search to resource nodes published to portal
                    'publishedToPortal' => true,
                    // Limit the search to only the authorized resource types which can be displayed on the portal
                    'resourceType' => $this->get('claroline.manager.portal_manager')->getPortalEnabledResourceTypes(),
                ],
                'sortBy' => 'name',
            ]),
        ];
    }

    /**
     * @EXT\Route("/api/index", name="claro_portal_api_get", options = { "expose" = true })
     * @EXT\Method({"GET", "HEAD"})
     *
     * @deprecated this will no longer work when JMS will be deleted
     */
    public function getPortalAction()
    {
        $resources = $this->get('claroline.manager.portal_manager')->getLastPublishedResourcesForEnabledTypes();

        return $this->jsonResponse($resources);
    }

    /**
     * @EXT\Route(
     *     "/api/search/{resourceType}",
     *     name="claro_portal_api_search",
     *     defaults={"resourceType" = "all"},
     *     options = { "expose" = true }
     * )
     * @EXT\Method({"GET", "POST"})
     *
     * @param Request $request
     * @param $resourceType
     *
     * @return array
     *
     * @deprecated this will no longer work when JMS will be deleted
     */
    public function searchPortalAction(Request $request, $resourceType)
    {
        $portalManager = $this->get('claroline.manager.portal_manager');
        $query = $request->get('query', '');
        $page = $request->get('page', 1);
        $paginatedCollection = $portalManager->searchResourcesByType($query, $page, $resourceType);

        return $this->jsonResponse($paginatedCollection);
    }

    private function jsonResponse($data)
    {
        $serializer = SerializerBuilder::create()->build();
        $jsonData = $serializer->serialize($data, 'json');
        $response = new Response($jsonData);
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }
}
