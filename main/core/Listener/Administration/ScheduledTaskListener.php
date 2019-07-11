<?php

namespace Claroline\CoreBundle\Listener\Administration;

use Claroline\AppBundle\API\Options;
use Claroline\CoreBundle\API\Serializer\ParametersSerializer;
use Claroline\CoreBundle\Event\OpenAdministrationToolEvent;
use Claroline\CoreBundle\Manager\ToolManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * Scheduled tasks tool.
 *
 * @DI\Service()
 */
class ScheduledTaskListener
{
    /** @var AuthorizationCheckerInterface */
    private $authorization;

    /** @var ParametersSerializer */
    private $parametersSerializer;

    /** @var ToolManager */
    private $toolManager;

    /**
     * ScheduledTaskListener constructor.
     *
     * @DI\InjectParams({
     *     "authorization"        = @DI\Inject("security.authorization_checker"),
     *     "parametersSerializer" = @DI\Inject("claroline.serializer.parameters"),
     *     "toolManager"          = @DI\Inject("claroline.manager.tool_manager")
     * })
     *
     * @param AuthorizationCheckerInterface $authorization
     * @param ParametersSerializer          $parametersSerializer
     * @param ToolManager                   $toolManager
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        ParametersSerializer $parametersSerializer,
        ToolManager $toolManager
    ) {
        $this->authorization = $authorization;
        $this->parametersSerializer = $parametersSerializer;
        $this->toolManager = $toolManager;
    }

    /**
     * Displays scheduled tasks administration tool.
     *
     * @DI\Observe("administration_tool_tasks_scheduling")
     *
     * @param OpenAdministrationToolEvent $event
     */
    public function onDisplayTool(OpenAdministrationToolEvent $event)
    {
        $adminTool = $this->toolManager->getAdminToolByName('tasks_scheduling');

        if (is_null($adminTool) || !$this->authorization->isGranted('OPEN', $adminTool)) {
            throw new AccessDeniedException();
        }
        $parameters = $this->parametersSerializer->serialize([Options::SERIALIZE_MINIMAL]);

        $event->setData([
            'isCronConfigured' => isset($parameters['is_cron_configured']) && $parameters['is_cron_configured'],
        ]);
        $event->stopPropagation();
    }
}
