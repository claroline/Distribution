<?php

namespace Claroline\CoreBundle\API\Transfer\Action\Directory;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Transfer\Action\AbstractAction;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\Directory;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service()
 * @DI\Tag("claroline.transfer.action")
 */
class Create extends AbstractAction
{
    /** @var Crud */
    private $crud;

    /**
     * Action constructor.
     *
     * @DI\InjectParams({
     *     "crud"       = @DI\Inject("claroline.api.crud")
     * })
     *
     * @param Crud $crud
     */
    public function __construct(Crud $crud)
    {
        $this->crud = $crud;
    }

    /**
     * @param array $data
     */
    public function execute(array $data, &$successData = [])
    {
        //return $this->crud->create('Claroline\CoreBundle\Entity\Facet\Facet', $data);
    }

    /**
     * @return array
     */
    public function getSchema($options = null)
    {
        $schema = [
          'directory' => Directory::class,
          'node' => ResourceNode::class,
        ];

        if (Options::WORKSPACE_IMPORT !== $options) {
            $schema['workspace'] = Workspace::class;
        }

        return $schema;
    }

    public function supports($format, $options = null)
    {
        if (Options::WORKSPACE_IMPORT !== $options) {
            return false;
        }

        return in_array($format, ['json', 'csv']);
    }

    /**
     * @return array
     */
    public function getAction()
    {
        return ['directory', 'create'];
    }

    public function getBatchSize()
    {
        return 100;
    }

    public function getMode()
    {
        return self::MODE_CREATE;
    }

    public function clear(ObjectManager $om)
    {
    }
}
