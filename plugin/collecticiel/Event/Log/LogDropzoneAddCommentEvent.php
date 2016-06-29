<?php

namespace Innova\CollecticielBundle\Event\Log;

use Claroline\CoreBundle\Event\Log\AbstractLogResourceEvent;
use Claroline\CoreBundle\Event\Log\NotifiableInterface;
use Innova\CollecticielBundle\Entity\Comment;
use Innova\CollecticielBundle\Entity\Dropzone;

class LogDropzoneAddCommentEvent extends AbstractLogResourceEvent implements NotifiableInterface
{
    const ACTION = 'resource-innova_collecticiel-dropzone_add_comment';

    protected $dropzone;
    protected $newState;
    protected $details;
    private $userIds = [];

    /**
     * @param Wiki         $wiki
     * @param Section      $section
     * @param Contribution $contribution
     */
    public function __construct(Dropzone $dropzone, $newstate, $userIds, Comment $comment)
    {
        $this->dropzone = $dropzone;
        $this->comment = $comment;
        $this->newState = $dropzone->getResourceNode()->getName();
        $this->userIds = $userIds;

        $this->details = [
//            'newState'=> $this->newState
        ];

        $this->userId = $dropzone->getDrops()[0]->getUser()->getId();

        // Récupération du nom et du prénom
        $this->firstName = $dropzone->getDrops()[0]->getUser()->getFirstName();
        $this->lastName = $dropzone->getDrops()[0]->getUser()->getLastName();

        parent::__construct($dropzone->getResourceNode(), $this->details);
    }

    /**
     * @return array
     */
    public static function getRestriction()
    {
        return [self::DISPLAYED_WORKSPACE];
    }

    public function getDropzone()
    {
        return $this->$dropzone;
    }

    /**
     * Get sendToFollowers boolean.
     * 
     * @return bool
     */
    public function getSendToFollowers()
    {
        return true;
    }

    /**
     * Get includeUsers array of user ids.
     * Reports are only reported to user witch have the manager role.
     *
     * @return array
     */
    public function getIncludeUserIds()
    {
        return $this->userIds;
    }

    /**
     * Get excludeUsers array of user ids.
     *
     * @return array
     */
    public function getExcludeUserIds()
    {
        return [];
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
     * Get iconTypeUrl string.
     *
     * @return string
     */
    public function getIconKey()
    {
        return 'dropzone';
    }

    /**
     * Get details.
     *
     * @return array
     */
    public function getNotificationDetails()
    {
        $notificationDetails = array_merge($this->details, []);

        $notificationDetails['resource'] = [
            'id' => $this->dropzone->getId(),
            'name' => $this->firstName.' '.$this->lastName, // $this->resource->getName(),
            'type' => $this->dropzone->getResourceNode()->getName().
            ' : '.substr(strip_tags($this->comment->getCommentText()), 0, 10),
        ];

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
