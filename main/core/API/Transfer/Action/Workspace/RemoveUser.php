<?php

namespace Claroline\CoreBundle\API\Transfer\Action\Workspace;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\API\Transfer\Action\AbstractAction;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service()
 * @DI\Tag("claroline.transfer.action")
 */
class RemoveUser extends AbstractAction
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
        $user = $this->om->getObject($data['user'], User::class, array_keys($data['user']));

        if (!$user) {
            throw new \Exception('User '.$this->printError($data['user'])." doesn't exists.");
        }

        //todo find a generic way to find the identifiers
        $workspace = $this->om->getObject($data['workspace'], Workspace::class, ['code']);

        if (!$workspace) {
            throw new \Exception('Workspace '.$this->printError($data['workspace'])." doesn't exists.");
        }

        $role = $this->om->getRepository('ClarolineCoreBundle:Role')
          ->findOneBy(['workspace' => $workspace, 'translationKey' => $data['role']['translationKey']]);

        if (!$role) {
            throw new \Exception('Role '.$this->printError($data['role'])." doesn't exists.");
        }

        $this->crud->patch($user, 'role', 'remove', [$role]);
    }

    public function printError(array $el)
    {
        $string = '';

        foreach ($el as $value) {
            $string .= ' '.$value;
        }

        return $string;
    }

    public function getSchema($options = null)
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
            'class' => Role::class,
          ],
        ];

        $schema = json_decode(json_encode($roleSchema));

        $schema = [
          'user' => User::class,
          'role' => $schema,
        ];

        if (Options::WORKSPACE_IMPORT !== $options) {
            $schema['workspace'] = Workspace::class;
        }

        return $schema;
    }

    public function getAction()
    {
        return ['workspace', 'remove_user'];
    }

    public function supports($format, $options = null)
    {
        return in_array($format, ['json', 'csv']);
    }
}
