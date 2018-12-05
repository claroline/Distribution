<?php

namespace Claroline\OpenBadgeBundle\Serializer;

use Claroline\CoreBundle\Entity\Organization\Organization;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Routing\RouterInterface;

/**
 * @DI\Service("claroline.serializer.open_badge.profile")
 */
class ProfileSerializer
{
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

    public function serialize($profile)
    {
        $data = [
          'type' => 'Profile',
          'id' => $this->router->generate('apiv2_open_badge__profile', ['profile' => $profile->getUuid()]),
          'email' => $profile->getEmail(),
        ];

        if ($profile instanceof Organization) {
            $data['name'] = $profile->getName();
        } else {
            $data['name'] = $profile->getUsername();
        }

        return $data;
    }
}
