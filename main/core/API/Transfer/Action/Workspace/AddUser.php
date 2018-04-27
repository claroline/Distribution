<?php

namespace Claroline\CoreBundle\API\Transfer\Action\Workspace;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\API\Transfer\Action\AbstractAction;
use Claroline\AppBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service()
 * @DI\Tag("claroline.transfer.action")
 */
class AddUser extends AbstractAction
{
    /**
     * Action constructor.
     *
     * @DI\InjectParams({
     *     "crud"       = @DI\Inject("claroline.api.crud"),
     *     "serializer" = @DI\Inject("claroline.api.serializer"),
     *     "om"         = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param Crud $crud
     */
    public function __construct(Crud $crud, SerializerProvider $serializer, ObjectManager $om)
    {
        $this->crud = $crud;
        $this->serializer = $serializer;
        $this->om = $om;
    }

    public function execute(array $data, &$successData = [])
    {
        $user = $this->serializer->deserialize(
            'Claroline\CoreBundle\Entity\User',
            $data['user'][0]
        );

        $workspace = $this->serializer->deserialize(
            'Claroline\CoreBundle\Entity\Workspace',
            $data['workspace'][0]
        );

        $role = $this->om->getRepository('ClarolineCoreBundle:Role')
          ->findOneBy(['workspace' => $workspace, 'translationKey' => $data['role'][0]['translationKey']]);

        $this->crud->patch($user, 'role', 'add', [$role]);
    }

    public function getSchema()
    {
        $roleSchema = [
          '$schema' => 'http:\/\/json-schema.org\/draft-04\/schema#',
          'type' => 'object',
          'properties' => [
            'translationKey' => [
              'type' => 'string',
              'description' => 'The role name',
            ],
          ],
          'claroline' => [
            'requiredAtCreation' => ['translationKey'],
            'ids' => ['translationKey'],
          ],
        ];

        $schema = json_decode(json_encode($roleSchema));

        return [
          'workspace' => 'Claroline\CoreBundle\Entity\Workspace\Workspace',
          'user' => 'Claroline\CoreBundle\Entity\User',
          'role' => $schema,
        ];
    }

    public function getAction()
    {
        return ['workspace', 'add_user'];
    }
}
