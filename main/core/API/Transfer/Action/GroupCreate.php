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
class GroupCreate extends AbstractAction
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

    public function getName()
    {
        return 'group_create';
    }

    //Dans quelle mesure ça ne pourrait pas être le json schema ?
    public function getExplain()
    {
        return [
          'name' => true,
          'organizations.[identifier]' => false
        ];
    }

    public function getSchema()
    {
        return file_get_contents(__DIR__ . '/../../Schema/Object/group.json');
    }

    public function getBatchSize()
    {
        return 250;
    }

    public function clear(ObjectManager $om)
    {
    }
}
