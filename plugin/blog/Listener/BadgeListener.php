<?php

namespace Icap\BlogBundle\Listener;

use Icap\BlogBundle\Event\Log\LogCommentCreateEvent;
use Icap\BlogBundle\Event\Log\LogCommentDeleteEvent;
use Icap\BlogBundle\Event\Log\LogPostCreateEvent;
use Icap\BlogBundle\Event\Log\LogPostDeleteEvent;
use Icap\BlogBundle\Event\Log\LogPostReadEvent;
use Icap\BlogBundle\Event\Log\LogPostUpdateEvent;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Routing\RouterInterface;

class BadgeListener
{
    /** @var RouterInterface */
    private $router;

    public function __construct(RouterInterface $router)
    {
        $this->router = $router;
    }

    public function onBagdeCreateValidationLink($event)
    {
        $content = null;
        $log = $event->getLog();

        switch ($log->getAction()) {
            case LogPostCreateEvent::ACTION:
            case LogPostDeleteEvent::ACTION:
            case LogPostReadEvent::ACTION:
            case LogPostUpdateEvent::ACTION:
                $logDetails = $event->getLog()->getDetails();
                $node = $event->getLog()->getResourceNode();

                $url = $this->router->generate('claro_index', [], UrlGeneratorInterface::ABSOLUTE_PATH).
                    '#/desktop/workspaces/open/'.$node->getWorkspace()->getSlug().'/resources/'.$node->getSlug().
                    '/'.$logDetails['post']['title'];
                $title = $logDetails['post']['title'];
                $content = sprintf('<a href="%s" title="%s">%s</a>', $url, $title, $title);
                break;
            case LogCommentCreateEvent::ACTION:
            case LogCommentDeleteEvent::ACTION:
                $logDetails = $event->getLog()->getDetails();
                $node = $event->getLog()->getResourceNode();

                $url = $this->router->generate('claro_index', [], UrlGeneratorInterface::ABSOLUTE_PATH).
                    '#/desktop/workspaces/open/'.$node->getWorkspace()->getSlug().'/resources/'.$node->getSlug().
                    '/'.$logDetails['post']['title'];
                $title = $logDetails['post']['title'];
                $anchor = isset($logDetails['comment']['id']) ? '#comment-'.$logDetails['comment']['id'] : '';
                $content = sprintf('<a href="%s%s" title="%s">%s</a>', $url, $anchor, $title, $title);
                break;
        }

        $event->setContent($content);
        $event->stopPropagation();
    }
}
