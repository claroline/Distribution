<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Event;

use Claroline\CoreBundle\Model\LogInterface;
use Symfony\Component\EventDispatcher\Event;

class LogCreateEvent extends Event
{
    const NAME = 'claroline.log.create';

    /** @var LogInterface; */
    protected $log;

    public function __construct(LogInterface $log)
    {
        $this->log = $log;
    }

    /**
     * @return Log
     */
    public function getLog()
    {
        return $this->log;
    }
}
