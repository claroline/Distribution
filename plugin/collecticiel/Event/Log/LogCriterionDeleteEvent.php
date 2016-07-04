<?php

namespace Innova\CollecticielBundle\Event\Log;

use Claroline\CoreBundle\Event\Log\AbstractLogResourceEvent;
use Claroline\CoreBundle\Event\Log\LogGenericEvent;
use Innova\CollecticielBundle\Entity\Criterion;
use Innova\CollecticielBundle\Entity\Dropzone;

class LogCriterionDeleteEvent extends AbstractLogResourceEvent
{
    const ACTION = 'resource-innova_collecticiel-criterion_delete';

    /**
     * @param Dropzone  $dropzone
     * @param Criterion $criterion
     */
    public function __construct(Dropzone $dropzone, Criterion $criterion)
    {
        $details = [
            'dropzone' => [
                'id' => $dropzone->getId(),
            ],
            'criterion' => [
                'id' => $criterion->getId(),
                'instruction' => $criterion->getInstruction(),
            ],
        ];

        parent::__construct($dropzone->getResourceNode(), $details);
    }

    /**
     * @return array
     */
    public static function getRestriction()
    {
        return [LogGenericEvent::DISPLAYED_WORKSPACE];
    }
}
