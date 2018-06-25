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
use Claroline\AppBundle\Persistence\ObjectManager;
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

    /** @var ObjectManager */
    private $om;
    /** @var ScoSerializer */
    private $scoSerializer;

    private $scoRepo;

    /**
     * ScormSerializer constructor.
     *
     * @DI\InjectParams({
     *     "om"            = @DI\Inject("claroline.persistence.object_manager"),
     *     "scoSerializer" = @DI\Inject("claroline.serializer.scorm.sco")
     * })
     *
     * @param ObjectManager $om
     * @param ScoSerializer $scoSerializer
     */
    public function __construct(ObjectManager $om, ScoSerializer $scoSerializer)
    {
        $this->om = $om;
        $this->scoSerializer = $scoSerializer;

        $this->scoRepo = $om->getRepository('Claroline\ScormBundle\Entity\Sco');
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
            'hashName' => $scorm->getHashName(),
            'scos' => $this->serializeScos($scorm),
        ];
    }

    /**
     * @param array $data
     * @param Scorm $scorm
     *
     * @return Scorm
     */
    public function deserialize($data, Scorm $scorm)
    {
        $this->sipe('hashName', 'setHashName', $data, $scorm);
        $this->sipe('version', 'setVersion', $data, $scorm);

        if (isset($data['scos'])) {
            $this->deserializeScos($data['scos'], $scorm, null);
        }

        return $scorm;
    }

    private function serializeScos(Scorm $scorm)
    {
        return array_map(function (Sco $sco) {
            return $this->scoSerializer->serialize($sco);
        }, $scorm->getScos()->toArray());
    }

    private function deserializeScos($data, Scorm $scorm, Sco $parent = null)
    {
        $scos = [];

        foreach ($data as $scoData) {
            $sco = $this->scoRepo->findOneBy(['uuid' => $scoData['id']]);

            if (empty($sco)) {
                $sco = $this->scoSerializer->deserialize($scoData, new Sco());
                $sco->setScorm($scorm);
            }
            $scos[$sco->getUuid()] = $sco;
        }
        foreach ($data as $scoData) {
            if (isset($scoData['parent']['id'])) {
                $scos[$scoData['id']]->setParent($scos[$scoData['parent']['id']]);
            }
            $this->om->persist($scos[$scoData['id']]);
        }
    }
}
