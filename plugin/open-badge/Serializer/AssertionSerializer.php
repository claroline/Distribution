<?php

namespace Claroline\OpenBadgeBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\API\Serializer\User\UserSerializer;
use Claroline\OpenBadgeBundle\Entity\Assertion;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service()
 * @DI\Tag("claroline.serializer")
 */
class AssertionSerializer
{
    use SerializerTrait;

    /**
     * @DI\InjectParams({
     *     "badgeSerializer" = @DI\Inject("claroline.serializer.open_badge.badge"),
     *     "userSerializer"  = @DI\Inject("claroline.serializer.user")
     * })
     *
     * @param Router $router
     */
    public function __construct(UserSerializer $userSerializer, BadgeClassSerializer $badgeSerializer)
    {
        $this->userSerializer = $userSerializer;
        $this->badgeSerializer = $badgeSerializer;
    }

    /**
     * Serializes a Assertion entity.
     *
     * @param Assertion $assertion
     * @param array     $options
     *
     * @return array
     */
    public function serialize(Assertion $assertion, array $options = [])
    {
        return [
          'id' => $assertion->getUuid(),
          'user' => $this->userSerializer->serialize($assertion->getRecipient()),
          'badge' => $this->badgeSerializer->serialize($assertion->getBadge()),
          'meta' => $this->serializeMeta($assertion),
        ];
    }

    public function serializeMeta(Assertion $assertion, array $options = [])
    {
    }

    public function getClass()
    {
        return Assertion::class;
    }
}
