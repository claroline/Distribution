<?php

/*
 * This file is part of the Inwicast plugin for Claroline Connect.
 *
 * (c) INWICAST <dev@inwicast.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Inwicast\ClarolinePluginBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Inwicast\ClarolinePluginBundle\Entity\Media;
use Inwicast\ClarolinePluginBundle\Entity\MediacenterUser;
use Inwicast\ClarolinePluginBundle\Entity\Mediacenter;
use Claroline\CoreBundle\Entity\Widget\WidgetInstance;

class ClarolinePluginController extends Controller
{
	public function displayFormAction(WidgetInstance $widget)
	{
		if (!$this->get('security.context')->isGranted('edit', $widget)) 
		{
            throw new AccessDeniedException();
        }

		//----------------------------------------------------
		// INITS
		//----------------------------------------------------

		// Mediacenter parameters
		$mediacenter = $this->getDoctrine()
                            ->getManager()
                            ->getRepository('InwicastClarolinePluginBundle:Mediacenter')
                            ->findAll();

        if(sizeof($mediacenter) == 0)
        {
            $error = array('type' => 'danger', 'title' => 'error', 'content' => 'no_mediacenter');
			return $this->render('InwicastClarolinePluginBundle::error.html.twig', array('error' => $error));
        }
        else
        {
            $mediacenter = $mediacenter[0];
        }

		// Mediacenter user's username
		$mediaUser = new MediacenterUser();
		$mediaUser = $this->getDoctrine()
                          ->getManager()
                          ->getRepository('InwicastClarolinePluginBundle:MediacenterUser')
                          ->findOneBy(array('user' => $this->getUser()));

		// Medias list
		$medialist = array();

		// Media IDs list
		$idslist = array();

		// Error variable
		$error = null;

		// Flag for part 3
		$part3 = true;


		//----------------------------------------------------
		// PART 1: Get user token login for mediacenter
		//----------------------------------------------------

		// Get the request
		$request = $this->get('request');

		if($mediaUser === null) // User not logged in mediacenter
		{
			// Request method is POST: user has filled the form
			if ($request->getMethod() == 'POST') 
			{
				// TODO: Check username/password on mediacenter
				
				if(true) // Login successful: link accounts
				{
					// Create mediaUser object
					$mediaUser = new MediacenterUser($request->request->get('inwicast_widget_username'), $this->getUser());

					// Persist in database
					$em = $this->getDoctrine()->getManager();
					$em->persist($mediaUser);
					$em->flush();

					// DO NOT GO TO PART 3!
					$part3 = false;
				}
				else // Login failure
				{
					$error = array('type' => 'danger', 'title' => 'error', 'content' => 'login_failure');
					return $this->render('InwicastClarolinePluginBundle::login.html.twig', array('mediacenter' => $mediacenter, 'error' => $error, 'widget' => $widget));
				}
			}
			else // First access to form
			{
				$error = array('type' => 'warning', 'title' => 'warning', 'content' => 'not_linked_mediacenter');
				return $this->render('InwicastClarolinePluginBundle::login.html.twig', array('mediacenter' => $mediacenter, 'error' => $error, 'widget' => $widget));
			}
		}

		//----------------------------------------------------
		// PART 2: Display Inwicast Mediacenter file selector
		//----------------------------------------------------
		
		// Get media list with XMLRPC
		// XMLRPC request creation (PHP variables -> XML)
		$xmlrpcRequest = xmlrpc_encode_request('inwicast.getMediaList', array($mediaUser->getUsername(), '', ''));
		// Init data stream
		$context = stream_context_create(array('http' => array(
		    'method' => 'POST',
		    'header' => 'Content-Type: text/xml',
		    'content' => $xmlrpcRequest
		)));
		// Ask mediacenter server
		$file = file_get_contents($mediacenter->getUrl() . 'xmlrpc/index.php', false, $context);
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

                    $idslist[] = $resMedia['media_ref'];
		    }

		    // Case: empty mediacenter
		    if(empty($medialist))
		    {
		    	$error = array('type' => 'danger', 'title' => 'error', 'content' => 'error_empty_mediacenter');
		    }
		}

		//----------------------------------------------------
		// PART 3: Verify sent values
		//----------------------------------------------------

		// Request method is POST: user has filled the form
		if ($part3 && $request->getMethod() == 'POST') 
		{
			// Check if given ID is defined in IDs list, and returns its index
			$array = array_keys($idslist, $request->request->get('inwicast_widget_video'));
			if(!empty($array))
			{
				// Delete previous media
				$previousMedia = $this->getDoctrine()
                        			  ->getManager()
				                      ->getRepository('InwicastClarolinePluginBundle:Media')
				                      ->findOneByWidgetInstance($widget);

		        if(!empty($previousMedia))
		        {        
		        	$em = $this->getDoctrine()->getManager();
		        	$em->remove($previousMedia);
		        	$em->flush();
		        }

				// Get chosen media
				$media = $medialist[$array[0]];
				// Set widget to entity
				$media->setWidgetInstance($widget);

				// Persist in database
				$em = $this->getDoctrine()->getManager();
				$em->persist($media);
				$em->flush();

				// Return 204 (Claroline specification)
				return new Response('', 204);
			}
			else
			{
				// Unknown ID: return error
				$error = array('type' => 'danger', 'title' => 'error', 'content' => 'error_loading_media');
			}
		}

		// If controller comes here:
		// - Request was GET: first access to form
		// - Request was POST: values entered contain errors

		return $this->render('InwicastClarolinePluginBundle::formPlugin.html.twig', array('medialist' => $medialist, 'error' => $error, 'widget' => $widget, 'username' => $mediaUser->getUsername()));
	}

	public function changeMediacenterAction()
	{
		// All data send by user via form
		$request = $this->get('request');

		// Init mediacenter
		$mediacenter = $this->getDoctrine()
                            ->getManager()
                            ->getRepository('InwicastClarolinePluginBundle:Mediacenter')
                            ->findAll();

		if(sizeof($mediacenter) == 0)
        {
            $mediacenter = new Mediacenter;
        }
        else
        {
            $mediacenter = $mediacenter[0];
        }

		// Verify sent URL
		$url = $request->request->get('inwicast_mediacenter_url');
		// Invalid URL
		if(!filter_var($url, FILTER_VALIDATE_URL, FILTER_FLAG_HOST_REQUIRED))
		{
			$error = array('type' => 'danger', 'title' => 'error', 'content' => 'error_bad_url');
			return $this->render('InwicastClarolinePluginBundle::formWidget.html.twig', array('mediacenter' => $mediacenter, 'error' => $error));
		}

		// Valid URL: persist in database
        $mediacenter->setUrl($url);
        $em = $this->getDoctrine()->getManager();
        $em->persist($mediacenter);
        $em->flush();

        // Tell user all is OK!
        return $this->render('InwicastClarolinePluginBundle::configDone.html.twig');
	}

	public function imageAction($width, $height)
	{
		// Get the size of final picture
		$pgcd = gmp_intval(gmp_gcd($width, $height));
		$width /= $pgcd;
		$height /= $pgcd; 

		// Init image
		$im = imagecreatetruecolor($width, $height);

		// Set black color
		$black = imagecolorallocate($im, 0, 0, 0);

		// Make the background transparent
		imagecolortransparent($im, $black);

		// Start buffering
		ob_start();

		// Display image
		imagegif($im);

		// Get buffer content
		$image = base64_encode(ob_get_contents());

		// Destroy image
		imagedestroy($im);

		// Stop buffering
		ob_get_clean();

		// Create response
		$response = new Response();
		$response->headers->set('Content-Type', 'image/gif');
		$response->setContent($image);
		return $response;
	}

	public function searchMediasAction($value)
	{
		// Mediacenter parameters
		$mediacenter = $this->getDoctrine()
                            ->getManager()
                            ->getRepository('InwicastClarolinePluginBundle:Mediacenter')
                            ->findAll();

        $mediacenter = $mediacenter[0];

		// Mediacenter user's username
		$mediaUser = new MediacenterUser();
		$mediaUser = $this->getDoctrine()
                          ->getManager()
                          ->getRepository('InwicastClarolinePluginBundle:MediacenterUser')
                          ->findOneBy(array('user' => $this->getUser()));

        $idslist = array();

		// Get media list with XMLRPC
		// XMLRPC request creation (PHP variables -> XML)
		$xmlrpcRequest = xmlrpc_encode_request('inwicast.getMediaList', array($mediaUser->getUsername(), "(title LIKE '%". $value ."%' OR description LIKE '%". $value ."%' OR tags LIKE '%". $value ."%'  OR author LIKE '%". $value ."%')", ''));
		// Init data stream
		$context = stream_context_create(array('http' => array(
		    'method' => 'POST',
		    'header' => 'Content-Type: text/xml',
		    'content' => $xmlrpcRequest
		)));
		// Ask mediacenter server
		$file = file_get_contents($mediacenter->getUrl() . 'xmlrpc/index.php', false, $context);
		// Decoding answer (XML -> PHP variables)
		$response = xmlrpc_decode($file);
		// Check syntax errors in returned answer
		if ($response && xmlrpc_is_fault($response))
		{
		    return new Response('error_get_medialist : search for '.$value.' in mediacenter '.$mediacenter->getUrl().' with username '.$mediaUser->getUsername().'.<br />'.$response['faultString'].' '.$response['faultCode'], 400);
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
                $idslist[] = $resMedia['media_ref'];
		    }
		}

	    $response = new JsonResponse();
		$response->setData($idslist);
		return $response;
	}
}