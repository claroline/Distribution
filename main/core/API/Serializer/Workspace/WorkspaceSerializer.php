<?php

namespace Claroline\CoreBundle\API\Serializer\Workspace;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Group;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Library\Normalizer\DateRangeNormalizer;
use Claroline\CoreBundle\Library\Utilities\ClaroUtilities;
use Claroline\CoreBundle\Manager\WorkspaceManager;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.workspace")
 * @DI\Tag("claroline.serializer")
 */
class WorkspaceSerializer
{
    use SerializerTrait;

    /** @var ObjectManager */
    private $om;

    /** @var WorkspaceManager */
    private $workspaceManager;

    /** @var SerializerProvider */
    private $serializer;

    /** @var ClaroUtilities */
    private $utilities;

    /**
     * WorkspaceSerializer constructor.
     *
     * @DI\InjectParams({
     *     "om"               = @DI\Inject("claroline.persistence.object_manager"),
     *     "workspaceManager" = @DI\Inject("claroline.manager.workspace_manager"),
     *     "serializer"       = @DI\Inject("claroline.api.serializer"),
     *     "utilities"        = @DI\Inject("claroline.utilities.misc")
     * })
     *
     * @param ObjectManager      $om
     * @param WorkspaceManager   $workspaceManager
     * @param SerializerProvider $serializer
     * @param ClaroUtilities     $utilities
     */
    public function __construct(
        ObjectManager $om,
        WorkspaceManager $workspaceManager,
        SerializerProvider $serializer,
        ClaroUtilities $utilities)
    {
        $this->om = $om;
        $this->workspaceManager = $workspaceManager;
        $this->serializer = $serializer;
        $this->utilities = $utilities;
    }

    /**
     * @return string
     */
    public function getSchema()
    {
        return '#/main/core/workspace.json';
    }

    /**
     * @return string
     */
    public function getSamples()
    {
        return '#/main/core/workspace';
    }

    /**
     * Serializes a Workspace entity for the JSON api.
     *
     * @param Workspace $workspace - the workspace to serialize
     * @param array     $options   - a list of serialization options
     *
     * @return array - the serialized representation of the workspace
     */
    public function serialize(Workspace $workspace, array $options = [])
    {
        $serialized = [
            'id' => $workspace->getId(),
            'uuid' => $workspace->getGuid(), // todo: should be merged with `id`
            'name' => $workspace->getName(),
            'code' => $workspace->getCode(),
            'thumbnail' => $workspace->getThumbnail() ? $this->serializer->serialize($workspace->getThumbnail()) : null,
        ];

        if (!in_array(Options::SERIALIZE_MINIMAL, $options)) {
            $serialized = array_merge($serialized, [
                'meta' => $this->getMeta($workspace),
                'opening' => $this->getOpening($workspace),
                'display' => $this->getDisplay($workspace),
                'restrictions' => $this->getRestrictions($workspace),
                'registration' => $this->getRegistration($workspace),
                'notifications' => $this->getNotifications($workspace),
                'roles' => array_map(function (Role $role) {
                    return [
                        'id' => $role->getUuid(),
                        'name' => $role->getName(),
                        'translationKey' => $role->getTranslationKey(),
                    ];
                }, $workspace->getRoles()->toArray()),
                'managers' => array_map(function (User $manager) {
                    return $this->serializer->serialize($manager, [Options::SERIALIZE_MINIMAL]);
                }, $this->workspaceManager->getManagers($workspace)),
                'organizations' => array_map(function ($organization) {
                    return $this->serializer->serialize($organization);
                }, $workspace->getOrganizations()->toArray()),
            ]);
        }

        // maybe do the same for users one day
        if (in_array(Options::WORKSPACE_FETCH_GROUPS, $options)) {
            $groups = $this->om
                ->getRepository('Claroline\CoreBundle\Entity\Group')
                ->findByWorkspace($workspace);

            $serialized['groups'] = array_map(function (Group $group) {
                return $this->serializer->serialize($group, [Options::SERIALIZE_MINIMAL]);
            }, $groups);
        }

        return $serialized;
    }

    /**
     * @param Workspace $workspace
     *
     * @return array
     */
    private function getMeta(Workspace $workspace)
    {
        return [
            'slug' => $workspace->getSlug(),
            'model' => $workspace->isModel(),
            'personal' => $workspace->isPersonal(),
            'description' => $workspace->getDescription(),
            'created' => $workspace->getCreated()->format('Y-m-d\TH:i:s'),
            'creator' => $workspace->getCreator() ? $this->serializer->serialize($workspace->getCreator(), [Options::SERIALIZE_MINIMAL]) : null,
            'usedStorage' => $this->workspaceManager->getUsedStorage($workspace),
            'totalUsers' => $this->workspaceManager->countUsers($workspace, true),
            'totalResources' => $this->workspaceManager->countResources($workspace),
        ];
    }

    private function getOpening(Workspace $workspace)
    {
        // todo implement

        return [
            'type' => 'tool',
            'target' => 'home',
        ];
    }

