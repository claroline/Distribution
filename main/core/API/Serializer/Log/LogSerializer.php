<?php

namespace Claroline\CoreBundle\API\Serializer\Log;

use Claroline\CoreBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\API\SerializerProvider;
use Claroline\CoreBundle\Entity\Log\Log;
use Claroline\CoreBundle\Event\Log\LogCreateDelegateViewEvent;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * @DI\Service("claroline.serializer.log")
 * @DI\Tag("claroline.serializer")
 */
class LogSerializer
{
    use SerializerTrait;

    /** @var SerializerProvider */
    private $serializer;

    /** @var TranslatorInterface */
    private $translator;

    /** @var EventDispatcherInterface */
    private $dispatcher;

    /**
     * RoleSerializer constructor.
     *
     * @DI\InjectParams({
     *     "serializer" = @DI\Inject("claroline.api.serializer"),
     *     "translator" = @DI\Inject("translator"),
     *     "dispatcher" = @DI\Inject("event_dispatcher")
     * })
     *
     * @param SerializerProvider $serializer
     */
    public function __construct(
        SerializerProvider $serializer,
        TranslatorInterface $translator,
        EventDispatcherInterface $dispatcher
    ) {
        $this->serializer = $serializer;
        $this->translator = $translator;
        $this->dispatcher = $dispatcher;
    }

    public function getClass()
    {
        return 'Claroline\CoreBundle\Entity\Log\Log';
    }

    public function getIdentifiers()
    {
        return ['id'];
    }

    /**
     * Serializes a Book reference entity.
     *
     * @param Log   $log
     * @param array $options
     *
     * @return array
     */
    public function serialize(Log $log, array $options = [])
    {
        $details = $log->getDetails();
        $doer = null;
        if (!is_null($log->getDoer())) {
            $doer = [
                'id' => $log->getDoer()->getId(),
                'name' => $details['doer']['firstName']." ".$details['doer']['lastName'],
            ];
        }

        $workspace = null;
        if (!is_null($log->getWorkspace())) {
            $workspace = [
                'id' => $log->getWorkspace()->getId(),
                'name' => $details['workspace']['name'],
            ];
        }

        $resourceNode = null;
        if (!is_null($log->getResourceNode())) {
            $resourceNode = [
                'id' => $log->getResourceNode()->getId(),
                'name' => $details['resource']['name'],
            ];
        }

        $resourceType = null;
        if (!is_null($log->getResourceType())) {
            $resourceType = $log->getResourceType()->getName();
        }

        // Get log description (depending on log sentence rendering)
        $eventName = 'create_log_list_item_'.$log->getAction();
        if (!$this->dispatcher->hasListeners($eventName)) {
            $eventName = 'create_log_list_item';

        }
        $event = new LogCreateDelegateViewEvent($log);
        $description = $this->processContent($this->dispatcher->dispatch($eventName, $event)->getResponseContent());

        return [
            'id' => $log->getId(),
            'action' => $this->translator->trans('log_'.$log->getAction().'_shortname', [], 'log'),
            'dateLog' => $log->getDateLog()->format('Y-m-d\TH:i:s'),
            'details' => $log->getDetails(),
            'description' => $description,
            'doer' => $doer,
            'workspace' => $workspace,
            'resourceNode' => $resourceNode,
            'resourceType' => $resourceType,
        ];
    }

    private function processContent($response) {
        return trim(preg_replace('/\s\s+/', ' ', $response));
    }
}
