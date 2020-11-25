<?php

namespace Claroline\CoreBundle\Tests\Unit\Library\Mailing\Client;

use Claroline\CoreBundle\Library\Mailing\Client\SymfonyMailer;
use Claroline\CoreBundle\Library\Mailing\Message;
use Claroline\CoreBundle\Library\Testing\MockeryTestCase;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class MailerTest extends MockeryTestCase
{
    public function testEmailWithMessageData()
    {
        $message = $this->getMessageData();

        $email = new Email();

        $email->subject($message->getAttribute('subject'));
        $email->from($message->getAttribute('from'));
        $email->replyTo($message->getAttribute('reply_to'));
        $email->html($message->getAttribute('body'));
        $email->bcc(...$message->getAttribute('bcc'));
        $email->to(...$message->getAttribute('to'));

        $this->assertSame('Subject', $email->getSubject());
        $this->assertSame('from@claroline.com', $email->getFrom()[0]->getAddress());
        $this->assertSame('reply_to@claroline.com', $email->getReplyTo()[0]->getAddress());
        $this->assertSame('to@claroline.com', $email->getTo()[0]->getAddress());
        $this->assertCount(2, $email->getBcc());
    }

    public function testSend()
    {
        $mailer = $this->mock(MailerInterface::class);
        $mailer->shouldReceive('send')->once();

        $symfonyMailer = new SymfonyMailer($mailer);

        $message = $this->getMessageData();

        $this->assertSame('Subject', $message->getAttribute('subject'));
        $this->assertSame('from@claroline.com', $message->getAttribute('from'));
        $this->assertSame('reply_to@claroline.com', $message->getAttribute('reply_to'));
        $this->assertSame('<p>Hello</p>', $message->getAttribute('body'));
        $this->assertSame('bcc1@claroline.com', $message->getAttribute('bcc')[0]);
        $this->assertSame('bcc2@claroline.com', $message->getAttribute('bcc')[1]);
        $this->assertCount(2, $message->getAttribute('bcc'));
        $this->assertSame('to@claroline.com', $message->getAttribute('to')[0]);
        $this->assertTrue($symfonyMailer->send($message));
    }

    public function getMessageData()
    {
        $message = new Message();
        $message->subject('Subject');
        $message->from('from@claroline.com');
        $message->replyTo('reply_to@claroline.com');
        $message->body('<p>Hello</p>');
        $message->bcc(['bcc1@claroline.com', 'bcc2@claroline.com']);
        $message->to('to@claroline.com');

        return $message;
    }
}
