<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\BookingBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\File\PublicFileSerializer;
use Claroline\CoreBundle\Entity\File\PublicFile;
use Claroline\BookingBundle\Entity\Room;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class RoomSerializer
{
    use SerializerTrait;

    /** @var AuthorizationCheckerInterface */
    private $authorization;
    /** @var TokenStorageInterface */
    private $tokenStorage;
    /** @var EventDispatcherInterface */
    private $eventDispatcher;
    /** @var ObjectManager */
    private $om;
    /** @var PublicFileSerializer */
    private $fileSerializer;
    private $roomRepo;

    public function __construct(
        AuthorizationCheckerInterface $authorization,
        TokenStorageInterface $tokenStorage,
        EventDispatcherInterface $eventDispatcher,
        ObjectManager $om,
        PublicFileSerializer $fileSerializer
    ) {
        $this->authorization = $authorization;
        $this->tokenStorage = $tokenStorage;
        $this->eventDispatcher = $eventDispatcher;
        $this->om = $om;
        $this->fileSerializer = $fileSerializer;

        $this->roomRepo = $om->getRepository(Room::class);
    }

    public function getSchema()
    {
        return '#/plugin/booking/room.json';
    }

    public function serialize(Room $room, array $options = []): array
    {
        return [
            'id' => $room->getUuid(),
            'code' => $room->getCode(),
            'name' => $room->getName(),
            'description' => $room->getDescription(),
            'capacity' => $room->getCapacity(),
            'poster' => $this->serializePoster($room),
            'thumbnail' => $this->serializeThumbnail($room),
            'permissions' => [
                'open' => $this->authorization->isGranted('OPEN', $room),
                'edit' => $this->authorization->isGranted('EDIT', $room),
                'delete' => $this->authorization->isGranted('DELETE', $room),
            ],
        ];
    }

    public function deserialize(array $data, Room $room, array $options): Room
    {
        $this->sipe('id', 'setUuid', $data, $room);
        $this->sipe('code', 'setCode', $data, $room);
        $this->sipe('name', 'setName', $data, $room);
        $this->sipe('description', 'setDescription', $data, $room);
        $this->sipe('capacity', 'setCapacity', $data, $room);

        if (isset($data['poster'])) {
            $room->setPoster($data['poster']['url'] ?? null);
        }

        if (isset($data['thumbnail'])) {
            $room->setThumbnail($data['thumbnail']['url'] ?? null);
        }

        return $room;
    }

    private function serializePoster(Room $room)
    {
        if (!empty($room->getPoster())) {
            /** @var PublicFile $file */
            $file = $this->om
                ->getRepository(PublicFile::class)
                ->findOneBy(['url' => $room->getPoster()]);

            if ($file) {
                return $this->fileSerializer->serialize($file);
            }
        }

        return null;
    }

    private function serializeThumbnail(Room $room)
    {
        if (!empty($room->getThumbnail())) {
            /** @var PublicFile $file */
            $file = $this->om
                ->getRepository(PublicFile::class)
                ->findOneBy(['url' => $room->getThumbnail()]);

            if ($file) {
                return $this->fileSerializer->serialize($file);
            }
        }

        return null;
    }
}
