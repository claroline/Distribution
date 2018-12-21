<?php

namespace Claroline\OpenBadgeBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\OpenBadgeBundle\Entity\Assertion;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Routing\RouterInterface;

/**
 * @DI\Service("claroline.serializer.open_badge.verification_object")
 */
class VerificationObjectSerializer
{
    use SerializerTrait;

    /**
     * @DI\InjectParams({
     *     "router" = @DI\Inject("router")
     * })
     *
     * @param Router $router
     */
    public function __construct(RouterInterface $router)
    {
        $this->router = $router;
    }

    public function getClass()
    {
        return self::class;
    }

    public function serialize(Assertion $assertion)
    {
        return [
            'type' => 'HostedBadge',
            //'id' => $this->router->generate('apiv2_open_badge__assertion', ['assertion' => $assertion->getUuid()], UrlGeneratorInterface::ABSOLUTE_URL),
        ];
    }
}
