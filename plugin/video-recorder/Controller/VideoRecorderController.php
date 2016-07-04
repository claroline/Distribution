<?php

namespace Innova\VideoRecorderBundle\Controller;

use Innova\VideoRecorderBundle\Entity\VideoRecorderConfiguration;
use Innova\VideoRecorderBundle\Manager\VideoRecorderManager;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class VideoRecorderController extends Controller
{
    protected $manager;

    /**
     * @DI\InjectParams({
     *      "manager"         = @DI\Inject("innova.video_recorder.manager")
     * })
     */
    public function __construct(VideoRecorderManager $manager)
    {
        $this->manager = $manager;
    }

    /**
     * @Route("/update/configuration/{id}", name="video_recorder_config_save")
     * @ParamConverter("config", class="InnovaVideoRecorderBundle:VideoRecorderConfiguration")
     * @Method("POST")
     */
    public function updateConfigurationAction(VideoRecorderConfiguration $config, Request $request)
    {
        if ($request->isMethod('POST')) {
            $postData = $request->request->get('video_recorder_configuration');
            if (isset($postData['max_recording_time'])) {
                $this->manager->updateConfiguration($config, $postData);
                $msg = $this->get('translator')->trans('config_update_success', [], 'tools');
                $this->get('session')->getFlashBag()->set('success', $msg);
            } else {
                $msg = $this->get('translator')->trans('config_update_error', [], 'tools');
                $this->get('session')->getFlashBag()->set('error', $msg);
            }

            return $this->redirectToRoute('claro_desktop_open_tool', ['toolName' => 'home']);
        }
    }
}
