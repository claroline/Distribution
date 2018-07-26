<?php

namespace Claroline\TeamBundle\Serializer;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\Resource\ResourceNodeSerializer;
use Claroline\CoreBundle\API\Serializer\User\RoleSerializer;
use Claroline\CoreBundle\API\Serializer\User\UserSerializer;
use Claroline\CoreBundle\API\Serializer\Workspace\WorkspaceSerializer;
use Claroline\CoreBundle\Manager\ResourceManager;
use Claroline\CoreBundle\Repository\ResourceNodeRepository;
use Claroline\CoreBundle\Repository\RoleRepository;
use Claroline\CoreBundle\Repository\UserRepository;
use Claroline\CoreBundle\Repository\WorkspaceRepository;
use Claroline\TeamBundle\Entity\Team;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.team")
 * @DI\Tag("claroline.serializer")
 */
class TeamSerializer
{
    use SerializerTrait;

    /** @var ResourceManager */
    private $resourceManager;
    /** @var ResourceNodeSerializer */
    private $resourceNodeSerializer;
    /** @var RoleSerializer */
    private $roleSerializer;
    /** @var UserSerializer */
    private $userSerializer;
    /** @var WorkspaceSerializer */
    private $workspaceSerializer;

    /** @var ResourceNodeRepository */
    private $resourceNodeRepo;
    /** @var RoleRepository */
    private $roleRepo;
    /** @var UserRepository */
    private $userRepo;
    /** @var WorkspaceRepository */
    private $workspaceRepo;

    /**
     * TeamSerializer constructor.
     *
     * @DI\InjectParams({
     *     "om"                     = @DI\Inject("claroline.persistence.object_manager"),
     *     "resourceManager"        = @DI\Inject("claroline.manager.resource_manager"),
     *     "resourceNodeSerializer" = @DI\Inject("claroline.serializer.resource_node"),
     *     "roleSerializer"         = @DI\Inject("claroline.serializer.role"),
     *     "userSerializer"         = @DI\Inject("claroline.serializer.user"),
     *     "workspaceSerializer"    = @DI\Inject("claroline.serializer.workspace")
     * })
     *
     * @param ObjectManager          $om
     * @param ResourceManager        $resourceManager
     * @param ResourceNodeSerializer $resourceNodeSerializer
     * @param RoleSerializer         $roleSerializer
     * @param UserSerializer         $userSerializer
     * @param WorkspaceSerializer    $workspaceSerializer
     */
    public function __construct(
        ObjectManager $om,
        ResourceManager $resourceManager,
        ResourceNodeSerializer $resourceNodeSerializer,
        RoleSerializer $roleSerializer,
        UserSerializer $userSerializer,
        WorkspaceSerializer $workspaceSerializer
    ) {
        $this->resourceManager = $resourceManager;
        $this->resourceNodeSerializer = $resourceNodeSerializer;
        $this->roleSerializer = $roleSerializer;
        $this->userSerializer = $userSerializer;
        $this->workspaceSerializer = $workspaceSerializer;

        $this->resourceNodeRepo = $om->getRepository('Claroline\CoreBundle\Entity\Resource\ResourceNode');
        $this->roleRepo = $om->getRepository('Claroline\CoreBundle\Entity\Role');
        $this->userRepo = $om->getRepository('Claroline\CoreBundle\Entity\User');
        $this->workspaceRepo = $om->getRepository('Claroline\CoreBundle\Entity\Workspace\Workspace');
    }

    /**
     * @param Team $team
     *
     * @return array
     */
    public function serialize(Team $team)
    {
        return [
            'id' => $team->getUuid(),
            'name' => $team->getName(),
            'description' => $team->getDescription(),
            'workspace' => $this->workspaceSerializer->serialize($team->getWorkspace(), [Options::SERIALIZE_MINIMAL]),
            'role' => $team->getRole() ?
                $this->roleSerializer->serialize($team->getRole()) :
                null,
            'teamManager' => $team->getTeamManager() ?
                $this->userSerializer->serialize($team->getTeamManager(), [Options::SERIALIZE_MINIMAL]) :
                null,
            'teamManagerRole' => $team->getTeamManagerRole() ?
                $this->roleSerializer->serialize($team->getTeamManagerRole(), [Options::SERIALIZE_MINIMAL]) :
                null,
            'maxUsers' => $team->getMaxUsers(),
            'selfRegistration' => $team->isSelfRegistration(),
            'selfUnregistration' => $team->isSelfUnregistration(),
            'directory' => $team->getDirectory() ?
                $this->resourceNodeSerializer->serialize($team->getDirectory()->getResourceNode(), [Options::SERIALIZE_MINIMAL]) :
                null,
            'publicDirectory' => $team->isPublic(),
        ];
    }

    /**
     * @param array $data
     * @param Team  $team
     *
     * @return Team
     */
    public function deserialize($data, Team $team)
    {
        $this->sipe('id', 'setUuid', $data, $team);
        $this->sipe('name', 'setName', $data, $team);
        $this->sipe('description', 'setDescription', $data, $team);
        $this->sipe('selfRegistration', 'setSelfRegistration', $data, $team);
        $this->sipe('selfUnregistration', 'setSelfUnregistration', $data, $team);
        $this->sipe('publicDirectory', 'setIsPublic', $data, $team);
        $this->sipe('maxUsers', 'setMaxUsers', $data, $team);

        if (isset($data['workspace']['uuid'])) {
            $workspace = $this->workspaceRepo->findOneBy(['uuid' => $data['workspace']['uuid']]);

            if ($workspace) {
                $team->setWorkspace($workspace);
            }
        }
        // Sets team manager
        $teamManager = isset($data['teamManager']['id']) ?
            $this->userRepo->findOneBy(['uuid' => $data['teamManager']['id']]) :
            null;
        $team->setTeamManager($teamManager);

        // Sets roles for team members and team manager
        $teamRole = isset($data['role']['id']) ?
            $this->roleRepo->findOneBy(['uuid' => $data['role']['id']]) :
            null;
        $team->setRole($teamRole);
        $teamManagerRole = isset($data['teamManagerRole']['id']) ?
            $this->roleRepo->findOneBy(['uuid' => $data['teamManagerRole']['id']]) :
            null;
        $team->setTeamManagerRole($teamManagerRole);

        // Sets team directory
        $directory = null;

        if (isset($data['directory']['id'])) {
            $node = $this->resourceNodeRepo->findOneBy(['uuid' => $data['directory']['id']]);

            if (!empty($node)) {
                $directory = $this->resourceManager->getResourceFromNode($node);
            }
        }
        $team->setDirectory($directory);

        return $team;
    }
}
