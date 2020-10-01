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
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use Claroline\CursusBundle\Entity\CursusUser;

class CursusUserSerializer
{
    use SerializerTrait;

    /** @var SerializerProvider */
    private $serializer;

    public function __construct(SerializerProvider $serializer)
    {
        $this->serializer = $serializer;
    }

    public function serialize(CursusUser $cursusUser, array $options = []): array
    {
        return [
            'id' => $cursusUser->getUuid(),
            'cursus' => $this->serializer->serialize($cursusUser->getCursus(), [Options::SERIALIZE_MINIMAL]),
            'user' => $this->serializer->serialize($cursusUser->getUser(), [Options::SERIALIZE_MINIMAL]),
            'type' => $cursusUser->getType(),
            'registrationDate' => DateNormalizer::normalize($cursusUser->getRegistrationDate()),
        ];
    }
}
