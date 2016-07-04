<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\API\Admin;

use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use FOS\RestBundle\Controller\Annotations\NamePrefix;
use FOS\RestBundle\Controller\Annotations\View;
use FOS\RestBundle\Controller\FOSRestController;
use JMS\DiExtraBundle\Annotation as DI;
use JMS\SecurityExtraBundle\Annotation as SEC;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use Symfony\Component\HttpFoundation\Request;

/**
 * @NamePrefix("api_")
 * @SEC\PreAuthorize("canOpenAdminTool('platform_parameters')")
 */
class ParametersController extends FOSRestController
{
    private $request;

    /**
     * @DI\InjectParams({
     *     "request" = @DI\Inject("request"),
     *     "ch"      = @DI\Inject("claroline.config.platform_config_handler")
     * })
     */
    public function __construct(Request $request, PlatformConfigurationHandler $ch)
    {
        $this->request = $request;
        $this->ch = $ch;
    }

    /**
     * @View()
     * @ApiDoc(
     *     description="Update/Add a parameters in the platform_options.yml file",
     *     views = {"parameters"},
     *     parameters={
     *          {"name"="parameter_name", "dataType"="any", "required"=true ,"description"="The parameter_name is the parameter you want to change"}
     *     }
     * )
     */
    public function postParametersAction()
    {
        $data = $this->request->request;

        foreach ($data as $parameter => $value) {
            $this->ch->setParameter($parameter, $value);
        }

        return $data;
    }
}
