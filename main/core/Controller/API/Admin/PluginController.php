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

use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\HttpFoundation\Request;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations\View;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CoreBundle\Manager\BundleManager;
use Nelmio\ApiDocBundle\Annotation\ApiDoc;
use FOS\RestBundle\Controller\Annotations\NamePrefix;
use FOS\RestBundle\Controller\Annotations\Post;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations\Patch;
use Claroline\CoreBundle\Entity\Plugin;

/**
 * @NamePrefix("api_")
 */
class PluginController extends FOSRestController
{
    private $request;
	private $bundleManager;

    /**
     * @DI\InjectParams({
     *     "request"       = @DI\Inject("request"),
	 *	   "bundleManager" = @DI\Inject("claroline.manager.bundle_manager")
     * })
     */
    public function __construct(Request $request, BundleManager $bundleManager)
    {
        $this->request       = $request;
		$this->bundleManager = $bundleManager;
    }

    /**
	 * @View(serializerGroups={"api_plugin"})
	 * @ApiDoc(
	 *     description="Returns the plugin list",
	 *     views = {"plugin"}
	 * )
	 */
    public function getPluginsAction()
    {
		return $this->bundleManager->getPlugins();
    }

	/**
	 * @View(serializerGroups={"api_plugin"})
	 * @ApiDoc(
	 *     description="Returns the plugin list",
	 *     views = {"plugin"}
	 * )
	 * @Patch("/plugin/{plugin}/enable")
	 */
	public function enablePluginAction(Plugin $plugin)
	{
		return $this->bundleManager->enable($plugin);
	}

	/**
	 * @View(serializerGroups={"api_plugin"})
	 * @ApiDoc(
	 *     description="Returns the plugin list",
	 *     views = {"plugin"}
	 * )
 	 * @Patch("/plugin/{plugin}/disable")
	 */
	public function disablePluginAction(Plugin $plugin)
	{
		return $this->bundleManager->disable($plugin);
	}
}
