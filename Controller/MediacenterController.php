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

use Inwicast\ClarolinePluginBundle\Entity\Mediacenter;
use Inwicast\ClarolinePluginBundle\Exception\InvalidMediacenterFormException;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;

/**
 * @Route("/inwicast/mediacenter")
 * Class MediacenterController
 * @package Inwicast\ClarolinePluginBundle\Controller
 */
class MediacenterController extends Controller
{
    /**
     * @Route("/update", name="inwicast_mediacenter_update")
     * @Method({"GET", "POST"})
     * @Template("InwicastClarolinePluginBundle:Mediacenter:form.html.twig")
     * @param Request $request
     * @return array
     */
    public function updateAction(Request $request)
    {
        $this->checkAdmin();
        $mediacenterManager = $this->getMediacenterManager();
        $mediacenter = $mediacenterManager->getMediacenterOrEmpty();
        try {
            $mediacenter = $mediacenterManager->processForm($mediacenter, $request);
        } catch (InvalidMediacenterFormException $imfe) {
            return array('form' => $imfe->getForm()->createView());
        }

        $response = $this->forward(
            "InwicastClarolinePluginBundle:Mediacenter:success",
            array(
                'mediacenter' => $mediacenter
            )
        );

        return $response;
    }

    /**
     * @Route("/update/success", name="inwicast_mediacenter_update_success")
     * @Method({"GET"})
     * @Template()
     *
     * @param Mediacenter $mediacenter
     * @return array
     */
    public function successAction(Mediacenter $mediacenter = null)
    {
        $this->checkAdmin();
        if ($mediacenter === null) {
            $mediacenter = $this->getMediacenterManager()->getMediacenter();
        }

        return array('mediacenter' => $mediacenter);
    }
} 