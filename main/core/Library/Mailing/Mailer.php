<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Library\Mailing;

use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.library.mailing.mailer")
 */
class Mailer
{
    private $mailer;
    private $ch;
    private $rootDir;

    /**
     * @DI\InjectParams({
     *     "rootDir" = @DI\Inject("%kernel.root_dir%"),
     *     "ch"      = @DI\Inject("claroline.config.platform_config_handler")
     * })
     */
    public function __construct(PlatformConfigurationHandler $ch, $rootDir)
    {
        $this->ch = $ch;
        $this->rootDir = $rootDir;
        $this->clients = [];
    }

    public function send(Message $message)
    {
        $client = $this->getClient();
        $client->send($message);
    }

    public function add($client)
    {
        $this->clients[] = $client;
    }

    public function test()
    {
        return $this->getClient()->test();
    }

    public function getClient()
    {
        $transport = $this->ch->getParameter('mailer_transport');

        foreach ($this->clients as $client) {
            if (in_array($transport, $client->getTransports())) {
                return $client;
            }
        }

        throw new \Exception('Transport '.$transport.' not found.');
    }
}
