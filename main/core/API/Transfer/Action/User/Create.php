<?php

namespace Claroline\CoreBundle\API\Transfer\Action\User;

use Claroline\CoreBundle\API\Crud;
use Claroline\CoreBundle\API\Transfer\Action\AbstractAction;
use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;

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

    public function execute(array $data)
    {
        $this->crud->create('Claroline\CoreBundle\Entity\User', $data);
    }

    public function getSchema()
    {
        return ['$root' => 'Claroline\CoreBundle\Entity\User'];
    }

    /**
     * return an array with the following element:
     * - section
     * - action
     * - action name.
     */
    public function getAction()
    {
        return ['user', 'create'];
    }

    public function getBatchSize()
    {
        return 100;
    }

    public function clear(ObjectManager $om)
    {
    }
}
