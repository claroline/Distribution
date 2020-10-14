<?php

namespace Claroline\TagBundle\Listener\Platform;

use Claroline\CoreBundle\Event\Layout\InjectStylesheetEvent;
use Twig\Environment;

class ClientListener
{
    /** @var Environment */
    private $templating;

    /**
     * ClientListener constructor.
     *
     * @param Environment $templating
     */
    public function __construct(Environment $templating)
    {
        $this->templating = $templating;
    }

    /**
     * @param InjectStylesheetEvent $event
     */
    public function onInjectCss(InjectStylesheetEvent $event)
    {
        $content = $this->templating->render('ClarolineTagBundle:layout:stylesheets.html.twig', []);

        $event->addContent($content);
    }
}
