<?php

/*
 * This file is part of the Inwicast plugin for Claroline Connect.
 *
 * (c) INWICAST <dev@inwicast.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\InwicastPluginBundle\Listener;

use Claroline\CoreBundle\Event\DisplayToolEvent;
use Claroline\CoreBundle\Event\DisplayWidgetEvent;
use Claroline\CoreBundle\Event\ConfigureWidgetEvent;
use Claroline\CoreBundle\Event\InjectJavascriptEvent;
use Claroline\CoreBundle\Listener\NoHttpRequestException;
use Claroline\CoreBundle\Event\PluginOptionsEvent;
use Doctrine\ORM\NoResultException;
use Claroline\InwicastPluginBundle\Exception\NoMediacenterException;
use Claroline\InwicastPluginBundle\Exception\NoMediacenterUserException;
use Symfony\Component\DependencyInjection\ContainerAware;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Form\Extension\Templating\TemplatingExtension;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\TwigBundle\TwigEngine;
use JMS\DiExtraBundle\Annotation as DI;
use Claroline\InwicastPluginBundle\Entity\Media;
use Claroline\InwicastPluginBundle\Entity\MediacenterUser;
use Claroline\InwicastPluginBundle\Entity\Mediacenter;
use Doctrine\ORM\EntityManager;
use Symfony\Component\Security\Core\SecurityContext;

/**
 * @DI\Service
 */
class ClarolinePluginListener extends ContainerAware
{
    private $templating;

    //-------------------------------
    // PLUGIN GENERAL SETTINGS
    //-------------------------------

    /**
     * @DI\Observe("inject_javascript_layout")
     *
     * @param InjectJavascriptEvent $event
     * @return string
     */
    public function onInjectJs(InjectJavascriptEvent $event)
    {
        $content = $this->templating->render(
            'ClarolineInwicastPluginBundle:Inwicast:javascript_layout.html.twig',
            array()
        );

        $event->addContent($content);
    }

    /**
     * @DI\InjectParams({
     *      "container"             = @DI\Inject("service_container")
     * })
     */
    public function __construct(
        ContainerInterface $container
    ) {
        $this->setContainer($container);
        $this->templating = $container->get('templating');
    }

    //-------------------------------
    // WIDGET SERVICES
    //-------------------------------

    /**
     * @DI\Observe("widget_inwicast_claroline_plugin")
     *
     * @param DisplayWidgetEvent $event
     */
    public function onDisplay(DisplayWidgetEvent $event)
    {
        // Get the Media entity from event
        $widgetInstance = $event->getInstance();
        $mediaManager = $this->getMediaManager();
        $media = $mediaManager->getByWidget($widgetInstance);
        if (!empty($media)) {
            try {
                $mediacenter = $this->getMediacenterManager()->getMediacenter();
                //$loggedUser = $this->container->get("security.context")->getToken()->getUser();
                //$media = $mediaManager->getMediaInfo($media, $mediacenter, $loggedUser);
                // Get video player
                $event->setContent(
                    $this->templating->render(
                        'ClarolineInwicastPluginBundle:Media:view.html.twig',
                        array('media' => $media, 'mediacenter' => $mediacenter)
                    )
                );
            } catch(NoMediacenterException $nme) {
                $event->setContent(
                    $this->templating->render(
                        'ClarolineInwicastPluginBundle:Mediacenter:error.html.twig'
                    )
                );
            }
        } else {
            $event->setContent(
                $this->templating->render(
                    'ClarolineInwicastPluginBundle:Media:noMedia.html.twig'
                )
            );
        }

        $event->stopPropagation();
    }

    /**
     * @DI\Observe("widget_inwicast_claroline_plugin_configuration")
     */
    public function onConfigure(ConfigureWidgetEvent $event)
    {
        // Get widget instance
        $widgetInstance = $event->getInstance();
        // Get mediacenter user from database
        $loggedUser = $this->container->get("security.context")->getToken()->getUser();
        try {
            $mediacenter = $this->getMediacenterManager()->getMediacenter();
            $mediaManager = $this->getMediaManager();
            $medialist = $mediaManager->getMediaListForUser($loggedUser, $mediacenter);
            // Return form
            $content = $this->templating->render(
                'ClarolineInwicastPluginBundle:Media:videosList.html.twig',
                array(
                    'medialist'     => $medialist,
                    'widget'        => $widgetInstance,
                    'username'      => $loggedUser->getUsername(),
                    'mediacenter'   => $mediacenter
                )
            );
        } catch (NoMediacenterException $nme) {
            $content = $this->templating->render('ClarolineInwicastPluginBundle:Mediacenter:error.html.twig');
        }

        // Return view to event (Claroline specification)
        $event->setContent($content);
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("open_tool_desktop_inwicast_portal")
     */
    public function onToolOpen(DisplayToolEvent $event)
    {
        // Get mediacenter user from database
        $loggedUser = $this->container->get("security.context")->getToken()->getUser();
        try {
            $mediacenter = $this->getMediacenterManager()->getMediacenter();
            $mediacenterUserManager = $this->getMediacenterUserManager();
            $token = $mediacenterUserManager->getMediacenterUserToken($loggedUser, $mediacenter);
            $mediacener_portal = $mediacenter->getUrl()."?userName=".$loggedUser->getUsername()."&token=".$token;
            $content = new RedirectResponse($mediacener_portal);
        } catch (NoMediacenterException $nme) {
            $content = $this->templating->render('ClarolineInwicastPluginBundle:Mediacenter:error.html.twig');
        }

        // Return view to event (Claroline specification)
        $event->setContent($content);
        $event->stopPropagation();
    }

    /**
     * @return \Claroline\InwicastPluginBundle\Manager\MediacenterManager
     */
    private function getMediacenterManager()
    {
        return $this->container->get("inwicast.plugin.manager.mediacenter");
    }

    /**
     * @return \Claroline\InwicastPluginBundle\Manager\MediacenterUserManager
     */
    private function getMediacenterUserManager()
    {
        return $this->container->get("inwicast.plugin.manager.mediacenteruser");
    }

    /**
     * @return \Claroline\InwicastPluginBundle\Manager\MediaManager
     */
    private function getMediaManager()
    {
        return $this->container->get("inwicast.plugin.manager.media");
    }
}
