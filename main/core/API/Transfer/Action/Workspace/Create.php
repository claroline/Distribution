<?php

namespace Claroline\CoreBundle\API\Transfer\Action\Workspace;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Transfer\Action\AbstractAction;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\Workspace\WorkspaceSerializer;
use Claroline\CoreBundle\Entity\Organization\Organization;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Manager\Workspace\WorkspaceManager;
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
     *     "om"               = @DI\Inject("claroline.persistence.object_manager"),
     *     "crud"             = @DI\Inject("claroline.api.crud"),
     *     "workspaceManager" = @DI\Inject("claroline.manager.workspace_manager"),
     *     "serializer"       = @DI\Inject("claroline.serializer.workspace")
     * })
     *
     * @param Crud $crud
     */
    public function __construct(ObjectManager $om, Crud $crud, WorkspaceManager $workspaceManager, WorkspaceSerializer $serializer)
    {
        $this->crud = $crud;
        $this->om = $om;
        $this->workspaceManager = $workspaceManager;
        $this->serializer = $serializer;
    }

    public function execute(array $data, &$successData = [])
    {
        $workspace = $this->crud->create(
            $this->getClass(),
            $data,
            [Options::LIGHT_COPY]
        );

        if (isset($data['model'])) {
            $model = $this->om->getRepository(Workspace::class)->findOneBy($data['model']);
            $workspace = $this->workspaceManager->copy($model, $workspace, false);
            $workspace = $this->serializer->deserialize($data, $workspace);
        }

        //add organizations here
        if (isset($data['organizations'])) {
            foreach ($data['organizations'] as $organizationData) {
                $organization = $this->om->getRepository(Organization::class)->findOneBy($organizationData);
                $workspace->addOrganization($organization);
                $this->om->persist($workspace);
            }
        }

        $this->om->flush();

        $successData['create'][] = [
          'data' => $data,
          'log' => $this->getAction()[0].' created.',
        ];
    }

    public function getClass()
    {
        return 'Claroline\CoreBundle\Entity\Workspace\Workspace';
    }

    public function getAction()
    {
        return ['workspace', self::MODE_CREATE];
    }

    public function getSchema(array $options = [], array $extra = [])
    {
        return ['$root' => $this->getClass()];
    }

    public function getMode()
    {
        return self::MODE_CREATE;
    }
}
