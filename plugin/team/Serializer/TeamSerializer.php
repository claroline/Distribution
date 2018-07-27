<?php

namespace Claroline\TeamBundle\Serializer;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\Resource\ResourceNodeSerializer;
use Claroline\CoreBundle\API\Serializer\User\UserSerializer;
use Claroline\CoreBundle\API\Serializer\Workspace\WorkspaceSerializer;
use Claroline\CoreBundle\Manager\ResourceManager;
use Claroline\CoreBundle\Repository\ResourceNodeRepository;
use Claroline\CoreBundle\Repository\UserRepository;
use Claroline\CoreBundle\Repository\WorkspaceRepository;
use Claroline\TeamBundle\Entity\Team;
use Claroline\TeamBundle\Manager\TeamManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;

/**
 * @DI\Service("claroline.serializer.team")
 * @DI\Tag("claroline.serializer")
 */
class TeamSerializer
{
    use SerializerTrait;

    /** @var ObjectManager */
    private $om;
    /** @var ResourceManager */
    private $resourceManager;
    /** @var TeamManager */
    private $teamManager;
    /** @var TokenStorage */
    private $tokenStorage;

    /** @var ResourceNodeSerializer */
    private $resourceNodeSerializer;
    /** @var UserSerializer */
    private $userSerializer;
    /** @var WorkspaceSerializer */
    private $workspaceSerializer;

    /** @var ResourceNodeRepository */
    private $resourceNodeRepo;
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
     *     "teamManager"            = @DI\Inject("claroline.manager.team_manager"),
     *     "tokenStorage"           = @DI\Inject("security.token_storage"),
     *     "resourceNodeSerializer" = @DI\Inject("claroline.serializer.resource_node"),
     *     "userSerializer"         = @DI\Inject("claroline.serializer.user"),
     *     "workspaceSerializer"    = @DI\Inject("claroline.serializer.workspace")
     * })
     *
     * @param ObjectManager          $om
     * @param ResourceManager        $resourceManager
     * @param TeamManager            $teamManager
     * @param TokenStorage           $tokenStorage
     * @param ResourceNodeSerializer $resourceNodeSerializer
     * @param UserSerializer         $userSerializer
     * @param WorkspaceSerializer    $workspaceSerializer
     */
    public function __construct(
        ObjectManager $om,
        ResourceManager $resourceManager,
        TeamManager $teamManager,
        TokenStorage $tokenStorage,
        ResourceNodeSerializer $resourceNodeSerializer,
        UserSerializer $userSerializer,
        WorkspaceSerializer $workspaceSerializer
    ) {
        $this->om = $om;
        $this->resourceManager = $resourceManager;
        $this->teamManager = $teamManager;
        $this->tokenStorage = $tokenStorage;
        $this->resourceNodeSerializer = $resourceNodeSerializer;
        $this->userSerializer = $userSerializer;
        $this->workspaceSerializer = $workspaceSerializer;

        $this->resourceNodeRepo = $om->getRepository('Claroline\CoreBundle\Entity\Resource\ResourceNode');
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
            'teamManager' => $team->getTeamManager() ?
                $this->userSerializer->serialize($team->getTeamManager(), [Options::SERIALIZE_MINIMAL]) :
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
        $this->om->startFlushSuite();

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

        // Checks and creates role for team members & team manager if needed.
        $teamRole = $team->getRole();
        $teamManagerRole = $team->getTeamManagerRole();

        if (empty($teamRole)) {
            $teamRole = $this->teamManager->createTeamRole($team);
            $team->setRole($teamRole);
        }
        if (empty($teamManagerRole)) {
            $teamManagerRole = $this->teamManager->createTeamRole($team, true);
            $team->setTeamManagerRole($teamManagerRole);
        }

        // Checks and creates team directory
        $directory = $team->getDirectory();
        $user = $this->tokenStorage->getToken()->getUser();

        if (empty($directory) && 'anon.' !== $user) {
            $defaultResource = isset($data['defaultResource']['id']) ?
                $this->resourceNodeRepo->findOneBy(['uuid' => $data['defaultResource']['id']]) :
                null;
            $directory = $this->teamManager->createTeamDirectory(
                $team,
                $user,
                $defaultResource
            );
            $team->setDirectory($directory);
        }

        $this->om->persist($team);
        $this->om->endFlushSuite();

        return $team;
    }
}
