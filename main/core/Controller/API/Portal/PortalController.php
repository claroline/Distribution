<?php

namespace Claroline\CoreBundle\Controller\API\Portal;

use Claroline\CoreBundle\API\FinderProvider;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations\NamePrefix;
use FOS\RestBundle\Controller\FOSRestController;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\HttpFoundation\Request;

/**
 * @NamePrefix("api_")
 */
class PortalController extends FOSRestController
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
     * @Get("/resourcenode", name="get_search_resource_nodes", options={ "method_prefix" = false })
     *
     * @param Request $request
     *
     * @return array
     */
    public function getSearchResourceNodesAction(Request $request)
    {
        $options = $request->query->all();

        // Limit the search to resource nodes published to portal
        $options['filters']['publishedToPortal'] = true;

        // Limit the search to only the authorized resource types which can be displayed on the portal
        $options['filters']['resourceType'] = $this->get('claroline.manager.portal_manager')->getPortalEnabledResourceTypes();

        $result = $this->finder->search(
            'Claroline\CoreBundle\Entity\Resource\ResourceNode',
            $options
        );

        // unset filters
        foreach ($result['filters'] as $key => $value) {
            if ($value['property'] === 'publishedToPortal' || $value['property'] === 'resourceType') {
                unset($result['filters'][$key]);
            }
        }

        return $result;
    }
}
