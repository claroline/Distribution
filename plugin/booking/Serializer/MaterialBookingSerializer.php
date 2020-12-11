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
use Claroline\BookingBundle\Entity\MaterialBooking;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;

class MaterialBookingSerializer
{
    use SerializerTrait;

    public function serialize(MaterialBooking $materialBooking, array $options = []): array
    {
        return [
            'id' => $materialBooking->getUuid(),
            'description' => $materialBooking->getDescription(),
            'start' => $materialBooking->getStartDate() ? DateNormalizer::normalize($materialBooking->getStartDate()) : null,
            'end' => $materialBooking->getEndDate() ? DateNormalizer::normalize($materialBooking->getEndDate()) : null,
        ];
    }

    public function deserialize(array $data, MaterialBooking $materialBooking, array $options): MaterialBooking
    {
        $this->sipe('id', 'setUuid', $data, $materialBooking);
        $this->sipe('description', 'setDescription', $data, $materialBooking);
        $this->sipe('capacity', 'setCapacity', $data, $materialBooking);

        if (isset($data['start'])) {
            $materialBooking->setStartDate(DateNormalizer::denormalize($data['start']));
        }

        if (isset($data['end'])) {
            $materialBooking->setEndDate(DateNormalizer::denormalize($data['end']));
        }

        return $materialBooking;
    }
}
