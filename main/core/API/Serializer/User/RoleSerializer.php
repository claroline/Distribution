<?php

namespace Claroline\CoreBundle\API\Serializer\User;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\Tool\AdminTool;
use Claroline\CoreBundle\Repository\UserRepository;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.role")
 * @DI\Tag("claroline.serializer")
 */
class RoleSerializer
{
    use SerializerTrait;

    /** @var SerializerProvider */
    private $serializer;

    /** @var ObjectManager */
    private $om;

    /** @var UserRepository */
    private $userRepo;

    /**
     * RoleSerializer constructor.
     *
     * @DI\InjectParams({
     *     "serializer" = @DI\Inject("claroline.api.serializer"),
     *     "om"         = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param SerializerProvider $serializer
     * @param ObjectManager      $om
     */
    public function __construct(SerializerProvider $serializer, ObjectManager $om)
    {
        $this->serializer = $serializer;
        $this->om = $om;

        $this->userRepo = $this->om->getRepository('ClarolineCoreBundle:User');
    }

    /**
     * @return string
     */
    public function getClass()
    {
        return Role::class;
    }

    /**
     * @return string
     */
    public function getSchema()
    {
        return '#/main/core/role.json';
    }

    /**
     * Serializes a Role entity.
     *
     * @param Role  $role
     * @param array $options
     *
     * @return array
     */
    public function serialize(Role $role, array $options = [])
    {
        $serialized = [
            'id' => $role->getUuid(),
            'name' => $role->getName(),
            'type' => $role->getType(), // TODO : should be a string for better data readability
            'translationKey' => $role->getTranslationKey(),
        ];

        if (!in_array(Options::SERIALIZE_MINIMAL, $options)) {
            $serialized['meta'] = $this->serializeMeta($role, $options);
            $serialized['restrictions'] = $this->serializeRestrictions($role);

            if ($workspace = $role->getWorkspace()) {
                $serialized['workspace'] = $this->serializer->serialize($workspace, [Options::SERIALIZE_MINIMAL]);
            }

            if (Role::USER_ROLE === $role->getType()) {
                $serialized['user'] = $this->serializer->serialize($role->getUsers()->toArray()[0], [Options::SERIALIZE_MINIMAL]);
            }

            // easier request than count users which will go into mysql cache so I'm not too worried about looping here.
            $adminTools = [];

            /** @var AdminTool $adminTool */
            foreach ($this->om->getRepository('ClarolineCoreBundle:Tool\AdminTool')->findAll() as $adminTool) {
                $adminTools[$adminTool->getName()] = $role->getAdminTools()->contains($adminTool);
            }

            $serialized['adminTools'] = $adminTools;
        }

        return $serialized;
    }

    /**
     * Serialize role metadata.
     *
     * @param Role  $role
     * @param array $options
     *
     * @return array
     */
    public function serializeMeta(Role $role, array $options)
    {
        $meta = [
           'readOnly' => $role->isReadOnly(),
           'personalWorkspaceCreationEnabled' => $role->getPersonalWorkspaceCreationEnabled(),
       ];

        if (in_array(Options::SERIALIZE_COUNT_USER, $options)) {
            if (Role::USER_ROLE !== $role->getType()) {
                $meta['users'] = $this->userRepo->countUsersByRoleIncludingGroup($role);
            } else {
                $meta['users'] = 1;
            }
        }

        return $meta;
    }

    /**
     * Serialize role restrictions.
     *
     * @param Role $role
     *
     * @return array
     */
    public function serializeRestrictions(Role $role)
    {
        return [
            'maxUsers' => $role->getMaxUsers(),
        ];
    }

    /**
     * Deserializes data into a Role entity.
     *
     * @param \stdClass $data
     * @param Role      $role
     *
     * @return Role
     */
    public function deserialize($data, Role $role)
    {
        // TODO : set readOnly based on role type
        $this->sipe('name', 'setName', $data, $role);

        if (isset($data['translationKey'])) {
            $role->setTranslationKey($data['translationKey']);
            //this is if it's not a workspace and we send the translationKey role
            if (null === $role->getName() && !isset($data['workspace'])) {
                $role->setName('ROLE_'.str_replace(' ', '_', strtoupper($data['translationKey'])));
            }
        }

        $this->sipe('meta.personalWorkspaceCreationEnabled', 'setPersonalWorkspaceCreationEnabled', $data, $role);
        $this->sipe('restrictions.maxUsers', 'setMaxUsers', $data, $role);
        $this->sipe('type', 'setType', $data, $role);

        // we should test role type before trying to set the workspace
        if (!empty($data['workspace']) && !empty($data['workspace']['uuid'])) {
            if (isset($data['workspace']['uuid'])) {
                $workspace = $this->om->getRepository('ClarolineCoreBundle:Workspace\Workspace')
                    ->findOneBy(['uuid' => $data['workspace']['uuid']]);

                if ($workspace) {
                    $role->setWorkspace($workspace);

                    //this is if it's a workspace and we send the translationKey role
                    if (isset($data['translationKey']) && (null === $role->getName())) {
                        $role->setName('ROLE_WS_'.str_replace(' ', '_', strtoupper($data['translationKey'])).'_'.$workspace->getUuid());
                    }
                }
            }
        }

        // TODO : set the user for ROLE_USER

        if (isset($data['adminTools'])) {
            $adminTools = $this->om->getRepository('ClarolineCoreBundle:Tool\AdminTool')->findAll();

            /** @var AdminTool $adminTool */
            foreach ($adminTools as $adminTool) {
                if ($data['adminTools'][$adminTool->getName()]) {
                    $adminTool->addRole($role);
                } else {
                    $adminTool->removeRole($role);
                }
            }
        }

        return $role;
    }
}
