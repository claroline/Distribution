<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\ForumBundle\Listener;

use Claroline\CoreBundle\Event\Notification\NotificationUserParametersEvent;
use Icap\NotificationBundle\Event\Notification\NotificationCreateDelegateViewEvent;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * @DI\Service()
 */
class NotificationListener
{
    /**
     * @DI\InjectParams({
     *     "translator" = @DI\Inject("translator"),
     *     "router"     = @DI\Inject("router")
     * })
     */
    public function __construct(TranslatorInterface $translator, RouterInterface $router)
    {
        $this->translator = $translator;
        $this->router = $router;
    }

    /**
     * @param NotificationCreateDelegateViewEvent $event
     * @DI\Observe("create_notification_item_forum_message-create")
     */
    public function onCreateNotificationItem(NotificationCreateDelegateViewEvent $event)
    {
        $notificationView = $event->getNotificationView();
        $notification = $notificationView->getNotification();

        //TODO: WORKSPACE OPEN URL CHANGE

        $event->setPrimaryAction([
          'url' => 'claro_resource_show_short',
          'parameters' => [
            'id' => $notification->getDetails()['resource']['guid'],
            '#' => 'subjects/show/'.$notification->getDetails()['details']['subject']['uuid'],
          ],
        ]);

        $text = $this->translator->trans('resource-claroline_forum-create_message', ['%forum%' => $notification->getDetails()['resource']['name']], 'notification');

        if (isset($notification->getDetails()['workspace'])) {
            $text .= ' - '.$notification->getDetails()['workspace']['name'];
        }

        $event->setText($text);
    }

    /**
     * @param NotificationUserParametersEvent $event
     *
     * @DI\Observe("icap_notification_user_parameters_event")
     */
    public function onGetTypesForParameters(NotificationUserParametersEvent $event)
    {
        $event->addTypes('forum');
    }
}
