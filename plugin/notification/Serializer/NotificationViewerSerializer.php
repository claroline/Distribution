<?php

namespace  Icap\NotificationBundle\Serializer;

use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Icap\NotificationBundle\Entity\NotificationViewer;
use Icap\NotificationBundle\Event\Notification\NotificationCreateDelegateViewEvent;
use Icap\NotificationBundle\Manager\NotificationManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

/**
 * @DI\Service("claroline.serializer.notification_viewer")
 * @DI\Tag("claroline.serializer")
 */
class NotificationViewerSerializer
{
    /**
     * ContactFinder constructor.
     *
     * @DI\InjectParams({
     *     "notificationSerializer" = @DI\Inject("claroline.serializer.notification"),
     *     "eventDispatcher" = @DI\Inject("event_dispatcher"),
     *      "configHandler" = @DI\Inject("claroline.config.platform_config_handler"),
     *     "manager" = @DI\Inject("icap.notification.manager")
     * })
     */
    public function __construct(
      NotificationSerializer $notificationSerializer,
      NotificationManager $manager,
      PlatformConfigurationHandler $configHandler,
      EventDispatcherInterface $eventDispatcher
    ) {
        $this->notificationSerializer = $notificationSerializer;
        $this->manager = $manager;
        $this->eventDispatcher = $eventDispatcher;
        $this->platformName = $configHandler->getParameter('name');
    }

    public function serialize(NotificationViewer $viewer)
    {
        return [
            'id' => $viewer->getId(),
            'notification' => $this->notificationSerializer->serialize($viewer->getNotification()),
            'text' => $this->render($viewer),
        ];
    }

    public function render(NotificationViewer $viewer)
    {
        $eventName = 'create_notification_item_'.$viewer->getNotification()->getActionKey();
        $event = new NotificationCreateDelegateViewEvent($viewer, $this->platformName);

        /* @var EventDispatcher $eventDispatcher */
        if ($this->eventDispatcher->hasListeners($eventName)) {
            return $this->eventDispatcher->dispatch($eventName, $event)->getResponseContent();
        }
    }

    public function getClass()
    {
        return NotificationViewer::class;
    }
}
