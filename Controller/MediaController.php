<?php
/**
 * This file is part of the Claroline Connect package
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * Author: Panagiotis TSAVDARIS
 *
 * Date: 2/19/15
 */

namespace Inwicast\ClarolinePluginBundle\Controller;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Widget\WidgetInstance;
use Inwicast\ClarolinePluginBundle\Entity\Mediacenter;
use Inwicast\ClarolinePluginBundle\Exception\NoMediacenterException;
use JMS\DiExtraBundle\Annotation as DI;
use JMS\Serializer\SerializerBuilder;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * @Route("/inwicast/mediacenter/media")
 * Class MediaController
 * @package Inwicast\ClarolinePluginBundle\Controller
 */
class MediaController extends Controller
{
    /**
     * @Route("/{mediaRef}", name="inwicast_mediacenter_media_view")
     * @Method({"GET"})
     */
    public function viewAction(Request $request, $mediaRef)
    {
        try{
            $mediacenter = $this->getMediacenterManager()->getMediacenter();
            $loggedUser = $this->getSecurityContext()->getToken()->getUser();
            $content = $this->getMediaManager()->getMediaUrl($mediaRef, $mediacenter, $loggedUser);

            return new RedirectResponse($content);
        } catch(NoMediacenterException $nme) {
            return $this->render("InwicastClarolinePluginBundle:Mediacenter:error.html.twig");
        }
    }
    /**
     * @Route("/post/{widgetId}", requirements={"widgetId" = "\d+"}, name="inwicast_mediacenter_media_post")
     * @Method({"POST"})
     * @Template("InwicastClarolinePluginBundle:Media:view.html.twig")
     * @ParamConverter("user", options={"authenticatedUser" = true})
     * @ParamConverter("widget", class="ClarolineCoreBundle:Widget\WidgetInstance", options={"id" = "widgetId"})
     */
    public function postAction(Request $request, WidgetInstance $widget, User $user)
    {
        try{
            $mediacenter = $this->getMediacenterManager()->getMediacenter();
        } catch(NoMediacenterException $nme) {
            return $this->render("InwicastClarolinePluginBundle:Mediacenter:error.html.twig");
        }

        $mediaRef = $request->get("media_ref");
        $mediaManager = $this->getMediaManager();
        $media = $mediaManager->processPost($mediaRef, $widget, $mediacenter, $user);

        return array(
            'media'         => $media,
            'mediacenter'   => $mediacenter
        );
    }

    /**
     * @Route("/list/{widgetId}",
     *      requirements={"widgetId" = "\d+"},
     *      name="inwicast_mediacenter_user_videos"
     * )
     * @Method({"GET"})
     * @Template("InwicastClarolinePluginBundle:Media:videosList.html.twig")
     * @ParamConverter("user", options={"authenticatedUser" = true})
     * @ParamConverter("widget", class="ClarolineCoreBundle:Widget\WidgetInstance", options={"id" = "widgetId"})
     */
    public function listAction(User $user, WidgetInstance $widget)
    {
        return $this->videosListForTemplate($user, $widget);
    }

    /**
     * @Route("/list/tinymce",
     *      name="inwicast_mediacenter_user_videos_tinymce",
     *      options={"expose"=true}
     * )
     * @Method({"GET"})
     * @Template("InwicastClarolinePluginBundle:Media:videosListTinymce.html.twig")
     * @ParamConverter("user", options={"authenticatedUser" = true})
     */
    public function listTinymceAction(User $user)
    {
        return $this->videosListForTemplate($user);
    }

    /**
     * @Route("/search", name="inwicast_mediacenter_user_videos_search")
     * @Method({"GET"})
     * @Template()
     * @ParamConverter("user", options={"authenticatedUser" = true})
     */
    public function searchAction(Request $request, User $user)
    {
        $response = new JsonResponse();
        try{
            $mediacenter = $this->getMediacenterManager()->getMediacenter();
            $keywords = $request->get("keywords");
            $mediaList = $this->getVideosList($user, $mediacenter, $keywords);
            $mediaListJson = $this->serializeObject($mediaList);
            $data = array('videos' => $mediaListJson);
            $response->setData($data);
        } catch(NoMediacenterException $nme) {
            $response->setStatusCode(Response::HTTP_EXPECTATION_FAILED);
        }

        return $response;
    }

    private function videosListForTemplate(
        User $user, WidgetInstance $widget = null
    ) {
        try{
            $mediacenter = $this->getMediacenterManager()->getMediacenter();
            $medialist = $this->getVideosList($user, $mediacenter);
            $result = array(
                'medialist' => $medialist,
                'widget'    => $widget,
                'mediacenter'   =>$mediacenter,
                'username'  => $user->getUsername()
            );
        } catch(NoMediacenterException $nme) {
            return $this->render('InwicastClarolinePluginBundle:Mediacenter:error.html.twig');
        }

        // Return $result
        return $result;
    }

    private function getVideosList(
        User $user,
        Mediacenter $mediacenter,
        $keywords = null
    ) {
        return $this->getMediaManager()->getMediaListForUser($user, $mediacenter, $keywords);
    }
} 