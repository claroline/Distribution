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
class GroupDelete extends AbstractAction
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
        $group = $this->serializer->deserialize(
            'Claroline\CoreBundle\Entity\Group',
            $data->group[0]
        );

        $this->crud->delete('Claroline\CoreBundle\Entity\Group', $group);
    }

    public function getName()
    {
        return 'group_delete';
    }

    public function getSchema()
    {
        return __DIR__ . '/../../Schema/identifier/group.json';
    }

    public function getBatchSize()
    {
        return 100;
    }

    public function clear(ObjectManager $om)
    {
    }
}
