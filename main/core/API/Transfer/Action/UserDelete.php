<?php

namespace Claroline\CoreBundle\API\Transfer\Action;

use Claroline\CoreBundle\API\SerializerProvider;
use Claroline\CoreBundle\Event\StrictDispatcher;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use JMS\DiExtraBundle\Annotation as DI;
use Claroline\CoreBundle\API\Crud;

/**
 * @DI\Service()
 * @DI\Tag("claroline.transfer.action")
 */
class UserDelete extends AbstractAction
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

        $this->crud->delete('Claroline\CoreBundle\Entity\User', $user);
    }

    public function getName()
    {
        return 'user_delete';
    }

    public function getExplain()
    {
        //schema des utilisateurs ?
        return [
          'user.[identifier]' => true
        ];
    }

    public function getBatchSize()
    {
        return 100;
    }

    public function clear(ObjectManager $om)
    {
    }
}
