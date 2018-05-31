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
use Claroline\ScormBundle\Entity\Scorm;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.scorm")
 * @DI\Tag("claroline.serializer")
 */
class ScormSerializer
{
    use SerializerTrait;

    /** @var ScoSerializer */
    private $scoSerializer;

    /**
     * ScormSerializer constructor.
     *
     * @DI\InjectParams({
     *     "scoSerializer" = @DI\Inject("claroline.serializer.scorm.sco")
     * })
     *
     * @param ScoSerializer $scoSerializer
     */
    public function __construct(ScoSerializer $scoSerializer)
    {
        $this->scoSerializer = $scoSerializer;
    }

    /**
     * @param Scorm $scorm
     *
     * @return array
     */
    public function serialize(Scorm $scorm)
    {
        return [
            'id' => $scorm->getUuid(),
            'version' => $scorm->getVersion(),
            'filePath' => $scorm->getFilePath(),
            'scos' => $this->serializeScos($scorm),
        ];
    }

    private function serializeScos(Scorm $scorm)
    {
        return array_map(function (Sco $sco) {
            return $this->scoSerializer->serialize($sco);
        }, $scorm->getScos());
    }
}
