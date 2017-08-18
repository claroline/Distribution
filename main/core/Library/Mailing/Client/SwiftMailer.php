<?php

namespace Claroline\CoreBundle\Library\Mailing\Client;

use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CoreBundle\Library\Mailing\Message;

/**
 * @DI\Service("claroline.mailing.swiftmailer")
 * @DI\Tag("claroline.mailing")
 */
class SwiftMailer implements MailClientInterface
{
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

    public function getTransports()
    {
        return['gmail', 'smtp', 'sendmail'];
    }

    public function test()
    {
        //no test yet
        return true;
    }

    public function send(Message $message)
    {
        $swiftMessage = \Swift_Message::newInstance()
          ->setSubject($message->getAttribute('subject'))
          ->setFrom($message->getAttribute('from'))
          ->setReplyTo($message->getAttribute('reply_to'))
          ->setBody($message->getAttribute('body'), 'text/html')
          ->setBcc($message->getAttribute('bcc'))
          ->setTo($message->getAttribute('to'));

        foreach ($message->getAttribute('attachments') as $attachment) {
            $swiftMessage->attach(
              \Swift_Attachment::fromPath(
                  $attachment['path'],
              $attachment['content_type']
              )
            );
        }

        return $this->mailer->send($swiftMessage) ? true : false;
    }
}
