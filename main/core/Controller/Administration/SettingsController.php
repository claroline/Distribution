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
     * @EXT\Route("/main", name="claro_admin_main_settings")
     * @EXT\Template("ClarolineCoreBundle:administration/settings:main.html.twig")
     * @SEC\PreAuthorize("canOpenAdminTool('main_settings')")
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function mainAction()
    {
        return [];
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
        return [];
    }
}
