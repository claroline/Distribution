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
use Claroline\CoreBundle\Library\Logger\FileLogger;
use JMS\DiExtraBundle\Annotation as DI;
use Postal\Client;

/**
 * @DI\Service("claroline.library.mailing.mailer")
 */
class Mailer
{
    private $mailer;
    private $ch;

    /**
     * @DI\InjectParams({
     *     "ch"     = @DI\Inject("claroline.config.platform_config_handler"),
     *     "mailer" = @DI\Inject("mailer")
     * })
     */
    public function __construct(\Swift_Mailer $mailer, PlatformConfigurationHandler $ch)
    {
        $this->mailer = $mailer;
        $this->ch = $ch;
    }

    public function send(\Swift_Message $message)
    {
        $emailLog = $this->container->getParameter('kernel.root_dir').'/logs/email.log';
        $logger = FileLogger::get($emailLog);

        if ($this->ch->getParameter('mailer_transport') === 'postal') {
            $client = new Client(
              $this->ch->getParameter('mailer_host'),
              $this->ch->getParameter('mailer_api_key')
          );

            // Create a new message
            $message = new Message($client);
            $message->to($message->getTo());
            $message->bcc($message->getBcc());
            $message->from($message->getFrom());
            $message->subject($message->getSubject());
            $message->htmlBody($message->getBody());

            $message->send();

            return true;
        } else {
            if ($this->mailer->send($message)) {
                $logger->info('Mail sent');

                return true;
            } else {
                $logger->error('Mail sent');

                return false;
            }
        }
    }
}
