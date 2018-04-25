<?php

namespace FormaLibre\ReservationBundle\Transfer\Action\Resource;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\Transfer\Action\AbstractAction;
use Claroline\AppBundle\Persistence\ObjectManager;
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

    public function execute(array $data, &$successData = [])
    {
        $this->crud->create('FormaLibre\ReservationBundle\Entity\Resource', $data);
    }

    public function getAction()
    {
        return ['reservation-resource', 'create'];
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
        return ['$root' => 'FormaLibre\ReservationBundle\Entity\Resource'];
    }
}
