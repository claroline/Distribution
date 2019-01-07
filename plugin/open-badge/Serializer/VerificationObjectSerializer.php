<?php

namespace Claroline\OpenBadgeBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\OpenBadgeBundle\Entity\Assertion;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.open_badge.verification_object")
 */
class VerificationObjectSerializer
{
    use SerializerTrait;

    public function serialize(Assertion $assertion)
    {
        return [
            'verificationProperty' => 'id',
            'type' => 'HostedBadge',
        ];
    }
}
