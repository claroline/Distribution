<?php

namespace Innova\MediaResourceBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Innova\MediaResourceBundle\Entity\MediaResource;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Innova\MediaResourceBundle\Form\Type\OptionsType;
use Innova\MediaResourceBundle\Entity\Options;

/**
 * Class MediaResourceController.
 *
 * @Route("workspaces/{workspaceId}")
 * @ParamConverter("workspace", class="ClarolineCoreBundle:Workspace\Workspace", options={"mapping": {"workspaceId": "id"}})
 */
class MediaResourceController extends Controller
{
    /**
     * display a media resource.
     *
     * @Route("/view/{id}", requirements={"id" = "\d+"}, name="innova_media_resource_open")
     * @Method("GET")
     * @ParamConverter("MediaResource", class="InnovaMediaResourceBundle:MediaResource")
     */
    public function openAction(Workspace $workspace, MediaResource $mr)
    {
        if (false === $this->container->get('security.context')->isGranted('OPEN', $mr->getResourceNode())) {
            throw new AccessDeniedException();
        }
        // use of specific method to order regions correctly
        $regions = $this->get('innova_media_resource.manager.media_resource_region')->findByAndOrder($mr);
        // get options
        $options = $mr->getOptions();

        return $this->render('InnovaMediaResourceBundle:MediaResource:player.wrapper.html.twig', [
                  '_resource' => $mr,
                  'regions' => $regions,
                  'workspace' => $workspace,
                  'mode' => $options->getMode(),
              ]
      );
    }

    /**
     * administrate a media resource.
     *
     * @Route("/mr/edit/{id}", requirements={"id" = "\d+"}, name="innova_media_resource_administrate")
     * @Method("GET")
     * @ParamConverter("MediaResource", class="InnovaMediaResourceBundle:MediaResource")
     */
    public function administrateAction(Workspace $workspace, MediaResource $mr)
    {
        if (false === $this->container->get('security.context')->isGranted('ADMINISTRATE', $mr->getResourceNode())) {
            throw new AccessDeniedException();
        }

        // use of specific method to order regions correctly
        $regions = $this->get('innova_media_resource.manager.media_resource_region')->findByAndOrder($mr);
        $options = $mr->getOptions();
        // MediaResource Options form
        $form = $this->container->get('form.factory')->create(new OptionsType(), $options);

        return $this->render('InnovaMediaResourceBundle:MediaResource:administrate.html.twig', [
                    '_resource' => $mr,
                    'regions' => $regions,
                    'workspace' => $workspace,
                    'form' => $form->createView(),
          ]
        );
    }

    /**
     * All in one save action, save regions and ressource options
     * !Only regions use a FormType.
     *
     * @Route("/save/{id}", requirements={"id" = "\d+"}, name="media_resource_save")
     * @Method({"POST"})
     */
    public function save(Workspace $workspace, MediaResource $resource)
    {
        $flashMessageType = 'success';
        $msg = $this->get('translator')->trans('resource_update_success', [], 'media_resource');
        // handle options for the resource
        $form = $this->container->get('form.factory')->create(new OptionsType(), $resource->getOptions());
        // Try to process form
        $request = $this->container->get('request');
        $form->handleRequest($request);
        $error = false;

        // handle options for the resource
        if ($form->isValid()) {
            $options = $form->getData();
            $resource->setOptions($options);
            $resource = $this->get('innova_media_resource.manager.media_resource')->persist($resource);
        } else {
            $error = true;
        }
        // handle regions data
        $data = $request->request->all();

        $regionManager = $this->get('innova_media_resource.manager.media_resource_region');
        if (!$regionManager->handleMediaResourceRegions($resource, $data)) {
            $error = true;
        }

        if ($error) {
            $msg = $this->get('translator')->trans('resource_update_error', [], 'media_resource');
            $flashMessageType = 'error';
        }

        $this->get('session')->getFlashBag()->add($flashMessageType, $msg);
        // redirect instead of render to avoid form (re)submition on F5
        return $this->redirectToRoute('innova_media_resource_administrate', ['workspaceId' => $workspace->getId(), 'id' => $resource->getId()]);
    }

    /**
     * Serve a ressource file that is not in the web folder as a base64 string.
     *
     * @Route(
     *     "/get/media/{id}",
     *     name="innova_get_mediaresource_resource_file",
     *     options={"expose"=true}
     * )
     * @ParamConverter("MediaResource", class="InnovaMediaResourceBundle:MediaResource")
     * @Method({"GET", "POST"})
     */
    public function serveMediaResourceFile(MediaResource $mr)
    {
        $fileUrl = $this->get('innova_media_resource.manager.media_resource_media')->getAudioMediaUrlForAjax($mr);
        $path = $this->container->getParameter('claroline.param.files_directory')
            .DIRECTORY_SEPARATOR
            .$fileUrl;
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $type = $finfo->file($path);
        $response = new BinaryFileResponse($path);
        $response->headers->set('Content-Type', $type);

        return $response;
    }

    /**
     * Create a zip that contains :
     * - the original file
     * - .vtt file (might be empty)
     * - all regions as audio files.
     *
     * @Route(
     *     "/media/{id}/zip",
     *     name="mediaresource_zip_export",
     *     options={"expose"=true}
     * )
     * @ParamConverter("MediaResource", class="InnovaMediaResourceBundle:MediaResource")
     * @Method({"GET"})
     */
    public function exportToZip(MediaResource $resource)
    {
        $data = $this->container->get('request')->query->get('data');
        $zipData = $this->get('innova_media_resource.manager.media_resource')->exportToZip($resource, $data);

        $response = new Response();
        $response->headers->set('Content-Transfer-Encoding', 'octet-stream');
        $response->headers->set('Content-Type', 'application/force-download');
        $response->headers->set('Content-Disposition', 'attachment; filename='.urlencode($zipData['name']));
        $response->headers->set('Content-Type', 'application/zip');
        $response->headers->set('Connection', 'close');
        $response->sendHeaders();

        $response->setContent(readfile($zipData['zip']));
        // remove zip file
        unlink($zipData['zip']);
        // remove temp folder
        rmdir($zipData['tempFolder']);

        return $response;
    }
}
