<?php

namespace Claroline\CoreBundle\Library\Mailing\Client;

use Claroline\CoreBundle\Library\Mailing\Message;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class SymfonyMailer
{
    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    public function send(Message $message)
    {
        $email = (new Email())
            ->subject($message->getAttribute('subject'))
            ->from($message->getAttribute('from'))
            ->replyTo($message->getAttribute('reply_to'))
            ->html($message->getAttribute('body'))
            ->bcc(...$message->getAttribute('bcc'))
            ->to(...$message->getAttribute('to'));

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
