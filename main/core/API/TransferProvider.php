<?php

namespace Claroline\CoreBundle\API;

use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use Claroline\CoreBundle\API\Transfer\Adapter\AdapterInterface;
use Claroline\CoreBundle\API\Transfer\Action\AbstractAction;
use Claroline\CoreBundle\Library\Logger\FileLogger;
use Claroline\BundleRecorder\Log\LoggableTrait;
use Symfony\Component\Translation\TranslatorInterface;

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
     *     "logDir"     = @DI\Inject("%claroline.param.import_log_dir%"),
     *     "translator" = @DI\Inject("translator")
     * })
     *
     * @param ObjectManager      $om
     */
    public function __construct(
        ObjectManager $om,
        SerializerProvider $serializer,
        $logDir,
        TranslatorInterface $translator
      ) {
        $this->adapters   = [];
        $this->actions    = [];
        $this->om         = $om;
        $this->serializer = $serializer;
        $this->logDir     = $logDir;
        $this->translator = $translator;
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
        //use the translator here
        $this->log("Building objects from data...");

        if (array_key_exists('$root', $schema)) {
            $jsonSchema = $this->serializer->getSchema($schema['$root']);
            $explanation = $adapter->explainSchema($jsonSchema);
            $data = $adapter->decodeSchema($data, $explanation);
        } else {
            foreach ($schema as $prop => $value) {
                $jsonSchema = $this->serializer->getSchema($value);

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

    public function explainAction($actionName, $format)
    {
        $adapter = $this->getAdapter($format);
        $action = $this->getExecutor($actionName);
        $schema = $action->getSchema();

        if (array_key_exists('$root', $schema)) {
            $jsonSchema = $this->serializer->getSchema($schema['$root']);

            if ($jsonSchema) {
                return $adapter->explainSchema($jsonSchema);
            }
        }

        $identifiersSchema = [];

        foreach ($schema as $prop => $value) {
            $jsonSchema = $this->serializer->getSchema($value);

            if ($jsonSchema) {
                $identifiersSchema[$prop] = $jsonSchema;
            }
        }

        return $adapter->explainIdentifiers($identifiersSchema);
    }

    public function getAvailableActions($format)
    {
        $availables = [];

        foreach ($this->actions as $action) {
            $schema = $action->getAction();
            $availables[$schema[0]][$schema[1]] = $this->explainAction($this->getActionName($action), $format);
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