    /**
     * @param Workspace $workspace
     *
     * @return array
     */
    private function getDisplay(Workspace $workspace)
    {
        $options = $this->workspaceManager->getWorkspaceOptions($workspace)->getDetails();

        $openResource = null;
        if (isset($options['workspace_opening_resource']) && $options['workspace_opening_resource']) {
            $resource = $this->om
                ->getRepository('Claroline\CoreBundle\Entity\Resource\ResourceNode')
                ->findOneBy(['id' => $options['workspace_opening_resource']]);

            if (!empty($resource)) {
                $openResource = $this->serializer->serialize($resource);
            }
        }

        return [
            'showTools' => !isset($options['hide_tools_menu']) || !$options['hide_tools_menu'],
            'showBreadcrumbs' => !isset($options['hide_breadcrumb']) || !$options['hide_breadcrumb'],
            'openResource' => $openResource,
        ];
    }

    /**
     * @param Workspace $workspace
     *
     * @return array
     */
    private function getRestrictions(Workspace $workspace)
    {
        return [
            'hidden' => $workspace->isHidden(),
            'dates' => DateRangeNormalizer::normalize(
                $workspace->getStartDate(),
                $workspace->getEndDate()
            ),
            'maxUsers' => $workspace->getMaxUsers(),
            // TODO : store raw file size to avoid this
            'maxStorage' => $this->utilities->getRealFileSize($workspace->getMaxStorageSize()),
            'maxResources' => $workspace->getMaxUploadResources(),
        ];
    }

    /**
     * @param Workspace $workspace
     *
     * @return array
     */
    private function getRegistration(Workspace $workspace)
    {
        return [
            'validation' => $workspace->getRegistrationValidation(),
            'selfRegistration' => $workspace->getSelfRegistration(),
            'selfUnregistration' => $workspace->getSelfUnregistration(),
            'defaultRole' => $workspace->getDefaultRole() ?
              $this->serializer->serialize($workspace->getDefaultRole(), [Options::SERIALIZE_MINIMAL]) :
              null,
        ];
    }

    private function getNotifications(Workspace $workspace)
    {
        return [
            'enabled' => !$workspace->isDisabledNotifications(),
        ];
    }

    /**
     * Deserializes Workspace data into entities.
     *
     * @param array     $data
     * @param Workspace $workspace
     * @param array     $options
     *
     * @return Workspace
     */
    public function deserialize(array $data, Workspace $workspace, array $options = [])
    {
        if (isset($data['thumbnail']) && isset($data['thumbnail']['id'])) {
            $thumbnail = $this->serializer->deserialize(
                'Claroline\CoreBundle\Entity\File\PublicFile',
                $data['thumbnail']
            );
            $workspace->setThumbnail($thumbnail);
        }

        if (isset($data['registration']) && isset($data['registration']['defaultRole'])) {
            $defaultRole = $this->serializer->deserialize(
                'Claroline\CoreBundle\Entity\Role',
                $data['registration']['defaultRole']
            );
            $workspace->setDefaultRole($defaultRole);
        }

        $this->sipe('uuid', 'setUuid', $data, $workspace);
        $this->sipe('code', 'setCode', $data, $workspace);
        $this->sipe('name', 'setName', $data, $workspace);

        $this->sipe('meta.model', 'setIsModel', $data, $workspace);
        $this->sipe('meta.description', 'setDescription', $data, $workspace);

        $this->sipe('notifications.enabled', 'setNotifications', $data, $workspace);

        $this->sipe('restrictions.hidden', 'setHidden', $data, $workspace);
        $this->sipe('restrictions.maxUsers', 'setMaxUsers', $data, $workspace);
        $this->sipe('restrictions.maxResources', 'setMaxUploadResources', $data, $workspace);
        $this->sipe('registration.validation', 'setRegistrationValidation', $data, $workspace);
        $this->sipe('registration.selfRegistration', 'setSelfRegistration', $data, $workspace);
        $this->sipe('registration.selfUnregistration', 'setSelfUnregistration', $data, $workspace);

        if (!empty($data['restrictions'])) {
            // TODO : store raw file size to avoid this
            if (isset($data['restrictions']['maxStorage'])) {
                $workspace->setMaxStorageSize(
                    $this->utilities->formatFileSize($data['restrictions']['maxStorage'])
                );
            }

            if (isset($data['restrictions']['dates'])) {
                $dateRange = DateRangeNormalizer::denormalize($data['restrictions']['dates']);

                $workspace->setStartDate($dateRange[0]);
                $workspace->setEndDate($dateRange[1]);
            }
        }

        if (isset($data['display'])) {
            $workspaceOptions = $this->workspaceManager->getWorkspaceOptions($workspace);
            $workspaceOptions->setDetails([
                'hide_tools_menu' => !$data['display']['showTools'],
                'hide_breadcrumb' => !$data['display']['showBreadcrumbs'],
                'use_workspace_opening_resource' => !empty($data['display']['openResource']),
                'workspace_opening_resource' => !empty($data['display']['openResource']) ? !empty($data['display']['openResource']['autoId']) : null,
            ]);
        }

        return $workspace;
    }
}
