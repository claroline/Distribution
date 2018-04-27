<?php

namespace Claroline\CoreBundle\API\Transfer\Action\Group;

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
     *     "serializer" = @DI\Inject("claroline.api.serializer")
     * })
     *
     * @param Crud $crud
     */
    public function __construct(Crud $crud, SerializerProvider $serializer)
    {
        $this->crud = $crud;
        $this->serializer = $serializer;
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

        $this->crud->patch($user, 'group', 'add', [$group]);
    }

    public function getSchema()
    {
        return [
          'group' => 'Claroline\CoreBundle\Entity\Group',
          'user' => 'Claroline\CoreBundle\Entity\User',
        ];
    }

    public function getAction()
    {
        return ['workspace', 'add_user'];
    }

    public function getBatchSize()
    {
        return 500;
    }

    public function clear(ObjectManager $om)
    {
    }
}
