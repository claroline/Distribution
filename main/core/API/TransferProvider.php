<?php

namespace Claroline\CoreBundle\API;

use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use Claroline\CoreBundle\API\Transfer\Adapter\AdapterInterface;
use Claroline\CoreBundle\API\Transfer\Action\AbstractAction;

/**
 * @DI\Service("claroline.api.transfer")
 */
class TransferProvider
{
    /**
     * Crud constructor.
     *
     * @DI\InjectParams({
     *     "om"= @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param ObjectManager      $om
     */
    public function __construct(ObjectManager $om)
    {
        $this->adapters = [];
        $this->actions = [];
        $this->om = $om;
    }

    public function import($data, $action, $mimeType)
    {
        $executor = $this->getExecutor($action);
        $adapter = $this->getAdapter($mimeType);
        $data = $adapter->getData($data);
        $i = 0;
        $this->om->startFlushSuite();

        foreach ($data as $data) {
            $i++;
            //$this->log($executor->getLogMessage());
            $executor->import($data);

            if ($i % $executor->getBatchSize() === 0) {
                $this->om->forceFlush();
            }
        }

        $this->om->endFlushSuite();
    }

    public function getData($file)
    {
        $mimeType = $file->getMimeType();
    }

    public function add($dependency)
    {
        if ($dependency instanceof AdapterInterface) {
            $this->adapters[$dependency->getMimeTypes()[0]] = $dependency;
            return;
        }

        if ($dependency instanceof AbstractAction) {
            $this->actions[$dependency->getName()] = $dependency;
            return;
        }

        throw new \Exception("Can only add AbstractAction or ActionInterface. Failed to find one for " . get_class($dependency));
    }

    public function getExecutor($action)
    {
        return $this->actions[$action];
    }

    public function getAvailableActions()
    {
        $availables = [];

        foreach ($this->actions as $action) {
            $availables[$action->getName()] = $action->getSchema();
        }

        return $availables;
    }

    public function getAdapter($mimeType)
    {
        foreach ($this->adapters as $adapter) {
            if (in_array($mimeType, $adapter->getMimeTypes())) {
                return $adapter;
            }
        }

        throw new \Exception('No adapter found for mime type ' . $mimeType);
    }

    public function log($logMessage)
    {
        //do something smart here I guess
    }
}
