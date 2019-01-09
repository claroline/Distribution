<?php

namespace UJM\LtiBundle\Listener;

use Claroline\CoreBundle\Event\OpenAdministrationToolEvent;
use Claroline\CoreBundle\Manager\ToolManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Bundle\TwigBundle\TwigEngine;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * @DI\Service
 */
class LtiListener
{
    /** @var AuthorizationCheckerInterface */
    private $authorization;
    /** @var TwigEngine */
    private $templating;
    /** @var ToolManager */
    private $toolManager;

    /**
     * @DI\InjectParams({
     *     "authorization" = @DI\Inject("security.authorization_checker"),
     *     "templating"    = @DI\Inject("templating"),
     *     "toolManager"   = @DI\Inject("claroline.manager.tool_manager")
     * })
     *
     * @param AuthorizationCheckerInterface $authorization
     * @param TwigEngine                    $templating
     * @param ToolManager                   $toolManager
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        TwigEngine $templating,
        ToolManager $toolManager
    ) {
        $this->authorization = $authorization;
        $this->templating = $templating;
        $this->toolManager = $toolManager;
    }

    /**
     * @DI\Observe("administration_tool_LTI")
     *
     * @param OpenAdministrationToolEvent $event
     */
    public function onAdministrationToolOpen(OpenAdministrationToolEvent $event)
    {
        $ltiTool = $this->toolManager->getAdminToolByName('LTI');

        if (is_null($ltiTool) || !$this->authorization->isGranted('OPEN', $ltiTool)) {
            throw new AccessDeniedException();
        }
        $content = $this->templating->render('UJMLtiBundle:administration:management.html.twig');
        $event->setResponse(new Response($content));
        $event->stopPropagation();
    }
}
