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

namespace Inwicast\ClarolinePluginBundle\Manager;

use Doctrine\ORM\EntityManager;
use Inwicast\ClarolinePluginBundle\Entity\Mediacenter;
use Inwicast\ClarolinePluginBundle\Exception\InvalidMediacenterFormException;
use Inwicast\ClarolinePluginBundle\Exception\NoMediacenterException;
use Inwicast\ClarolinePluginBundle\Repository\MediacenterRepository;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\HttpFoundation\Request;

/**
 * @DI\Service("inwicast.plugin.manager.mediacenter")
 */
class MediacenterManager
{
    /**
     * @var \Doctrine\ORM\EntityManager
     */
    private $em;

    /**
     * @var \Inwicast\ClarolinePluginBundle\Repository\MediacenterRepository
     */
    private $mediacenterRepository;

    /**
     * @var \Symfony\Component\Form\FormFactoryInterface
     */
    private $formFactory;

    /**
     * @DI\InjectParams({
     *      "em"                    = @DI\Inject("doctrine.orm.entity_manager"),
     *      "mediacenterRepository" = @DI\Inject("inwicast.plugin.repository.mediacenter"),
     *      "formFactory"           = @DI\Inject("form.factory")
     * })
     */
    public function __construct(
        EntityManager $em,
        MediacenterRepository $mediacenterRepository,
        FormFactoryInterface $formFactory
    ) {
        $this->em = $em;
        $this->mediacenterRepository = $mediacenterRepository;
        $this->formFactory = $formFactory;
    }

    public function getMediacenter()
    {
        $mediacenter = $this->mediacenterRepository->findAll();
        if (sizeof($mediacenter) == 0) {
            throw new NoMediacenterException();
        } else {
            return $mediacenter[0];
        }
    }

    public function getMediacenterOrEmpty()
    {
        try {
            return $this->getMediacenter();
        } catch (NoMediacenterException $nme) {
            return $this->getEmptyMediacenter();
        }
    }

    public function getEmptyMediacenter()
    {
        return new Mediacenter();
    }

    public function getMediacenterForm(Mediacenter $mediacenter = null)
    {
        if ($mediacenter === null) $mediacenter = $this->getMediacenterOrEmpty();
        $form = $this->formFactory->create(
            'inwicast_plugin_type_mediacenter',
            $mediacenter
        );

        return $form;
    }

    public function processForm(Mediacenter $mediacenter, Request $request)
    {
        $form = $this->getMediacenterForm($mediacenter);
        $form->handleRequest($request);
        if ($form->isValid()) {
            $mediacenter = $form->getData();
            $this->em->persist($mediacenter);
            $this->em->flush();

            return $mediacenter;
        }

        throw new InvalidMediacenterFormException('invalid_url', $form);
    }
} 