<?php

namespace Claroline\PlannedNotificationBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\PlannedNotificationBundle\Entity\PlannedNotification;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.planned_notification")
 * @DI\Tag("claroline.serializer")
 */
class PlannedNotificationSerializer
{
    use SerializerTrait;

    /** @var MessageSerializer */
    private $messageSerializer;

    private $messageRepo;
    private $workspaceRepo;

    /**
     * MessageSerializer constructor.
     *
     * @DI\InjectParams({
     *     "messageSerializer" = @DI\Inject("claroline.serializer.planned_notification.message"),
     *     "om"                = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param MessageSerializer $messageSerializer
     * @param ObjectManager     $om
     */
    public function __construct(MessageSerializer $messageSerializer, ObjectManager $om)
    {
        $this->messageSerializer = $messageSerializer;

        $this->messageRepo = $om->getRepository('Claroline\PlannedNotificationBundle\Entity\Message');
        $this->workspaceRepo = $om->getRepository('Claroline\CoreBundle\Entity\Workspace\Workspace');
    }

    /**
     * @return string
     */
    public function getSchema()
    {
        return '#/plugin/planned-notification/planned-notification.json';
    }

    /**
     * @param PlannedNotification $notification
     *
     * @return array
     */
    public function serialize(PlannedNotification $notification)
    {
        return [
            'id' => $notification->getUuid(),
            'message' => $this->messageSerializer->serialize($notification->getMessage()),
            'parameters' => [
                'action' => $notification->getAction(),
                'interval' => $notification->getInterval(),
                'byMail' => $notification->isByMail(),
                'byMessage' => $notification->isByMessage(),
            ],
        ];
    }

    /**
     * @param array               $data
     * @param PlannedNotification $notification
     *
     * @return PlannedNotification
     */
    public function deserialize($data, PlannedNotification $notification)
    {
        $notification->setUuid($data['id']);

        $this->sipe('parameters.action', 'setAction', $data, $notification);
        $this->sipe('parameters.interval', 'setInterval', $data, $notification);
        $this->sipe('parameters.byMail', 'setByMail', $data, $notification);
        $this->sipe('parameters.byMessage', 'setByMessage', $data, $notification);

        if (isset($data['message']['id'])) {
            $message = $this->messageRepo->findOneBy(['uuid' => $data['message']['id']]);

            if (!empty($message)) {
                $notification->setMessage($message);
            }
        }
        if (isset($data['workspace']['uuid'])) {
            $workspace = $this->workspaceRepo->findOneBy(['uuid' => $data['workspace']['uuid']]);

            if (!empty($workspace)) {
                $notification->setWorkspace($workspace);
            }
        }

        return $notification;
    }
}
