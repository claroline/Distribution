<?php

namespace Claroline\CoreBundle\Library\Mailing\Client;

use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CoreBundle\Library\Mailing\Message;
use Claroline\CoreBundle\Library\Mailing\Validator;
use Monolog\Logger;
use Symfony\Component\EventDispatcher\EventDispatcher;
use Symfony\Component\Mailer\Bridge\Google\Transport\GmailSmtpTransport;
use Symfony\Component\Mailer\Exception\TransportException;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mailer\Transport\SendmailTransport;
use Symfony\Component\Mailer\Transport\Smtp\EsmtpTransport;
use Symfony\Component\Mime\Email;

class SymfonyMailer implements MailClientInterface
{
    const UNABLE_TO_START_TRANSPORT = 'unable_to_start_transport';
    const UNABLE_TO_START_SMTP = 'unable_to_start_smtp';
    const UNABLE_TO_START_SENDMAIL = 'unable_to_start_sendmail';
    const UNABLE_TO_START_GMAIL = 'unable_to_start_gmail';
    const COMMAND = '/usr/sbin/sendmail -bs';

    private $eventDispatcher;
    private $logger;

    public function __construct(
        Mailer $mailer,
        PlatformConfigurationHandler $ch,
        EventDispatcher $eventDispatcher,
        Logger $logger
    )
    {
        $this->mailer = $mailer;
        $this->ch = $ch;
        $this->eventDispatcher = $eventDispatcher;
        $this->logger = $logger;
    }

    public function getTransports()
    {
        return['gmail', 'smtp', 'sendmail'];
    }

    public function test(array $data)
    {
        $validator = new Validator();
        $errors = [];

        switch ($data['transport']) {
            case 'gmail':
                $error = $validator->checkIsNotBlank($data['username']);
                if ($error) {
                    $errors['username'] = $error;
                }
                $error = $validator->checkIsNotBlank($data['password']);
                if ($error) {
                    $errors['password'] = $error;
                }
                break;
            case 'smtp':
                $error = $validator->checkIsNotBlank($data['host']);
                if ($error) {
                    $errors['host'] = $error;
                }
                $error = $validator->checkIsValidMailEncryption($data['encryption']);
                if ($error) {
                    $errors['encrytion'] = $error;
                }
                $error = $validator->checkIsValidMailAuthMode($data['auth_mode']);
                if ($error) {
                    $errors['auth_mode'] = $error;
                }

                if (!empty($data['port'])) {
                    $error = $validator->checkIsPositiveNumber($data['port']);
                    if ($error) {
                        $errors['port'] = $error;
                    }
                }
                break;
        }

        if (count($errors) > 0) {
            return $errors;
        }

        $error = $this->testTransport($data);

        if ($error) {
            $errors['transport'] = $error;
        }

        return $errors;
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

    public function testTransport($data)
    {
        switch ($data['transport']) {
            case 'smtp':
                return $this->testSmtp($data);
            case 'gmail':
                return $this->testGmail($data);
            case 'sendmail':
                return $this->testSendmail($data);
        }
    }

    private function testSmtp(array $data)
    {
        $port = $data['port'];

        if (empty($port)) {
            $port = 'ssl' === $data['encryption'] ? 465 : 25;
        }

        try {
            $transport = new EsmtpTransport(
                $data['host'],
                $port,
                $data['encryption'],
                $this->eventDispatcher,
                $this->logger
            );
            $transport
                ->setUsername($data['username'])
                ->setPassword($data['password'])
                ->getStream()
                ->initialize();

            $transport->getStream()->terminate();
        } catch (TransportException $ex) {
            return static::UNABLE_TO_START_SMTP;
        }
    }

    private function testGmail(array $data)
    {
        try {
            $transport = new GmailSmtpTransport(
                $data['username'],
                $data['password'],
                $this->eventDispatcher,
                $this->logger
            );
            $transport->getStream()->initialize();
            $transport->getStream()->terminate();
        } catch (TransportException $ex) {
            return static::UNABLE_TO_START_GMAIL;
        }
    }

    private function testSendmail(array $data)
    {
        try {
            //allow to configure this
            $transport = new SendmailTransport(
                self::COMMAND,
                $this->eventDispatcher,
                $this->logger
            );
        } catch (TransportException $ex) {
            return static::UNABLE_TO_START_SENDMAIL;
        }
    }
}
