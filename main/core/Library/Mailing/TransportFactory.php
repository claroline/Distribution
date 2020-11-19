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
use Monolog\Logger;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\Mailer\Transport\SendmailTransport;
use Symfony\Component\Mailer\Transport\Smtp\EsmtpTransport;
use Symfony\Component\Mailer\Transport\Smtp\SmtpTransport;

class TransportFactory
{
    private const COMMAND = '/usr/sbin/sendmail -bs';

    private $configHandler;

    public function __construct(PlatformConfigurationHandler $configHandler)
    {
        $this->configHandler = $configHandler;
    }

    public function getTransport()
    {
        $type = $this->configHandler->getParameter('mailer_transport');

        if ('sendmail' === $type) {
            return new SendmailTransport(
                self::COMMAND,
                new EventDispatcher(),
                new Logger('mailer')
            );
        } elseif ('smtp' === $type) {
            $transport = $this->getBaseSmtpTransport();
            //$transport->setEncryption($this->configHandler->getParameter('mailer_encryption'));
            $transport->setUsername($this->configHandler->getParameter('mailer_username'));
            $transport->setPassword($this->configHandler->getParameter('mailer_password'));
            //$transport->setAuthMode($this->configHandler->getParameter('mailer_auth_mode'));
            // should probably be configurable too
//            $transport->setTimeout(30);
//            $transport->setSourceIp(null);

            return $transport;
        } elseif ('gmail' === $type) {
            $transport = $this->getBaseSmtpTransport();
//            $transport->setEncryption('ssl');
//            $transport->setAuthMode('login');
            $transport->setUsername($this->configHandler->getParameter('mailer_username'));
            $transport->setPassword($this->configHandler->getParameter('mailer_password'));

            return $transport;
        }

        //default
        return $this->getBaseSmtpTransport();
    }

    private function getBaseSmtpTransport()
    {
        return new EsmtpTransport(
            $this->configHandler->getParameter('mailer_host'),
            $this->configHandler->getParameter('mailer_port'),
            $this->configHandler->getParameter('mailer_tls'),
            new EventDispatcher(),
            new Logger('mailer')
        );
    }
}
