<?php

namespace Claroline\CoreBundle\API\Transfer\Action\Directory;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\API\Transfer\Action\AbstractAction;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\Directory;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service()
 * @DI\Tag("claroline.transfer.action")
 */
class Create extends AbstractAction
{
    /** @var Crud */
    private $crud;

    /**
     * Action constructor.
     *
     * @DI\InjectParams({
     *     "crud"       = @DI\Inject("claroline.api.crud"),
     *     "om"         = @DI\Inject("claroline.persistence.object_manager"),
     *     "serializer" = @DI\Inject("claroline.api.serializer")
     * })
     *
     * @param Crud $crud
     */
    public function __construct(Crud $crud, ObjectManager $om, SerializerProvider $serializer)
    {
        $this->crud = $crud;
        $this->om = $om;
        $this->serializer = $serializer;
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

        $collabRole = $workspace->getDefaultRole();
        $rights[] = [
            'permissions' => $permissions,
            'name' => $collabRole->getName(),
            'translationKey' => $collabRole->getTranslationKey(),
        ];

        $dataResourceNode = [
          'name' => $data['name'],
          'meta' => [
            'published' => true,
            'type' => 'directory',
          ],
          'rights' => $rights,
        ];

        /** @var ResourceNode $resourceNode */
        $resourceNode = $this->crud->create(ResourceNode::class, $dataResourceNode, $options);
        $resourceNode->setParent($parent);
        $resourceNode->setWorkspace($parent->getWorkspace());

        $this->crud->create(Directory::class, [], $options);
    }

    /**
     * @return array
     */
    public function getSchema(array $options = [], $extra = null)
    {
        $directory = [
          '$schema' => 'http:\/\/json-schema.org\/draft-04\/schema#',
          'type' => 'object',
          'properties' => [
            'name' => [
              'type' => 'string',
              'description' => 'The directory name',
            ],
            'open' => [
              'type' => 'boolean',
              'description' => 'Openable for collaborators',
            ],
            'delete' => [
              'type' => 'boolean',
              'description' => 'Deletable for collaborators',
            ],
            'edit' => [
              'type' => 'boolean',
              'description' => 'Editable for collaborators',
            ],
            'copy' => [
              'type' => 'boolean',
              'description' => 'Copyable for collaborators',
            ],
            'export' => [
              'type' => 'boolean',
              'description' => 'Exportable for collaborators',
            ],
            'administrate' => [
              'type' => 'boolean',
              'description' => 'Administrable for collaborators',
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

    public function getExtraDefinition(array $options = [], $extra = null)
    {
        $root = $this->serializer->serialize($this->om->getRepository(ResourceNode::class)->findOneBy(['parent' => null, 'workspace' => $extra]));

        return ['fields' => [
          [
            'name' => 'directory',
            'type' => 'resource',
            'required' => false,
            'label' => 'root',
            'options' => ['picker' => [
              'filters' => [
                ['property' => 'workspace', 'value' => $extra->getUuid(), 'locked' => true],
                ['property' => 'resourceType', 'value' => 'directory', 'locked' => true],
              ],
              //'current' => $root,
              //'root' => $root,
            ]],
          ],
        ]];
    }

    public function supports($format, array $options = [], $extra = null)
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
        return ['directory', 'create'];
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