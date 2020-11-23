<?php

namespace Claroline\CoreBundle\Library\Mailing\Client;

use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CoreBundle\Library\Mailing\Message;
use Monolog\Logger;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mime\Email;

class SymfonyMailer
{
    private $eventDispatcher;
    private $logger;

    public function __construct(
        Mailer $mailer,
        PlatformConfigurationHandler $ch,
        EventDispatcherInterface $eventDispatcher,
        Logger $logger
    ) {
        $this->mailer = $mailer;
        $this->ch = $ch;
        $this->eventDispatcher = $eventDispatcher;
        $this->logger = $logger;
    }

    public function send(Message $message)
    {
        $email = (new Email())
            ->subject($message->getAttribute('subject'))
            ->from($message->getAttribute('from'))
            ->replyTo($message->getAttribute('reply_to'))
            ->html($message->getAttribute('body'))
            ->bcc($message->getAttribute('bcc'))
            ->to($message->getAttribute('to'));

        foreach ($message->getAttribute('attachments') as $attachment) {
            $email->attachFromPath(
                $attachment['path']
            );
        }

        try {
            $this->mailer->send($message);

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}
