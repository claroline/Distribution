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
use Claroline\CoreBundle\Event\CreateFormResourceEvent;
use Claroline\CoreBundle\Event\OpenResourceEvent;
use Claroline\CoreBundle\Event\DownloadResourceEvent;
use Claroline\CoreBundle\Event\CopyResourceEvent;
use Claroline\CoreBundle\Event\CreateResourceEvent;
use Claroline\CoreBundle\Event\DeleteResourceEvent;
use Claroline\CoreBundle\Listener\NoHttpRequestException;
use Claroline\CoreBundle\Event\PluginOptionsEvent;
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
class ClarolinePluginListener
{
    private $templating;
    private $em;
    private $sc;
    private $mediaUser;
    private $media;
    private $mediacenter;

    /**
     * @DI\InjectParams({
     *      "templating" = @DI\Inject("templating"),
     *      "em" = @DI\Inject("doctrine.orm.entity_manager"),
     *      "sc" = @DI\Inject("security.context")
     * })
     */
    public function __construct(TwigEngine $templating, EntityManager $em, SecurityContext $sc)
    {
        $this->templating = $templating;
        $this->em = $em;
        $this->sc = $sc;
        $this->mediaUser = new MediacenterUser();
        $this->media = new Media();
        $this->mediacenter = new Mediacenter();
        $this->mediacenter = $this->em
                                  ->getRepository('InwicastClarolinePluginBundle:Mediacenter')
                                  ->findAll();
        if(sizeof($this->mediacenter) == 0)
        {
            $this->mediacenter = new Mediacenter();
        }
        else
        {
            $this->mediacenter = $this->mediacenter[0];
        }
    }

    //-------------------------------
    // PLUGIN GENERAL SETTINGS
    //-------------------------------

