<?php

namespace Claroline\CoreBundle\API\Transfer\Action;

use Claroline\CoreBundle\Event\StrictDispatcher;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\SerializerProvider;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use JMS\DiExtraBundle\Annotation as DI;
use Claroline\CoreBundle\API\Crud;

/**
 * @DI\Service()
 * @DI\Tag("claroline.transfer.action")
 */
class AddUserToGroup extends AbstractAction
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

    public function execute($data)
    {
        $user = $this->serializer->deserialize(
            'Claroline\CoreBundle\Entity\User',
            $data->user[0]
        );

        $group = $this->serializer->deserialize(
            'Claroline\CoreBundle\Entity\Group',
            $data->group[0]
        );

        $this->crud->patch($user, 'group', 'add', [$group]);
    }

    public function getName()
    {
        return 'add_user_to_group';
    }

    public function getExplain()
    {
        return [
          'group.[identifier]' => true,
          'user.[identifier]' => true
        ];
    }

    public function getLogMessage($data)
    {
    }

    public function getBatchSize()
    {
        return 500;
    }

    public function clear(ObjectManager $om)
    {
    }
}
