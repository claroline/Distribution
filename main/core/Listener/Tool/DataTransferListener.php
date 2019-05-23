<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Listener\Tool;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\TransferProvider;
use Claroline\CoreBundle\Event\DisplayToolEvent;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Bundle\TwigBundle\TwigEngine;

/**
 * Home tool.
 *
 * @DI\Service()
 */
class DataTransferListener
{
    /** @var TwigEngine */
    private $templating;

    /**
     * HomeListener constructor.
     *
     * @DI\InjectParams({
     *     "templating" = @DI\Inject("templating"),
     *     "transfer"   = @DI\Inject("claroline.api.transfer")
     * })
     *
     * @param TwigEngine $templating
     */
    public function __construct(TwigEngine $templating, TransferProvider $transfer)
    {
        $this->templating = $templating;
        $this->transfer = $transfer;
    }

    /**
     * Displays home on Workspace.
     *
     * @DI\Observe("open_tool_workspace_data_transfer")
     *
     * @param DisplayToolEvent $event
     */
    public function onDisplayWorkspace(DisplayToolEvent $event)
    {
        $explanation = $this->transfer->getAvailableActions('csv', Options::WORKSPACE_IMPORT);
        $workspace = $event->getWorkspace();

        $content = $this->templating->render(
            'ClarolineCoreBundle:tool:data-transfer.html.twig', [
              'workspace' => $workspace,
              'explanation' => $explanation,
            ]
        );

        $event->setContent($content);
        $event->stopPropagation();
    }
}
