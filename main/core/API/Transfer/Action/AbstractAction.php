<?php

namespace Claroline\CoreBundle\API\Transfer\Action;

use Claroline\CoreBundle\Persistence\ObjectManager;

abstract class AbstractAction
{
    abstract public function execute($data);
    abstract public function getName();
    abstract public function getSchema();

    public function getBatchSize()
    {
        return 100;
    }

    public function clear(ObjectManager $om)
    {
        return;
    }

    public function getLogMessage($data)
    {
        return $this->getName();
    }

    public function export()
    {
        throw new \Exception("I don't plan to implements you anytime soon");
    }
}
