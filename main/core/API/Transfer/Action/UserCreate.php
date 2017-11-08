<?php

namespace Claroline\CoreBundle\API\Transfer\Action;

use Claroline\CoreBundle\Event\StrictDispatcher;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use JMS\DiExtraBundle\Annotation as DI;
use Claroline\CoreBundle\API\Crud;

/**
 * @DI\Service()
 * @DI\Tag("claroline.transfer.action")
 */
class UserCreate extends AbstractAction
{
    /**
     * Action constructor.
     *
     * @DI\InjectParams({
     *     "crud" = @DI\Inject("claroline.api.crud")
     * })
     *
     * @param Crud $crud
     */
    public function __construct(Crud $crud)
    {
        $this->crud = $crud;
    }

    public function import($data)
    {
        $this->crud->create('Claroline\CoreBundle\Entity\User', $data);
    }

    public function getName()
    {
        return 'user_create';
    }

    public function getProperties()
    {
        return [
          'username' => true,
          'name' => true,
          'lastname' => true,
          'firstname' => true,
          'groups.name' => false,
          'organizations.name' => false
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
