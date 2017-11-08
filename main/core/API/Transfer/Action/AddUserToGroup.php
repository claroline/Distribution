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
class AddUserToGroup extends AbstractAction
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
        $user = 1;
        $group = 2;

        $this->crud->patch($user, 'group', 'add', [$group]);
    }

    public function getName()
    {
        return 'add_user_to_group';
    }

    public function getProperties()
    {
        return [
          'group' => true,
          'user' => true
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
