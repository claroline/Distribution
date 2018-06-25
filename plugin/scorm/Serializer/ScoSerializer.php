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
use Claroline\ScormBundle\Entity\Sco;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.scorm.sco")
 * @DI\Tag("claroline.serializer")
 */
class ScoSerializer
{
    use SerializerTrait;

    /**
     * @param Sco $sco
     *
     * @return array
     */
    public function serialize(Sco $sco)
    {
        $scorm = $sco->getScorm();
        $parent = $sco->getScoParent();

        return [
            'id' => $sco->getUuid(),
            'scorm' => !empty($scorm) ? ['id' => $scorm->getUuid()] : null,
            'data' => [
                'entryUrl' => $sco->getEntryUrl(),
                'identifier' => $sco->getIdentifier(),
                'title' => $sco->getTitle(),
                'visible' => $sco->isVisible(),
                'parameters' => $sco->getParameters(),
                'launchData' => $sco->getLaunchData(),
                'maxTimeAllowed' => $sco->getMaxTimeAllowed(),
                'timeLimitAction' => $sco->getTimeLimitAction(),
                'block' => $sco->isBlock(),
                'scoreToPassInt' => $sco->getScoreToPassInt(),
                'scoreToPassDecimal' => $sco->getScoreToPassDecimal(),
                'scoreToPass' => !empty($scorm) ? $sco->getScoreToPass() : null,
                'completionThreshold' => $sco->getCompletionThreshold(),
                'prerequisites' => $sco->getPrerequisites(),
            ],
            'parent' => !empty($parent) ? ['id' => $parent->getUuid()] : null,
            'children' => array_map(function (Sco $scoChild) {
                return $this->serialize($scoChild);
            }, $sco->getScoChildren()->toArray()),
        ];
    }

    /**
     * @param array $data
     * @param Sco   $sco
     *
     * @return Sco
     */
    public function deserialize($data, Sco $sco)
    {
        $this->sipe('id', 'setUuid', $data, $sco);
        $this->sipe('data.entryUrl', 'setEntryUrl', $data, $sco);
        $this->sipe('data.identifier', 'setIdentifier', $data, $sco);
        $this->sipe('data.title', 'setTitle', $data, $sco);
        $this->sipe('data.visible', 'setVisible', $data, $sco);
        $this->sipe('data.parameters', 'setParameters', $data, $sco);
        $this->sipe('data.launchData', 'setLaunchData', $data, $sco);
        $this->sipe('data.maxTimeAllowed', 'setMaxTimeAllowed', $data, $sco);
        $this->sipe('data.timeLimitAction', 'setTimeLimitAction', $data, $sco);
        $this->sipe('data.block', 'setBlock', $data, $sco);
        $this->sipe('data.scoreToPassInt', 'setScoreToPassInt', $data, $sco);
        $this->sipe('data.scoreToPassDecimal', 'setScoreToPassDecimal', $data, $sco);
        $this->sipe('data.completionThreshold', 'setCompletionThreshold', $data, $sco);
        $this->sipe('data.prerequisites', 'setPrerequisites', $data, $sco);

        return $sco;
    }
}
