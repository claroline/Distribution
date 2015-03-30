<?php

/*
 * This file is part of the Inwicast plugin for Claroline Connect.
 *
 * (c) INWICAST <dev@inwicast.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Inwicast\ClarolinePluginBundle\Listener;

use Claroline\CoreBundle\Event\DisplayWidgetEvent;
use Claroline\CoreBundle\Event\ConfigureWidgetEvent;
use Claroline\CoreBundle\Listener\NoHttpRequestException;
use Claroline\CoreBundle\Event\PluginOptionsEvent;
use Doctrine\ORM\NoResultException;
use Inwicast\ClarolinePluginBundle\Exception\NoMediacenterException;
use Inwicast\ClarolinePluginBundle\Exception\NoMediacenterUserException;
use Symfony\Component\DependencyInjection\ContainerAware;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\TwigBundle\TwigEngine;
use JMS\DiExtraBundle\Annotation as DI;
use Inwicast\ClarolinePluginBundle\Entity\Media;
use Inwicast\ClarolinePluginBundle\Entity\MediacenterUser;
use Inwicast\ClarolinePluginBundle\Entity\Mediacenter;
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

    /**
     * @DI\Observe("plugin_options_inwicastclarolineplugin")
     */
    public function onPluginConfigure(PluginOptionsEvent $event)
    {
        $mediacenterManager = $this->getMediacenterManager();
        $form = $mediacenterManager->getMediacenterForm();
        $content = $this->templating->render(
            'InwicastClarolinePluginBundle:Mediacenter:form.html.twig',
            array(
                'form' => $form->createView()
            )
        );

        $event->setResponse(new Response($content));
        $event->stopPropagation();
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
                        'InwicastClarolinePluginBundle:Media:view.html.twig',
                        array('media' => $media, 'mediacenter' => $mediacenter)
                    )
                );
            } catch(NoMediacenterException $nme) {
                $event->setContent(
                    $this->templating->render(
                        'InwicastClarolinePluginBundle:Mediacenter:error.html.twig'
                    )
                );
            }
        } else {
            $event->setContent(
                $this->templating->render(
                    'InwicastClarolinePluginBundle:Media:noMedia.html.twig'
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
                'InwicastClarolinePluginBundle:Media:videosList.html.twig',
                array(
                    'medialist'     => $medialist,
                    'widget'        => $widgetInstance,
                    'username'      => $loggedUser->getUsername(),
                    'mediacenter'   => $mediacenter
                )
            );
        } catch (NoMediacenterException $nme) {
            $content = $this->templating->render('InwicastClarolinePluginBundle:Mediacenter:error.html.twig');
        }

        // Return view to event (Claroline specification)
        $event->setContent($content);
    }

    private function getMediacenterManager()
    {
        return $this->container->get("inwicast.plugin.manager.mediacenter");
    }

    private function getMediaManager()
    {
        return $this->container->get("inwicast.plugin.manager.media");
    }
}