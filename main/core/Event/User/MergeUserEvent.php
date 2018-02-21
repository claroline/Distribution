<?php

namespace Claroline\CoreBundle\Event\User;

use Claroline\CoreBundle\Entity\User;
use Symfony\Component\EventDispatcher\Event;

/**
 * Event dispatched when two users are merged.
 */
class MergeUserEvent extends Event
{
    /** @var User */
    private $kept;

    /** @var User */
    private $removed;

    /** @var array */
    private $messages = [];

    /**
     * DecorateUserEvent constructor.
     *
     * @param User  $kept
     * @param User  $removed
     * @param array $messages
     */
    public function __construct(
        User $kept,
        User $removed,
        array $messages = [])
    {
        $this->kept = $kept;
        $this->removed = $removed;
        $this->messages = $messages;
    }

    /**
     * Gets the user being serialized.
     *
     * @return User
     */
    public function getKept()
    {
        return $this->kept;
    }

    public function getMessages()
    {
        return $this->messages;
    }

    /**
     * Adds custom message to the event.
     *
     * @param string $message
     */
    public function addMessage($message)
    {
        $this->messages[] = $message;
    }
}
