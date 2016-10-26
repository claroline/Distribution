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

namespace Claroline\InwicastPluginBundle\Controller;

use Claroline\InwicastPluginBundle\Entity\Mediacenter;
use Claroline\InwicastPluginBundle\Exception\InvalidMediacenterFormException;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Request;

/**
 * @Route("/inwicast/mediacenter")
 * Class MediacenterController
 * @package Claroline\InwicastPluginBundle\Controller
 */
class MediacenterController extends Controller
{
    /**
     * @Route("/admin/configure", name="inwicast_mediacenter_configure")
     * @Method({"GET", "POST"})
     * @Template("ClarolineInwicastPluginBundle:Mediacenter:form.html.twig")
     * @param Request $request
     * @return array
     */
    public function configureAction(Request $request)
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
            "ClarolineInwicastPluginBundle:Mediacenter:success",
            array(
                'mediacenter' => $mediacenter
            )
        );

        return $response;
    }

    /**
     * @Route("/admin/configure/success", name="inwicast_mediacenter_configure_success")
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