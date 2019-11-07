<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\ForumBundle\Event;

use Claroline\CoreBundle\Event\Log\LogGenericEvent;
use Claroline\CoreBundle\Event\Log\NotifiableInterface;
use Claroline\ForumBundle\Entity\Subject;

class LogSubjectEvent extends LogGenericEvent implements NotifiableInterface
{
    /**
     * Constructor.
     */
    public function __construct(Subject $subject, array $usersToNotify = [], $action)
    {
        $this->usersToNotify = $usersToNotify;
        $this->subject = $subject;
        $node = $subject->getForum()->getResourceNode();

        parent::__construct(
            $action,
            [
                'resource' => [
                    'name' => $node->getName(),
                    'path' => $node->getPathForCreationLog(),
                    'id' => $node->getId(),
                    'guid' => $node->getGuid(),
                    'resourceType' => $node->getResourceType()->getName(),
                ],
                'forum' => [
                    'id' => $subject->getForum()->getId(),
                    'uuid' => $subject->getForum()->getUuid(),
                ],
                'subject' => [
                  'title' => $subject->getTitle(),
                  'id' => $subject->getId(),
                  'uuid' => $subject->getUuid(),
                ],
                'owner' => [
                    'id' => $subject->getCreator()->getId(),
                    'uuid' => $subject->getCreator()->getUuid(),
                    'lastName' => $subject->getCreator()->getLastName(),
                    'firstName' => $subject->getCreator()->getFirstName(),
                ],
                'workspace' => [
                    'id' => $node->getWorkspace()->getId(),
                    'name' => $node->getWorkspace()->getName(),
                    'code' => $node->getWorkspace()->getCode(),
                ],
            ],
            null,
            null,
            $node,
            null,
            $node->getWorkspace(),
            $subject->getCreator()
        );
    }

    public function setUsersToNotify(array $usersToNotify)
    {
        $this->usersToNotify = $usersToNotify;
    }

    /**
     * @return array
     */
    public static function getRestriction()
    {
        return [];
    }

    /**
     * Get sendToFollowers boolean.
     *
     * @return bool
     */
    public function getSendToFollowers()
    {
        return false;
    }

    /**
     * Get includeUsers array of user ids.
     *
     * @return array
     */
    public function getIncludeUserIds()
    {
        $ids = [];

        foreach ($this->usersToNotify as $user) {
            $ids[] = $user->getId();
        }

        return $ids;
    }

    /**
     * Get excludeUsers array of user ids.
     *
     * @return array
     */
    public function getExcludeUserIds()
    {
        return [$this->message->getCreator()->getId()];
    }

    /**
     * Get actionKey string.
     *
     * @return string
     */
    public function getActionKey()
    {
        return $this::ACTION;
    }

    /**
     * Get iconKey string.
     *
     * @return string
     */
    public function getIconKey()
    {
        //Icon key is null here because we need default icon for platform notifications
        return;
    }

    /**
     * Get details.
     *
     * @return array
     */
    public function getNotificationDetails()
    {
        $notificationDetails = array_merge($this->details, []);

        return $notificationDetails;
    }

    /**
     * Get if event is allowed to create notification or not.
     *
     * @return bool
     */
    public function isAllowedToNotify()
    {
        return true;
    }
}
