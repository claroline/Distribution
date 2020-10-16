<?php

namespace Icap\BlogBundle\Listener;

use Claroline\CoreBundle\Event\Log\LogCreateDelegateViewEvent;
use Symfony\Component\DependencyInjection\ContainerAwareTrait;

class LogListener
{
    use ContainerAwareTrait;

    public function onCreateLogListItem(LogCreateDelegateViewEvent $event)
    {
        $content = $this->container->get('twig')->render(
            '@IcapBlog/log/log_list_item.html.twig',
            ['log' => $event->getLog()]
        );

        $event->setResponseContent($content);
        $event->stopPropagation();
    }

    public function onPostCreateLogDetails(LogCreateDelegateViewEvent $event)
    {
        $content = $this->container->get('twig')->render(
            '@IcapBlog/log/log_details.html.twig',
            [
                'log' => $event->getLog(),
                'listItemView' => $this->container->get('twig')->render(
                    '@IcapBlog/log/log_list_item.html.twig',
                    ['log' => $event->getLog()]
                ),
            ]
        );

        $event->setResponseContent($content);
        $event->stopPropagation();
    }
}
