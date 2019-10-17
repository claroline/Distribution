<?php

namespace Icap\DropzoneBundle;

use Claroline\CoreBundle\Event\Resource\DeleteResourceEvent;
use Icap\DropzoneBundle\Entity\Dropzone;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerInterface;

class DeleteListener
{
    private $container;

    public function __construct(
        ContainerInterface $container
    ) {
        $this->container = $container;
    }

    /**
     * @DI\Observe("resource.icap_dropzone.delete")
     *
     * @param DeleteResourceEvent $event
     */
    public function onDelete(DeleteResourceEvent $event)
    {
        $em = $this->container->get('claroline.persistence.object_manager');
        $resource = $event->getResource();

        foreach ($resource->getDrops() as $drop) {
            $em->remove($drop);
        }
        $em->remove($event->getResource());
        $event->stopPropagation();
    }
}
