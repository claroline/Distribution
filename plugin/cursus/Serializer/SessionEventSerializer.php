<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CursusBundle\Serializer;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\File\PublicFileSerializer;
use Claroline\CoreBundle\API\Serializer\User\LocationSerializer;
use Claroline\CoreBundle\Entity\File\PublicFile;
use Claroline\CoreBundle\Entity\Organization\Location;
use Claroline\CoreBundle\Library\Normalizer\DateRangeNormalizer;
use Claroline\CoreBundle\Repository\Organization\LocationRepository;
use Claroline\CursusBundle\Entity\CourseSession;
use Claroline\CursusBundle\Entity\SessionEvent;
use Doctrine\Common\Persistence\ObjectRepository;

class SessionEventSerializer
{
    use SerializerTrait;

    /** @var ObjectManager */
    private $om;
    /** @var PublicFileSerializer */
    private $fileSerializer;
    /** @var LocationSerializer */
    private $locationSerializer;
    /** @var SessionSerializer */
    private $sessionSerializer;

    /** @var LocationRepository */
    private $locationRepo;
    /** @var ObjectRepository */
    private $sessionRepo;

    /**
     * SessionEventSerializer constructor.
     *
     * @param ObjectManager        $om
     * @param PublicFileSerializer $fileSerializer
     * @param LocationSerializer   $locationSerializer
     * @param SessionSerializer    $sessionSerializer
     */
    public function __construct(
        ObjectManager $om,
        PublicFileSerializer $fileSerializer,
        LocationSerializer $locationSerializer,
        SessionSerializer $sessionSerializer
    ) {
        $this->om = $om;
        $this->fileSerializer = $fileSerializer;
        $this->locationSerializer = $locationSerializer;
        $this->sessionSerializer = $sessionSerializer;

        $this->locationRepo = $om->getRepository(Location::class);
        $this->sessionRepo = $om->getRepository(CourseSession::class);
    }

    /**
     * @param SessionEvent $event
     * @param array        $options
     *
     * @return array
     */
    public function serialize(SessionEvent $event, array $options = [])
    {
        $serialized = [
            'id' => $event->getUuid(),
            'code' => $event->getCode(),
            'name' => $event->getName(),
            'description' => $event->getDescription(),
            'poster' => $this->serializePoster($event),
            'thumbnail' => $this->serializeThumbnail($event),
            'location' => $event->getLocation() ? $this->locationSerializer->serialize($event->getLocation(), [Options::SERIALIZE_MINIMAL]) : null,
        ];

        if (!in_array(Options::SERIALIZE_MINIMAL, $options)) {
            $serialized = array_merge($serialized, [
                'meta' => [
                    'type' => $event->getType(),
                    'session' => $this->sessionSerializer->serialize($event->getSession(), [Options::SERIALIZE_MINIMAL]),
                    'locationExtra' => $event->getLocationExtra(),
                    'isEvent' => SessionEvent::TYPE_EVENT === $event->getType(), // todo : replace by a bool in db
                ],
                'restrictions' => [
                    'users' => $event->getMaxUsers(),
                    'dates' => DateRangeNormalizer::normalize($event->getStartDate(), $event->getEndDate()),
                ],
                'registration' => [
                    'registrationType' => $event->getRegistrationType(),
                ],
            ]);
        }

        return $serialized;
    }

    /**
     * @param array        $data
     * @param SessionEvent $event
     *
     * @return SessionEvent
     */
    public function deserialize($data, SessionEvent $event)
    {
        $this->sipe('id', 'setUuid', $data, $event);
        $this->sipe('code', 'setCode', $data, $event);
        $this->sipe('name', 'setName', $data, $event);
        $this->sipe('description', 'setDescription', $data, $event);
        $this->sipe('meta.locationExtra', 'setLocationExtra', $data, $event);
        $this->sipe('restrictions.users', 'setMaxUsers', $data, $event);
        $this->sipe('registration.registrationType', 'setRegistrationType', $data, $event);

        if (isset($data['poster'])) {
            $event->setPoster($data['poster']['url'] ?? null);
        }

        if (isset($data['thumbnail'])) {
            $event->setThumbnail($data['thumbnail']['url'] ?? null);
        }

        if (isset($data['meta'])) {
            if (isset($data['meta']['isEvent'])) {
                $event->setType($data['meta']['isEvent'] ? SessionEvent::TYPE_EVENT : SessionEvent::TYPE_NONE);
            }
        }

        if (isset($data['restrictions']['dates'])) {
            $dates = DateRangeNormalizer::denormalize($data['restrictions']['dates']);

            $event->setStartDate($dates[0]);
            $event->setEndDate($dates[1]);
        }

        $session = $event->getSession();
        if (empty($session) && isset($data['meta']['session']['id'])) {
            /** @var CourseSession $session */
            $session = $this->sessionRepo->findOneBy(['uuid' => $data['meta']['session']['id']]);

            if ($session) {
                $event->setSession($session);
            }
        }

        if (isset($data['location']) && isset($data['location']['id'])) {
            $location = $this->locationRepo->findOneBy(['uuid' => $data['location']['id']]);
            $event->setLocation($location);
        } else {
            $event->setLocation(null);
        }

        return $event;
    }

    private function serializePoster(SessionEvent $event)
    {
        if (!empty($event->getPoster())) {
            /** @var PublicFile $file */
            $file = $this->om
                ->getRepository(PublicFile::class)
                ->findOneBy(['url' => $event->getPoster()]);

            if ($file) {
                return $this->fileSerializer->serialize($file);
            }
        }

        return null;
    }

    private function serializeThumbnail(SessionEvent $event)
    {
        if (!empty($event->getThumbnail())) {
            /** @var PublicFile $file */
            $file = $this->om
                ->getRepository(PublicFile::class)
                ->findOneBy(['url' => $event->getThumbnail()]);

            if ($file) {
                return $this->fileSerializer->serialize($file);
            }
        }

        return null;
    }
}
