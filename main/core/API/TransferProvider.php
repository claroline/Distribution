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
     *     "om"= @DI\Inject("claroline.persistence.object_manager"),
     *     "rootDir" = @DI\Inject("%kernel.root_dir%"),
     *     "serializer" = @DI\Inject("claroline.api.serializer")
     * })
     *
     * @param ObjectManager      $om
     */
    public function __construct(ObjectManager $om, $rootDir, SerializerProvider $serializer)
    {
        $this->adapters = [];
        $this->actions = [];
        $this->om = $om;
        $this->rootDir = $rootDir . '/..';
        $this->serializer = $serializer;
    }

    public function import($data, $action, $mimeType)
    {
        $executor = $this->getExecutor($action);
        $adapter = $this->getAdapter($mimeType);

        $schema = $executor->getSchema();
        if (array_key_exists('$root', $schema)) {
            $jsonSchema = $this->serializer->get($schema['$root'][0])->getSchema();
            $data = $adapter->decodeSchema($data, $jsonSchema);
        } else {
            //
        }

        $i = 0;
        $this->om->startFlushSuite();

        foreach ($data as $data) {
            $i++;
            //$this->log($executor->getLogMessage());
            //
            $executor->execute($data);

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
            $this->actions[$dependency->getAction()[2]] = $dependency;
            return;
        }

        throw new \Exception("Can only add AbstractAction or ActionInterface. Failed to find one for " . get_class($dependency));
    }

    public function getExecutor($action)
    {
        return $this->actions[$action];
    }

    public function getAvailableActions($format)
    {
        $availables = [];
        $adapter = $this->getAdapter($format);

        foreach ($this->actions as $action) {
            $schema = $action->getSchema();

            if (array_key_exists('$root', $schema)) {
                $jsonSchema = $this->serializer->get($schema['$root'][0])->getSchema();
                $path = explode('/', $jsonSchema);
                $absolutePath = $this->rootDir. '/vendor/claroline/distribution/'
                  . $path[1] . '/' . $path[2] . '/Resources/schema/' . $path[3];

                //maybe not an stdClass later
                $data = @file_get_contents($absolutePath);

                if ($data) {
                    $explanation = $adapter->explainSchema(json_decode($data));
                    $availables[$action->getAction()[0]][$action->getAction()[1]] = $explanation;
                }
            } else {
                $identifiersSchema = [];

                foreach ($schema as $prop => $value) {
                    $jsonSchema = $this->serializer->get($value[0])->getSchema();
                    $path = explode('/', $jsonSchema);
                    $absolutePath = $this->rootDir. '/vendor/claroline/distribution/'
                        . $path[1] . '/' . $path[2] . '/Resources/schema/' . $path[3];

                    $data = @file_get_contents($absolutePath);

                    if ($data) {
                        $identifiersSchema[$prop] = json_decode($data);
                        $explanation = $adapter->explainIdentifiers($identifiersSchema);
                        $availables[$action->getAction()[0]][$action->getAction()[1]] = $explanation;
                    }
                }
            }
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
