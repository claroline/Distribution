<?php

namespace Claroline\CoreBundle\API;

use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use Claroline\CoreBundle\API\Transfer\Adapter\AdapterInterface;
use Claroline\CoreBundle\API\Transfer\Action\AbstractAction;
use Claroline\CoreBundle\Library\Logger\FileLogger;
use Claroline\BundleRecorder\Log\LoggableTrait;

/**
 * @DI\Service("claroline.api.transfer")
 */
class TransferProvider
{
    use LoggableTrait;

    /**
     * Crud constructor.
     *
     * @DI\InjectParams({
     *     "om"         = @DI\Inject("claroline.persistence.object_manager"),
     *     "serializer" = @DI\Inject("claroline.api.serializer"),
     *     "logDir"     = @DI\Inject("%claroline.param.import_log_dir%")
     * })
     *
     * @param ObjectManager      $om
     */
    public function __construct(
        ObjectManager $om,
        SerializerProvider $serializer,
        $logDir
      ) {
        $this->adapters   = [];
        $this->actions    = [];
        $this->om         = $om;
        $this->serializer = $serializer;
        $this->logDir     = $logDir;
        $this->logger     = FileLogger::get(uniqid() . '.log', 'claroline.transfer.logger');
    }

    public function execute($data, $action, $mimeType, $logFile = null)
    {
        if (!$logFile) {
            $logFile = uniqid();
        }

        $logFile = $this->logDir . '/'. $logFile . '.log';
        $this->logger = FileLogger::get($logFile, 'claroline.transfer.logger');

        $executor = $this->getExecutor($action);
        $executor->setLogger($this->logger);
        $adapter = $this->getAdapter($mimeType);

        $schema = $executor->getSchema();
        $this->log("Building objects from data...");

        if (array_key_exists('$root', $schema)) {
            $jsonSchema = $this->serializer->getSchema($schema['$root'][0]);
            $explanation = $adapter->explainSchema($jsonSchema);
            $data = $adapter->decodeSchema($data, $explanation);
        } else {
            foreach ($schema as $prop => $value) {
                $jsonSchema = $this->serializer->getSchema($value[0]);

                if ($jsonSchema) {
                    $identifiersSchema[$prop] = $jsonSchema;
                }
            }

            $explanation = $adapter->explainIdentifiers($identifiersSchema);
            $data = $adapter->decodeSchema($data, $explanation);
        }

        $i = 0;
        $this->om->startFlushSuite();
        $total = count($data);
        $this->log("Executing operations...");

        foreach ($data as $data) {
            $i++;
            $this->log("{$i}/{$total}: " . $this->getActionName($executor));
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

    public function getActionName(AbstractAction $action)
    {
        return $action->getAction()[0] . '_' . $action->getAction()[1];
    }

    public function add($dependency)
    {
        if ($dependency instanceof AdapterInterface) {
            $this->adapters[$dependency->getMimeTypes()[0]] = $dependency;
            return;
        }

        if ($dependency instanceof AbstractAction) {
            $this->actions[$this->getActionName($dependency)] = $dependency;
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
                $jsonSchema = $this->serializer->getSchema($schema['$root'][0]);

                if ($jsonSchema) {
                    $explanation = $adapter->explainSchema($jsonSchema);
                    $availables[$action->getAction()[0]][$action->getAction()[1]] = $explanation;
                }
            } else {
                $identifiersSchema = [];

                foreach ($schema as $prop => $value) {
                    $jsonSchema = $this->serializer->getSchema($value[0]);

                    if ($jsonSchema) {
                        $identifiersSchema[$prop] = $jsonSchema;
                    }
                }

                $explanation = $adapter->explainIdentifiers($identifiersSchema);
                $availables[$action->getAction()[0]][$action->getAction()[1]] = $explanation;
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
}
