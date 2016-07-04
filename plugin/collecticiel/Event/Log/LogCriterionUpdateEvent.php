<?php

namespace Innova\CollecticielBundle\Event\Log;

use Claroline\CoreBundle\Event\Log\AbstractLogResourceEvent;
use Claroline\CoreBundle\Event\Log\LogGenericEvent;
use Innova\CollecticielBundle\Entity\Criterion;
use Innova\CollecticielBundle\Entity\Dropzone;

class LogCriterionUpdateEvent extends AbstractLogResourceEvent
{
    const ACTION = 'resource-innova_collecticiel-criterion_update';

    /**
     * @param Dropzone  $dropzone
     * @param mixed     $dropzoneChangeSet
     * @param Criterion $criterion
     * @param mixed     $criterionChangeSet
     */
    public function __construct(Dropzone $dropzone, $dropzoneChangeSet, Criterion $criterion, $criterionChangeSet)
    {
        $details = [
            'dropzone' => [
                'id' => $dropzone->getId(),
                'changeSet' => $dropzoneChangeSet,
            ],
            'criterion' => [
                'id' => $criterion->getId(),
                'changeSet' => $criterionChangeSet,
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
