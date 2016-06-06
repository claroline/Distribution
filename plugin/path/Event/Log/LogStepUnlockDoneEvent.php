<?php
namespace Innova\PathBundle\Event\Log;

use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Event\Log\AbstractLogResourceEvent;
use Claroline\CoreBundle\Event\Log\NotifiableInterface;
use Innova\PathBundle\Entity\Step;

class LogStepUnlockDoneEvent extends AbstractLogResourceEvent //log associated to a resource
    implements NotifiableInterface //mandatory for a log to be used as a notification
{
    const       ACTION = 'resource-innova_path-step_unlockdone';

    protected $step;
    protected $details;
    private $userIds = array();

    public function __construct(Step $step, $userIds=array())
    {
        $this->step     = $step;
        $this->userIds  = $userIds;
        $this->details  = array(
            'unlock' => array(
                'path'      => $step->getPath()->getId(),
                'step'      => $step->getId(),
                'stepname'  => $step->getName()
            )
        );
        parent::__construct($step->getPath()->getResourceNode(), $this->details);
    }

    /**
     * @return array
     */
    public static function getRestriction()
    {
        return array(self::DISPLAYED_WORKSPACE);
    }
    /**
     * Get sendToFollowers boolean.
     *
     * @return boolean
     */
    public function getSendToFollowers()
    {
        return true;
    }
    /**
     * Get includeUsers array of user ids.
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
        return array();
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
        return "path";
    }
    /**
     * Get details
     *
     * @return array
     */
    public function getNotificationDetails()
    {
        $notificationDetails = array_merge($this->details, array());
        $notificationDetails['resource'] = array(
            'id'    => $this->step->getPath()->getId(),
            'name'  => $this->resource->getName(),
            'type'  => $this->resource->getResourceType()->getName()
        );
        return $notificationDetails;
    }
    /**
     * Get if event is allowed to create notification or not
     *
     * @return boolean
     */
    public function isAllowedToNotify()
    {
        return true;
    }
}
