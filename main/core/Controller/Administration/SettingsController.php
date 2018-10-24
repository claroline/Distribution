<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\Administration;

use Claroline\CoreBundle\API\Serializer\ParametersSerializer;
use Claroline\CoreBundle\Manager\LocaleManager;
use Claroline\CoreBundle\Manager\PortalManager;
use JMS\DiExtraBundle\Annotation as DI;
use JMS\SecurityExtraBundle\Annotation as SEC;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * @DI\Tag("security.secure_service")
 */
class SettingsController extends Controller
{
    /**
     * SettingsController constructor.
     *
     * @DI\InjectParams({
     *     "serializer"    = @DI\Inject("claroline.serializer.parameters"),
     *     "localeManager" = @DI\Inject("claroline.manager.locale_manager"),
     *     "portalManager" = @DI\Inject("claroline.manager.portal_manager")
     * })
     *
     * @param SettingsController $serializer
     */
    public function __construct(
        ParametersSerializer $serializer,
        LocaleManager $localeManager,
        PortalManager $portalManager
    ) {
        $this->serializer = $serializer;
        $this->localeManager = $localeManager;
        $this->portalManager = $portalManager;
    }

    /**
     * @EXT\Route("/main", name="claro_admin_main_settings")
     * @EXT\Template("ClarolineCoreBundle:administration/settings:main.html.twig")
     * @SEC\PreAuthorize("canOpenAdminTool('main_settings')")
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function mainAction()
    {
        return [
            'parameters' => $this->serializer->serialize(),
            'availablesLocales' => $this->localeManager->retrieveAvailableLocales(),
            'portalResources' => $this->portalManager->getPortalEnabledResourceTypes(),
        ];
    }

    /**
     * @EXT\Route("/technical", name="claro_admin_technical_settings")
     * @EXT\Template("ClarolineCoreBundle:administration/settings:technical.html.twig")
     * @SEC\PreAuthorize("canOpenAdminTool('technical_settings')")
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function technicalAction()
    {
        return [
          'parameters' => $this->serializer->serialize(),
        ];
    }
}