    /**
     * @DI\Observe("plugin_options_inwicastclarolineplugin")
     */
    public function onPluginConfigure(PluginOptionsEvent $event)
    {
        // Display form
        $event->setResponse(new Response($this->templating->render('InwicastClarolinePluginBundle::formWidget.html.twig', array('mediacenter' => $this->mediacenter, 'error' => null))));
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
        $media = $this->em
                      ->getRepository('InwicastClarolinePluginBundle:Media')
                      ->findByWidget($widgetInstance);

        if(!empty($media))
        {        
        	// Get video player
            $event->setContent($this->templating->render('InwicastClarolinePluginBundle::plugin.html.twig', array('media' => $media, 'mediacenter' => $this->mediacenter)));
        }
        else
        {
            $event->setContent('');
        }
        
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("widget_inwicast_claroline_plugin_configuration")
     */
    public function onConfigure(ConfigureWidgetEvent $event)
    {
        $error = null;

        // Mediacenter set
        if($this->mediacenter->getUrl() != null)
        {
            // Get widget instance
            $widgetInstance = $event->getInstance();

            // Get mediacenter user from database
            $this->mediaUser = $this->em
                                    ->getRepository('InwicastClarolinePluginBundle:MediacenterUser')
                                    ->findOneBy(array('user' => $this->sc->getToken()->getUser()));

            // 1st case: mediacenter account not linked to Claroline account
            if($this->mediaUser === null)
            {
                // Display login form
                $this->mediaUser = new MediacenterUser();
                $this->mediaUser->setUser($this->sc->getToken()->getUser());
                $error = array('type' => 'warning', 'title' => 'warning', 'content' => 'not_linked_mediacenter');
                $content = $this->templating->render('InwicastClarolinePluginBundle::login.html.twig', array('mediacenter' => $this->mediacenter, 'error' => $error, 'widget' => $widgetInstance));
            }
            // 2nd case: mediacenter account linked to Claroline account
            else
            {
                // Get media list with XMLRPC
                // XMLRPC request creation (PHP variables -> XML)
                $xmlrpcRequest = xmlrpc_encode_request('inwicast.getMediaList', array($this->mediaUser->getUsername(), '', ''));
                // Init data stream
                $context = stream_context_create(array('http' => array(
                    'method' => 'POST',
                    'header' => 'Content-Type: text/xml',
                    'content' => $xmlrpcRequest
                )));
                // Ask mediacenter server
                $file = file_get_contents($this->mediacenter->getUrl() . 'xmlrpc/index.php', false, $context);
                // Decoding answer (XML -> PHP variables)
                $response = xmlrpc_decode($file);
                // Check syntax errors in returned answer
                if ($response && xmlrpc_is_fault($response))
                {
                    $error = array('type' => 'danger', 'title' => 'error', 'content' => 'error_get_medialist');
                } 
                else 
                {
                    // Returned value structure:
                    // - media_ref: video ID
                    // - media_type: how the video comes
                    // - title
                    // - description
                    // - media_date: date of adding video
                    // - preview_url: video preview image
                    // - width: player width
                    // - height: player height

                    foreach ($response as $resMedia) {
                        $medialist[] = new Media(
                            $resMedia['media_ref'], 
                            $resMedia['title'], 
                            $resMedia['description'], 
                            date_create_from_format('!d#m#Y', $resMedia['media_date']), 
                            $resMedia['preview_url'], 
                            $resMedia['width'],
                            $resMedia['height']
                            );
                    }

                    if(empty($medialist))   // Case: empty mediacenter
                    {
                        $error = array('type' => 'danger', 'title' => 'error', 'content' => 'error_empty_mediacenter');
                    }

                }

                // Return form
                $content = $this->templating->render('InwicastClarolinePluginBundle::formPlugin.html.twig', array('medialist' => $medialist, 'error' => $error, 'widget' => $widgetInstance, 'username' => $this->mediaUser->getUsername()));
            }
        }
        // Mediacenter not set
        else
        {
            $error = array('type' => 'danger', 'title' => 'error', 'content' => 'no_mediacenter');
            $content = $this->templating->render('InwicastClarolinePluginBundle::error.html.twig', array('error' => $error));
        }

        // Return view to event (Claroline specification)
        $event->setContent($content);
    }

    //-------------------------------
    // RESOURCE SERVICES
    //-------------------------------

    /**
     * @DI\Observe("create_form_inwicast_media")
     *
     * @param CreateFormResourceEvent $event
     */
    public function onCreateForm(CreateFormResourceEvent $event)
    {
        $error = null;

        // Mediacenter set
        if($this->mediacenter->getUrl() != null)
        {
            // Get mediacenter user from database
            $this->mediaUser = $this->em
                                    ->getRepository('InwicastClarolinePluginBundle:MediacenterUser')
                                    ->findOneBy(array('user' => $this->sc->getToken()->getUser()));

            // 1st case: mediacenter account not linked to Claroline account
            if($this->mediaUser === null)
            {
                // Display login form
                $this->mediaUser = new MediacenterUser();
                $this->mediaUser->setUser($this->sc->getToken()->getUser());
                $error = array('type' => 'warning', 'title' => 'warning', 'content' => 'not_linked_mediacenter');
                $content = $this->templating->render('InwicastClarolinePluginBundle::resourceLogin.html.twig', array('mediacenter' => $this->mediacenter, 'resourceType' => 'inwicast_media', 'error' => $error, 'widget' => $widgetInstance));
            }
            else
            {
                $content = $this->templating->render('InwicastClarolinePluginBundle::resourceConfirm.html.twig', array('mediacenter' => $this->mediacenter, 'resourceType' => 'inwicast_media', 'error' => $error, 'widget' => $widgetInstance));
            }
        }
        // Mediacenter not set
        else
        {
            $error = array('type' => 'danger', 'title' => 'error', 'content' => 'no_mediacenter');
            $content = $this->templating->render('InwicastClarolinePluginBundle::error.html.twig', array('error' => $error));
        }

        $event->setResponseContent($content);
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("create_file")
     *
     * @param CreateResourceEvent $event
     */
    public function onCreate(CreateResourceEvent $event)
    {
        $request = $this->container->get('request');

        if($this->mediacenter->getUrl() != null)
        {

            if($this->mediaUser === null)
            {
                // TODO: Check username/password on mediacenter
                    
                if(true) // Login successful: link accounts
                {
                    // Create mediaUser object
                    $mediaUser = new MediacenterUser($request->request->get('inwicast_widget_username'), $this->getUser());

                    // Persist in database
                    $this->em->persist($mediaUser);
                    $this->em->flush();

                    // DO NOT GO TO PART 3!
                    $part3 = false;
                }
                else // Login failure
                {
                    $error = array('type' => 'danger', 'title' => 'error', 'content' => 'login_failure');
                    $content = $this->templating->render('InwicastClarolinePluginBundle::login.html.twig', array('mediacenter' => $this->mediacenter, 'resourceType' => 'inwicast_media', 'error' => $error, 'widget' => $widgetInstance));
                    $event->setErrorFormContent($content);
                }
            }
            // 2nd case: mediacenter account linked to Claroline account
            else
            {
                // Get media list with XMLRPC
                // XMLRPC request creation (PHP variables -> XML)
                $xmlrpcRequest = xmlrpc_encode_request('inwicast.getMediaList', array($this->mediaUser->getUsername(), '', ''));
                // Init data stream
                $context = stream_context_create(array('http' => array(
                    'method' => 'POST',
                    'header' => 'Content-Type: text/xml',
                    'content' => $xmlrpcRequest
                )));
                // Ask mediacenter server
                $file = file_get_contents($this->mediacenter->getUrl() . 'xmlrpc/index.php', false, $context);
                // Decoding answer (XML -> PHP variables)
                $response = xmlrpc_decode($file);
                // Check syntax errors in returned answer
                if ($response && xmlrpc_is_fault($response))
                {
                    $error = array('type' => 'danger', 'title' => 'error', 'content' => 'error_get_medialist'); 
                    $content = $this->templating->render('InwicastClarolinePluginBundle::error.html.twig', array('error' => $error));
                    $event->setErrorFormContent($content);
                } 
                else 
                {
                    // Returned value structure:
                    // - media_ref: video ID
                    // - media_type: how the video comes
                    // - title
                    // - description
                    // - media_date: date of adding video
                    // - preview_url: video preview image
                    // - width: player width
                    // - height: player height

                    foreach ($response as $resMedia) {
                        $medialist[] = new Media(
                            $resMedia['media_ref'], 
                            $resMedia['title'], 
                            $resMedia['description'], 
                            date_create_from_format('!d#m#Y', $resMedia['media_date']), 
                            $resMedia['preview_url'], 
                            $resMedia['width'],
                            $resMedia['height']
                            );
                    }

                    if(empty($medialist))   // Case: empty mediacenter
                    {
                        $error = array('type' => 'danger', 'title' => 'error', 'content' => 'error_empty_mediacenter');
                        $content = $this->templating->render('InwicastClarolinePluginBundle::error.html.twig', array('error' => $error));
                        $event->setErrorFormContent($content);
                    }
                    else
                    {
                        // Add in database
                        foreach($medialist as $media)
                        {
                            $this->em->persist($media);
                        }
                        $this->em->flush();
                        $event->setResources($medialist);
                    }

                }
            }
        }
        // Mediacenter not set
        else
        {
            $error = array('type' => 'danger', 'title' => 'error', 'content' => 'no_mediacenter');
            $content = $this->templating->render('InwicastClarolinePluginBundle::error.html.twig', array('error' => $error));
            $event->setErrorFormContent($content);
        }

        $event->stopPropagation();
    }

    /**
     * @DI\Observe("open_inwicast_media")
     *
     * @param OpenResourceEvent $event
     */
    public function onOpen(OpenResourceEvent $event)
    {
        // Get the Media entity from event
        $media = $event->getResource();

        if(!empty($media))
        {        
            // Get video player
            $event->setReponse(new Response($this->templating->render('InwicastClarolinePluginBundle::plugin.html.twig', array('media' => $media, 'mediacenter' => $this->mediacenter))));
        }
        else
        {
            $event->setReponse(new Response(''));
        }
        
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("download_inwicast_media")
     *
     * @param DownloadResourceEvent $event
     */
    public function onDownload(DownloadResourceEvent $event)
    {
        $media = $event->getResource();
        $event->setItem($this->mediacenter . 'videos/' . $media->getCode() . '/multimedia/' . $media->getCode() . '.mp4');
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("copy_file")
     *
     * @param CopyResourceEvent $event
     */
    public function onCopy(CopyResourceEvent $event)
    {
        $event->stopPropagation();
    }
}