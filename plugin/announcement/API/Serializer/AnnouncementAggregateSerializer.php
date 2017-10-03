<?php

namespace Claroline\AnnouncementBundle\API\Serializer;

use Claroline\AnnouncementBundle\Entity\Announcement;
use Claroline\AnnouncementBundle\Entity\AnnouncementAggregate;
use Claroline\CoreBundle\API\Serializer\UserSerializer;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.announcement")
 * @DI\Tag("claroline.serializer")
 */
class AnnouncementAggregateSerializer
{
    /** @var UserSerializer */
    private $userSerializer;

    /**
     * AnnouncementAggregateSerializer constructor.
     *
     * @DI\InjectParams({
     *     "userSerializer" = @DI\Inject("claroline.serializer.user")
     * })
     *
     * @param UserSerializer $userSerializer
     */
    public function __construct(
        UserSerializer $userSerializer
    ) {
        $this->userSerializer = $userSerializer;
    }

    /**
     * @param AnnouncementAggregate $announcements
     *
     * @return array
     */
    public function serialize(AnnouncementAggregate $announcements)
    {
        return [
            'id' => $announcements->getUuid(),
            'posts' => array_map(function (Announcement $announcement) {
                return $this->serializeAnnounce($announcement);
            }, $announcements->getAnnouncements()->toArray()),
        ];
    }

    /**
     * @param Announcement $announce
     *
     * @return array
     */
    private function serializeAnnounce(Announcement $announce)
    {
        return [
            'id' => $announce->getUuid(),
            'title' => $announce->getTitle(),
            'content' => $announce->getContent(),
            'announcer' => $announce->getAnnouncer(),
            'meta' => [
                'created' => $announce->getCreationDate()->format('Y-m-d\TH:i:s'),
                'creator' => $announce->getCreator() ? $this->userSerializer->serialize($announce->getCreator()) : null,
                'publishedAt' => $announce->getPublicationDate() ? $announce->getPublicationDate()->format('Y-m-d\TH:i:s') : null,
            ],
            'restrictions' => [
                'visible'      => $announce->isVisible(),
                'visibleFrom'  => $announce->getVisibleFrom() ? $announce->getVisibleFrom()->format('Y-m-d\TH:i:s') : null,
                'visibleUntil' => $announce->getVisibleUntil() ? $announce->getVisibleUntil()->format('Y-m-d\TH:i:s') : null,
            ]
        ];
    }
}
