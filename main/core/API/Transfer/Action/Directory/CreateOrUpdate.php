<?php

namespace Claroline\CoreBundle\API\Transfer\Action\Directory;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\API\Transfer\Action\AbstractAction;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\Directory;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Resource\ResourceType;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * @DI\Service()
 * @DI\Tag("claroline.transfer.action")
 */
class CreateOrUpdate extends AbstractAction
{
    /** @var Crud */
    private $crud;

    /**
     * Action constructor.
     *
     * @DI\InjectParams({
     *     "crud"       = @DI\Inject("claroline.api.crud"),
     *     "om"         = @DI\Inject("claroline.persistence.object_manager"),
     *     "serializer" = @DI\Inject("claroline.api.serializer"),
     *     "translator" = @DI\Inject("translator")
     * })
     *
     * @param Crud $crud
     */
    public function __construct(Crud $crud, ObjectManager $om, SerializerProvider $serializer, TranslatorInterface $translator)
    {
        $this->crud = $crud;
        $this->om = $om;
        $this->serializer = $serializer;
        $this->translator = $translator;
    }

    /**
     * @param array $data
     */
    public function execute(array $data, &$successData = [])
    {
        //todo find a generic way to find the identifiers
        $workspace = $this->om->getObject($data['workspace'], Workspace::class, ['code']);
        $parent = $this->om->getRepository(ResourceNode::class)->findOneBy(['workspace' => $workspace, 'parent' => null]);

        if (!$workspace) {
            throw new \Exception('Workspace '.$this->printError($data['workspace'])." doesn't exists.");
        }

        $options = [Options::IGNORE_CRUD_POST_EVENT];

        $permissions = [
          'open' => isset($data['open']) ? $data['open'] : false,
          'edit' => isset($data['edit']) ? $data['edit'] : false,
          'delete' => isset($data['delete']) ? $data['delete'] : false,
          'administrate' => isset($data['administrate']) ? $data['administrate'] : false,
          'export' => isset($data['export']) ? $data['export'] : false,
          'copy' => isset($data['copy']) ? $data['copy'] : false,
        ];

        if (isset($data['user']) || isset($data['role'])) {
            if (isset($data['user'])) {
                $user = $this->om->getRepository(User::class)->findOneByUsername($data['user']);

                foreach ($user->getEntityRoles() as $role) {
                    if (Role::USER_ROLE === $role->getType()) {
                        $roles[] = $role;
                    }
                }
            } else {
                $roles[] = $this->om->getRepository(Role::class)->findOneBy(['workspace' => $workspace, 'translationKey' => $data['role']]);
            }
        } else {
            $roles[] = $workspace->getDefaultRole();
        }

        if (isset($data['create'])) {
            $create = explode(',', $data['create']);
            $create = array_map(function ($type) {
                return trim($type);
            }, $create);

            $permissions['create'] = $create;
        }

        foreach ($roles as $role) {
            $rights[] = [
              'permissions' => $permissions,
              'name' => $role->getName(),
              'translationKey' => $role->getTranslationKey(),
          ];
        }

        $dataResourceNode = [
          'name' => $data['name'],
          'meta' => [
            'published' => true,
            'type' => 'directory',
          ],
          'rights' => $rights,
        ];

        if (isset($data['directory'])) {
            $parent = $this->om->getRepository(ResourceNode::class)->findOneByUuid($data['directory']['id']);
        }
        /** @var ResourceNode $resourceNode */

        //search for the node if it exists
        $resourceNode = $this->om->getRepository(ResourceNode::class)->findOneBy(['name' => $dataResourceNode['name'], 'parent' => $parent]);

        if ($resourceNode) {
            $resourceNode = $this->serializer->deserialize($dataResourceNode, $resourceNode, []);
        } else {
            $resourceNode = $this->crud->create(ResourceNode::class, $dataResourceNode, $options);
            $resource = $this->crud->create(Directory::class, [], $options);
            $resource->setResourceNode($resourceNode);
            $resourceNode->setParent($parent);
            $resourceNode->setWorkspace($parent->getWorkspace());
            $this->om->persist($resource);
        }

        $this->om->persist($resourceNode);
    }

