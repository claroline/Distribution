<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Event\Log;

use Claroline\CoreBundle\Event\DataConveyorEventInterface;
use Claroline\CoreBundle\Model\LogInterface;
use Symfony\Component\EventDispatcher\Event;

class LogCreateDelegateViewEvent extends Event implements DataConveyorEventInterface
{
    private $responseContent = '';
    private $log;
    private $isPopulated = false;

    public function __construct(LogInterface $log)
    {
        $this->log = $log;
    }

    /**
     * Sets the response content (creation form as string).
     *
     * @param string $responseContent
     */
    public function setResponseContent($responseContent)
    {
        $this->isPopulated = true;
        $this->responseContent = $responseContent;
    }

    /**
     * Returns the response content (creation form as string).
     *
     * @return string
     */
    public function getResponseContent()
    {
        return $this->responseContent;
    }

    public function getLog()
    {
        return $this->log;
    }

    public function isPopulated()
    {
        return $this->isPopulated;
    }
}
