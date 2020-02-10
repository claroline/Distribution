<?php

namespace Claroline\CoreBundle\Listener\Administration;

use Claroline\AppBundle\API\Options;
use Claroline\CoreBundle\API\Serializer\ParametersSerializer;
use Claroline\CoreBundle\Event\Tool\OpenToolEvent;

/**
 * Scheduled tasks tool.
 */
class ScheduledTaskListener
{
    /** @var ParametersSerializer */
    private $parametersSerializer;

    /**
     * ScheduledTaskListener constructor.
     *
     * @param ParametersSerializer $parametersSerializer
     */
    public function __construct(ParametersSerializer $parametersSerializer)
    {
        $this->parametersSerializer = $parametersSerializer;
    }

    /**
     * Displays scheduled tasks administration tool.
     *
     * @param OpenToolEvent $event
     */
    public function onDisplayTool(OpenToolEvent $event)
    {
        $parameters = $this->parametersSerializer->serialize([Options::SERIALIZE_MINIMAL]);

        $event->setData([
            'isCronConfigured' => isset($parameters['is_cron_configured']) && $parameters['is_cron_configured'],
        ]);
        $event->stopPropagation();
    }
}
