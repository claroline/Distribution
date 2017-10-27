<?php

namespace Icap\BadgeBundle\Event;

use Claroline\CoreBundle\Model\LogInterface;
use Symfony\Component\EventDispatcher\Event;

class BadgeCreateValidationLinkEvent extends Event
{
    private $log;
    private $content = null;

    public function __construct(LogInterface $log)
    {
        $this->log = $log;
    }

    /**
     * Sets the response content (creation form as string).
     *
     * @param string $content
     *
     * @return BadgeCreateValidationLinkEvent
     */
    public function setContent($content)
    {
        $this->content = $content;

        return $this;
    }

    /**
     * Returns the response content (creation form as string).
     *
     * @return string
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * @return \Claroline\CoreBundle\Model\LogInterface
     */
    public function getLog()
    {
        return $this->log;
    }
}
