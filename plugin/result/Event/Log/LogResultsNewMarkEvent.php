<?php

namespace Claroline\ResultBundle\Event\Log;

use Claroline\CoreBundle\Event\Log\AbstractLogResourceEvent;
use Claroline\ResultBundle\Entity\Result;

/**
 * This file is part of the Claroline Connect package
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * Author: Panagiotis TSAVDARIS
 *
 * Date: 9/2/16
 */
class LogResultsNewMarkEvent extends AbstractLogResourceEvent
{
    const ACTION = 'resource-claroline_result-mark_added';

    /**
     * @param Result $result
     * @param array    $details
     */
    public function __construct(Result $result, $details)
    {
        parent::__construct($result->getResourceNode(), $details);
    }

    /**
     * @return array
     */
    public static function getRestriction()
    {
        return array(LogGenericEvent::DISPLAYED_WORKSPACE);
    }
}