<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\ScormBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\ScormBundle\Entity\ScoTracking;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.scorm.sco.tracking")
 * @DI\Tag("claroline.serializer")
 */
class ScoTrackingSerializer
{
    use SerializerTrait;

    /**
     * @param ScoTracking $scoTracking
     *
     * @return array
     */
    public function serialize(ScoTracking $scoTracking)
    {
        $sco = $scoTracking->getSco();

        return [
            'id' => $scoTracking->getUuid(),
            'sco' => [
                'id' => $sco->getUuid(),
            ],
            'scoreRaw' => $scoTracking->getScoreRaw(),
            'scoreMin' => $scoTracking->getScoreMin(),
            'scoreMax' => $scoTracking->getScoreMax(),
            'scoreScaled' => $scoTracking->getScoreScaled(),
            'lessonStatus' => $scoTracking->getLessonStatus(),
            'completionStatus' => $scoTracking->getCompletionStatus(),
            'sessionTime' => $scoTracking->getSessionTime(),
            'totalTimeInt' => $scoTracking->getTotalTimeInt(),
            'totalTimeString' => $scoTracking->getTotalTimeString(),
            'entry' => $scoTracking->getEntry(),
            'suspendData' => $scoTracking->getSuspendData(),
            'credit' => $scoTracking->getCredit(),
            'exitMode' => $scoTracking->getExitMode(),
            'lessonLocation' => $scoTracking->getLessonLocation(),
            'lessonMode' => $scoTracking->getLessonMode(),
            'bestScoreRaw' => $scoTracking->getBestScoreRaw(),
            'bestLessonStatus' => $scoTracking->getBestLessonStatus(),
            'isLocked' => $scoTracking->getIsLocked(),
            'details' => $scoTracking->getDetails(),
        ];
    }
}
