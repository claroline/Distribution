<?php

namespace Claroline\CoreBundle\Controller\APINew\Resource;

use Claroline\CoreBundle\API\FinderProvider;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations\NamePrefix;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\HttpFoundation\Request;

class PortalController
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
     * @Get("/portal", name="apiv2_portal_index", options={ "method_prefix" = false })
     *
     * @param Request $request
     *
     * @return array
     */
    public function indexAction(Request $request)
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
        //TODO: this workaround will be avoidable after the merge of #2901 by using the hiddenFilters key in $options to to hide the filters in the client.
        foreach ($result['filters'] as $key => $value) {
            if ($value['property'] === 'publishedToPortal' || $value['property'] === 'resourceType') {
                unset($result['filters'][$key]);
            }
        }

        return $result;
    }
}
