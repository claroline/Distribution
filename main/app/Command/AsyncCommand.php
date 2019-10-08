<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\AppBundle\Command;

use Symfony\Component\Process\Process;

class AsyncCommand
{
    /**
     * @param string $rootDir
     */
    public function __construct($rootDir)
    {
        $this->rootDir = $rootDir;
    }

    public function run($commandName)
    {
        $process = new Process($this->getCommandName($commandName));
        $process->start();
    }

    public function getCommandName($commandName)
    {
        return 'php '.$this->rootDir.'/console '.$commandName;
    }
}
