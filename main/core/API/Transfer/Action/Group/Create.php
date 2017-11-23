<?php

namespace Claroline\CoreBundle\API\Transfer\Action\Group;

use Claroline\CoreBundle\Event\StrictDispatcher;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use JMS\DiExtraBundle\Annotation as DI;
use Claroline\CoreBundle\API\Crud;
use Claroline\CoreBundle\API\Transfer\Action\AbstractAction;

/**
 * @DI\Service()
 * @DI\Tag("claroline.transfer.action")
 */
class Create extends AbstractAction
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

    public function execute($data)
    {
        $this->crud->create('Claroline\CoreBundle\Entity\Group', $data);
    }

    /**
     * return an array with the following element:
     * - section
     * - action
     * - action name
     */
    public function getAction()
    {
        return ['group', 'create', 'create_group'];
    }

    public function getBatchSize()
    {
        return 250;
    }

    public function clear(ObjectManager $om)
    {
    }

    public function getSchema()
    {
        return ['$root' => ['Claroline\CoreBundle\Entity\Group', 'full']];
    }
}
