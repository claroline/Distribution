<?php

namespace Innova\MediaResourceBundle\EventListener\Resource;

use Claroline\CoreBundle\Event\CustomActionResourceEvent;
use Claroline\CoreBundle\Event\Resource\CopyResourceEvent;
use Claroline\CoreBundle\Event\Resource\CreateResourceEvent;
use Claroline\CoreBundle\Event\Resource\DeleteResourceEvent;
use Claroline\CoreBundle\Event\Resource\OpenResourceEvent;
use Innova\MediaResourceBundle\Entity\MediaResource;
use Innova\MediaResourceBundle\Form\Type\MediaResourceType;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerAwareTrait;
use Symfony\Component\HttpFoundation\RedirectResponse;

/**
 * Media Resource Event Listener
 * Used to integrate Path to Claroline resource manager.
 *
 *  @DI\Service()
 */
class MediaResourceListener
{
    use ContainerAwareTrait;

    protected $container;

    /**
     * @DI\Observe("innova_media_resource_administrate_innova_media_resource")
     **/
    public function onAdministrate(CustomActionResourceEvent $event)
    {
        $mediaResource = $event->getResource();
        $route = $this->container
                ->get('router')
                ->generate('innova_media_resource_administrate', [
            'id' => $mediaResource->getId(),
            'workspaceId' => $mediaResource->getWorkspace()->getId(),
          ]
        );
        $event->setResponse(new RedirectResponse($route));
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("open_innova_media_resource")
     */
    public function onOpen(OpenResourceEvent $event)
    {
        $mediaResource = $event->getResource();
        $route = $this->container
                ->get('router')
                ->generate('innova_media_resource_open', [
            'id' => $mediaResource->getId(),
            'workspaceId' => $mediaResource->getWorkspace()->getId(),
          ]
        );
        $event->setResponse(new RedirectResponse($route));
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("create_innova_media_resource")
     *
     * @param CreateResourceEvent $event
     *
     * @throws \Exception
     */
    public function onCreate(CreateResourceEvent $event)
    {
        // Create form
        $form = $this->container->get('form.factory')->create(new MediaResourceType(), new MediaResource());
        // Try to process form
        $request = $this->container->get('request_stack')->getMasterRequest();
        $form->submit($request);
        if ($form->isValid()) {
            $mediaResource = $form->getData();
            $file = $form['file']->getData();
            $workspace = $event->getParent()->getWorkspace();
            $this->container->get('innova_media_resource.manager.media_resource')->createMediaResourceDefaultOptions($mediaResource);
            $this->container->get('innova_media_resource.manager.media_resource')->handleMediaResourceMedia($file, $mediaResource, $workspace);
            // Send new MediaResource to dispatcher through event object
            $event->setResources([$mediaResource]);
        } else {
            $content = $this->container->get('templating')->render(
                    'ClarolineCoreBundle:resource:create_form.html.twig', [
                      'form' => $form->createView(),
                      'resourceType' => 'innova_media_resource',
                    ]
            );
            $event->setErrorFormContent($content);
        }
        $event->stopPropagation();

        return;
    }

    /**
     * @DI\Observe("delete_innova_media_resource")
     **/
    public function onDelete(DeleteResourceEvent $event)
    {
        $mediaResource = $event->getResource();
        $manager = $this->container->get('innova_media_resource.manager.media_resource');
        $manager->delete($mediaResource);

        $event->stopPropagation();
    }

    /**
     * Fired when a ResourceNode of type MediaResource is duplicated.
     *
     * @DI\Observe("copy_innova_media_resource")
     *
     * @param \Claroline\CoreBundle\Event\Resource\CopyResourceEvent $event
     *
     * @throws \Exception
     */
    public function onCopy(CopyResourceEvent $event)
    {
        $toCopy = $event->getResource();
        $new = new MediaResource();
        $new->setName($toCopy->getName());

        // copy options
        $this->container->get('innova_media_resource.manager.media_resource')->copyOptions($new, $toCopy);
        // duplicate media resource media(s) (=file(s))
        $medias = $toCopy->getMedias();
        foreach ($medias as $media) {
            $this->container->get('innova_media_resource.manager.media_resource')->copyMedia($new, $media);
        }

        // duplicate regions and region config
        $regions = $toCopy->getRegions();
        foreach ($regions as $region) {
            $this->container->get('innova_media_resource.manager.media_resource_region')->copyRegion($new, $region);
        }
        $event->setCopy($new);
        $event->stopPropagation();
    }
}