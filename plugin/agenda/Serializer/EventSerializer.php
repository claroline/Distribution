<?php

namespace Claroline\AgendaBundle\Serializer;

use Claroline\AgendaBundle\Entity\Event;
use Claroline\AgendaBundle\Entity\EventInvitation;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.event")
 * @DI\Tag("claroline.serializer")
 */
class EventSerializer
{
    use SerializerTrait;

    /** @var SerializerProvider */
    private $serializer;

    /**
     * RoleSerializer constructor.
     *
     * @DI\InjectParams({
     *     "serializer" = @DI\Inject("claroline.api.serializer")
     * })
     *
     * @param SerializerProvider $serializer
     */
    public function __construct(SerializerProvider $serializer)
    {
        $this->serializer = $serializer;
    }

    /**
     * @param Event $event
     *
     * @return array
     */
    public function serialize(Event $event)
    {
        $guests = [];
        $invitation = null;

        foreach ($event->getEventInvitations() as $eventInvitation) {
            $guests[] = [
                'user' => $this->serializer->serialize($eventInvitation->getUser()),
                'status' => $eventInvitation->getStatus(),
            ];

            if ($eventInvitation->getUser() === $user) {
                $invitation = $eventInvitation;
            }
        }

        return [
            'id' => $event->getId(),
            'title' => $invitation && !is_null($event->getTitle()) ? $invitation->getTitle() : $event->getTitle(),
            'start' => DateNormalizer::normalize($event->getStartInDateTime()),
            'end' => DateNormalizer::normalize($event->getEndInDateTime()),
            'color' => $event->getPriority(),
            'allDay' => $event->isAllDay(),
            'owner' => $this->serializer->serialize($event->getUser()),
            'description' => $invitation && !is_null($invitation->getDescription()) ? $invitation->getDescription() : $event->getDescription(),
            'workspace' => $event->getWorkspace() ? $this->serializer->serialize($event->getWorkspace()) : null,
            'className' => 'event_'.$event->getId(),
            'editable' => false !== $event->isEditable() && !$invitation,
            'invitations' => $guests,
            'meta' => $this->serializeMeta($event, $invitation),
            'restrictions' => $this->serializeRestrictions($event, $invitation),
            'invitationStatus' => [
                'ignore' => EventInvitation::IGNORE,
                'join' => EventInvitation::JOIN,
                'maybe' => EventInvitation::MAYBE,
                'resign' => EventInvitation::RESIGN,
            ], //We have to passed the status list of the eventInvitation for the popover render because twig.js doesn't have the constant function
        ];
    }

    public function serializeRestrictions($event, $invitation = null)
    {
        return [
          'durationEditable' => !$event->isTask() && false !== $event->isEditable() && !$invitation,
        ];
    }

    public function serializeMeta(Event $event, $invitation = null)
    {
        return [
          'isTask' => $event->isTask(),
          'isTaskDone' => $event->isTaskDone(),
          'isGuest' => !is_null($invitation),
        ];
    }

    /**
     * @param array      $data
     * @param Event|null $event
     *
     * @return Event
     */
    public function deserialize(array $data, Event $event = null)
    {
        $this->sipe('title', 'setTitle', $data, $event);
        $this->sipe('color', 'setPriority', $data, $event);
        $this->sipe('allDay', 'setAllDay', $data, $event);
        $this->sipe('description', 'setDescription', $data, $event);
        $this->sipe('isTask', 'setIsTask', $data, $event);
        $this->sipe('isTaskDone', 'setIsTaskDone', $data, $event);
        $this->sipe('isEditable', 'setIsEditable', $data, $event);

        if (isset($data['workspace'])) {
            //add ws
        }
        //owner set in crud create

        if (isset($data['start'])) {
            $event->setStart(DateNormalizer::denormalize($data['start']));
        }

        if (isset($data['end'])) {
            $event->setEnd(DateNormalizer::denormalize($data['end']));
        }

        return $event;
    }

    public function getClass()
    {
        return 'Claroline\AgendaBundle\Entity\Event';
    }
}
