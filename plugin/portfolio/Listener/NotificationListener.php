<?php

namespace Icap\PortfolioBundle\Listener;

use Icap\NotificationBundle\Event\Notification\NotificationCreateDelegateViewEvent;
use Symfony\Component\DependencyInjection\ContainerAwareTrait;

class NotificationListener
{
    use ContainerAwareTrait;

    public function onCreateNotificationItem(NotificationCreateDelegateViewEvent $event)
    {/*
      {% set path = path('icap_portfolio_view', {'portfolioSlug': notification.details.portfolio.slug}) %}
      {% set portfolio = '<a href="' ~ path ~ '">' ~ notification.details.portfolio.title ~ '</a>' %}

      {{ notification.actionKey|trans({'%portfolio%': portfolio}, 'notification') | raw }}*/
    }
}
