<?php

namespace Claroline\AnnouncementBundle\API\Serializer;

use Claroline\AnnouncementBundle\Entity\Announcement;
use Claroline\CoreBundle\API\Serializer\UserSerializer;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.announcement")
 * @DI\Tag("claroline.serializer")
 */
class AnnouncementSerializer
{
    /** @var UserSerializer */
    private $userSerializer;

    /**
     * AnnouncementSerializer constructor.
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
     * @param Announcement $announce
     *
     * @return array
     */
    public function serialize(Announcement $announce)
    {
        return [
            'id' => $announce->getUuid(),
            'title' => $announce->getTitle(),
            'content' => $announce->getContent(),
            'meta' => [
                'created' => $announce->getCreationDate()->format('Y-m-d\TH:i:s'),
                'creator' => $announce->getCreator() ? $this->userSerializer->serialize($announce->getCreator()) : null,
                'publishedAt' => $announce->getPublicationDate() ? $announce->getPublicationDate()->format('Y-m-d\TH:i:s') : null,
                'author' => $announce->getAnnouncer(),
                'sendMail' => !empty($announce->getTask()),
            ],
            'restrictions' => [
                'visible' => $announce->isVisible(),
                'visibleFrom' => $announce->getVisibleFrom() ? $announce->getVisibleFrom()->format('Y-m-d\TH:i:s') : null,
                'visibleUntil' => $announce->getVisibleUntil() ? $announce->getVisibleUntil()->format('Y-m-d\TH:i:s') : null,
            ],
        ];
    }
}
