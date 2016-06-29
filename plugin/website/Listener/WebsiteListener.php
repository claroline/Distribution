<?php
/**
 * Created by PhpStorm.
 * User: panos
 * Date: 7/4/14
 * Time: 4:02 PM.
 */

namespace Icap\WebsiteBundle\Listener;

use Claroline\CoreBundle\Event\CopyResourceEvent;
use Claroline\CoreBundle\Event\CreateFormResourceEvent;
use Claroline\CoreBundle\Event\CreateResourceEvent;
use Claroline\CoreBundle\Event\DeleteResourceEvent;
use Claroline\CoreBundle\Event\OpenResourceEvent;
use Icap\WebsiteBundle\Entity\Website;
use Icap\WebsiteBundle\Form\WebsiteType;
use Symfony\Component\DependencyInjection\ContainerAware;
use Symfony\Component\HttpFoundation\RedirectResponse;

class WebsiteListener extends ContainerAware
{
    public function onCreateForm(CreateFormResourceEvent $event)
    {
        $form = $this->container->get('form.factory')->create(new WebsiteType(), new Website());
        $content = $this->container->get('templating')->render(
            'ClarolineCoreBundle:Resource:createForm.html.twig',
            [
                'form' => $form->createView(),
                'resourceType' => 'icap_website',
            ]
        );
        $event->setResponseContent($content);
        $event->stopPropagation();
    }
    public function onCreate(CreateResourceEvent $event)
    {
        $request = $this->container->get('request');
        $form = $this->container->get('form.factory')->create(new WebsiteType(), new Website());
        $form->handleRequest($request);
        if ($form->isValid()) {
            $website = $form->getData();
            $event->setResources([$website]);
        } else {
            $content = $this->container->get('templating')->render(
                'ClarolineCoreBundle:Resource:createForm.html.twig',
                [
                    'form' => $form->createView(),
                    'resourceType' => 'icap_website',
                ]
            );
            $event->setErrorFormContent($content);
        }
        $event->stopPropagation();
    }
    public function onOpen(OpenResourceEvent $event)
    {
        $route = $this->container
            ->get('router')
            ->generate(
                'icap_website_view',
                ['websiteId' => $event->getResource()->getId()]
            );
        $event->setResponse(new RedirectResponse($route));
        $event->stopPropagation();
    }
    public function onDelete(DeleteResourceEvent $event)
    {
        $this->container->get('icap.website.manager')->deleteWebsite($event->getResource());
        $event->stopPropagation();
    }
    public function onCopy(CopyResourceEvent $event)
    {
        $website = $event->getResource();

        $newWebsite = $this->container->get('icap.website.manager')->copyWebsite($website);

        $event->setCopy($newWebsite);
        $event->stopPropagation();
    }
}
