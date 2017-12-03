<?php

namespace Claroline\CoreBundle\API\Transfer\Action\Workspace;

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
        $this->crud->create('Claroline\CoreBundle\Entity\Workspace', $data);
    }

    /**
     * return an array with the following element:
     * - section
     * - action
     * - action name.
     */
    public function getAction()
    {
        return ['workspace', 'create'];
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
        return ['$root' => 'Claroline\CoreBundle\Entity\Workspace\Workspace'];
    }
}
