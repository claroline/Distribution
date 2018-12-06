<?php

namespace Claroline\OpenBadgeBundle\Serializer;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Organization\Organization;
use Claroline\CoreBundle\Entity\User;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Routing\RouterInterface;

/**
 * @DI\Service("claroline.serializer.open_badge.profile")
 */
class ProfileSerializer
{
    /**
     * @DI\InjectParams({
     *     "router" = @DI\Inject("router"),
     *     "om"     = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param Router $router
     */
    public function __construct(RouterInterface $router, ObjectManager $om)
    {
        $this->router = $router;
        $this->om = $om;
    }

    public function serialize($el)
    {
        if (is_string($el)) {
            $profile = $this->om->getRepository(User::class)->findOneByUuid($el);

            if (!$profile) {
                $profile = $this->om->getRepository(Organization::class)->findOneByUuid($el);
            }
        } else {
            $profile = $el;
        }

        $data = [
          'type' => 'Profile',
          'id' => $this->router->generate('apiv2_open_badge__profile', ['profile' => $profile->getUuid()], UrlGeneratorInterface::ABSOLUTE_URL),
          'email' => $profile->getEmail(),
        ];

        if ($profile instanceof Organization) {
            $data['name'] = $profile->getName();
            $data['url'] = $this->router->generate(
              'claro_index',
              [],
              UrlGeneratorInterface::ABSOLUTE_URL
            );
        } else {
            $data['name'] = $profile->getUsername();
            $data['url'] = $this->router->generate(
              'claro_user_profile',
              ['user' => $profile->getPublicUrl()],
              UrlGeneratorInterface::ABSOLUTE_URL
            );
        }

        return $data;
    }
}
