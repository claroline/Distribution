<?php

namespace Claroline\CoreBundle\Listener\Administration;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\CoreBundle\API\Serializer\ParametersSerializer;
use Claroline\CoreBundle\API\Serializer\User\ProfileSerializer;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Event\OpenAdministrationToolEvent;
use Claroline\CoreBundle\Manager\ResourceManager;
use Claroline\CoreBundle\Manager\UserManager;

/**
 * Community administration tool.
 * Manages Users, Groups, Roles, Organizations, Locations, Profile, Parameters.
 */
class CommunityListener
{
    /** @var FinderProvider */
    private $finder;

    /** @var ParametersSerializer */
    private $parametersSerializer;

    /** @var ProfileSerializer */
    private $profileSerializer;

    /** @var ResourceManager */
    private $resourceManager;

    /** @var UserManager */
    private $userManager;

    /**
     * CommunityListener constructor.
     *
     * @param FinderProvider       $finder
     * @param ParametersSerializer $parametersSerializer
     * @param ProfileSerializer    $profileSerializer
     * @param ResourceManager      $resourceManager
     * @param UserManager          $userManager
     */
    public function __construct(
        FinderProvider $finder,
        ParametersSerializer $parametersSerializer,
        ProfileSerializer $profileSerializer,
        ResourceManager $resourceManager,
        UserManager $userManager
    ) {
        $this->finder = $finder;
        $this->parametersSerializer = $parametersSerializer;
        $this->profileSerializer = $profileSerializer;
        $this->resourceManager = $resourceManager;
        $this->userManager = $userManager;
    }

    /**
     * Displays user administration tool.
     *
     * @param OpenAdministrationToolEvent $event
     */
    public function onDisplayTool(OpenAdministrationToolEvent $event)
    {
        $event->setData([
            // todo : put it in the async load of form
            'parameters' => $this->parametersSerializer->serialize(),
            'profile' => $this->profileSerializer->serialize(),
            'platformRoles' => $this->finder->search('Claroline\CoreBundle\Entity\Role', [
                'filters' => ['type' => Role::PLATFORM_ROLE],
            ]),
        ]);
        $event->stopPropagation();
    }
}