    /**
     * @return array
     */
    public function getSchema(array $options = [], array $extra = [])
    {
        $types = array_map(function (ResourceType $type) {
            return $type->getName();
        }, $this->om->getRepository(ResourceType::class)->findAll());
        $types = implode(', ', $types);

        $directory = [
          '$schema' => 'http:\/\/json-schema.org\/draft-04\/schema#',
          'type' => 'object',
          'properties' => [
            'name' => [
              'type' => 'string',
              'description' => $this->translator->trans('transfer_directory_name', [], 'platform'),
            ],
            'open' => [
              'type' => 'boolean',
              'description' => $this->translator->trans('transfer_directory_open', [], 'platform'),
            ],
            'delete' => [
              'type' => 'boolean',
              'description' => $this->translator->trans('transfer_directory_delete', [], 'platform'),
            ],
            'edit' => [
              'type' => 'boolean',
              'description' => $this->translator->trans('transfer_directory_edit', [], 'platform'),
            ],
            'copy' => [
              'type' => 'boolean',
              'description' => $this->translator->trans('transfer_directory_copy', [], 'platform'),
            ],
            'export' => [
              'type' => 'boolean',
              'description' => $this->translator->trans('transfer_directory_export', [], 'platform'),
            ],
            'administrate' => [
              'type' => 'boolean',
              'description' => $this->translator->trans('transfer_directory_administrate', [], 'platform'),
            ],
            'user' => [
              'type' => 'string',
              'description' => $this->translator->trans('transfer_directory_user', [], 'platform'),
            ],
            'role' => [
              'type' => 'string',
              'description' => $this->translator->trans('transfer_directory_role', [], 'platform'),
            ],
            'create' => [
              'type' => 'string',
              'description' => $this->translator->trans('transfer_directory_creation', ['%types%' => $types], 'platform'),
            ],
          ],

          //this kind of hacky because this is not the true permissions description to begin with
          //if you remove this section it will not show because it'll go through the explainIdentifiers method (not $root in schema)
          'claroline' => [
            'requiredAtCreation' => ['name'],
            'class' => Directory::class,
          ],
        ];

        if (!in_array(Options::WORKSPACE_IMPORT, $options)) {
            $directory['properties']['workspace'] = [
              'type' => 'string',
              'description' => 'The workspace code',
            ];
            $directory['claroline']['requiredAtCreation'][] = 'workspace';
        }

        $schema = [
          '$root' => json_decode(json_encode($directory)),
        ];

        return $schema;
    }

    public function getExtraDefinition(array $options = [], array $extra = [])
    {
        $root = $this->serializer->serialize($this->om->getRepository(ResourceNode::class)->findOneBy(['parent' => null, 'workspace' => $extra['workspace']['id']]));

        return ['fields' => [
          [
            'name' => 'directory',
            'type' => 'resource',
            'required' => false,
            'label' => 'root',
            'options' => ['picker' => [
              'filters' => [
                ['property' => 'workspace', 'value' => $extra['workspace']['uuid'], 'locked' => true],
                ['property' => 'resourceType', 'value' => 'directory', 'locked' => true],
              ],
              'current' => $root,
              'root' => $root,
            ]],
          ],
        ]];
    }

    public function supports($format, array $options = [], array $extra = [])
    {
        if (!in_array(Options::WORKSPACE_IMPORT, $options)) {
            return false;
        }

        return in_array($format, ['json', 'csv']);
    }

    /**
     * @return array
     */
    public function getAction()
    {
        return ['directory', 'create_or_update'];
    }

    public function getBatchSize()
    {
        return 100;
    }

    public function getMode()
    {
        return self::MODE_CREATE;
    }

    public function clear(ObjectManager $om)
    {
    }
}
