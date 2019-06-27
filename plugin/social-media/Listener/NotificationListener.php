<?php
/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * Author: Panagiotis TSAVDARIS
 *
 * Date: 5/18/15
 */

namespace Icap\SocialmediaBundle\Listener;

use Icap\NotificationBundle\Event\Notification\NotificationCreateDelegateViewEvent;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * Class NotificationListener.
 *
 * @DI\Service
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
     * @DI\Observe("create_notification_item_resource-icap_socialmedia-comment_action")
     * @DI\Observe("create_notification_item_resource-icap_socialmedia-like_action")
     * @DI\Observe("create_notification_item_resource-icap_socialmedia-share_action")
     */
    public function onCreateNotificationItem(NotificationCreateDelegateViewEvent $event)
    {
        $notificationView = $event->getNotificationView();
        $notification = $notificationView->getNotification();

        $primaryAction = [
          'url' => 'claro_resource_open_short',
          'parameters' => [
            'node' => $notification->getDetails()['resource']['id'],
          ],
        ];

        $text = '';

        switch ($notification->getActionKey()) {
          case LogSocialmediaLikeEvent::ACTION:
            $text .= $translator->trans('liked', [], 'icap_socialmedia');
            break;
          case LogSocialmediaShareEvent::ACTION:
            if (isset($notification->getDetails()['share']) && isset($notification->getDetails()['network'])) {
                $text .= $translator->trans('shared_on', ['%network%' => $notification->getDetails()['network']], 'icap_socialmedia');
            } else {
                $text .= $translator->trans('shared_on', ['%network%' => 'claroline'], 'icap_socialmedia');
            }
            break;
          case LogSocialmediaCommentEvent::ACTION:
            $text .= $translator->trans('commented', [], 'icap_socialmedia');
            $primaryAction = [
              'url' => 'icap_socialmedia_comments_view',
              'parameters' => [
                'resourceId' => $notification->getDetails()['resource']['id'],
              ],
            ];
            break;
        }

        $text .= ' '.$notification->getDetails()['resource']['name'];
        $event->setText($text);
        $event->setPrimaryAction($primaryAction);
    }
}
