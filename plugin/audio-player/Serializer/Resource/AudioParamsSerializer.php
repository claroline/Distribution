<?php

namespace Claroline\AudioPlayerBundle\Serializer\Resource;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AudioPlayerBundle\Entity\Resource\AudioParams;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline_audio.serializer.audio_params")
 * @DI\Tag("claroline.serializer")
 */
class AudioParamsSerializer
{
    use SerializerTrait;

    /**
     * @param AudioParams $audioParams
     * @param array       $options
     *
     * @return array
     */
    public function serialize(AudioParams $audioParams, array $options = [])
    {
        return [
            'id' => $audioParams->getUuid(),
            'sectionCommentsAllowed' => $audioParams->isCommentsAllowed(),
            'rateControl' => $audioParams->getRateControl(),
        ];
    }

    /**
     * @param array       $data
     * @param AudioParams $audioParams
     * @param array       $options
     *
     * @return AudioParams
     */
    public function deserialize($data, AudioParams $audioParams, array $options = [])
    {
        $this->sipe('sectionCommentsAllowed', 'setCommentsAllowed', $data, $audioParams);
        $this->sipe('rateControl', 'setRateControl', $data, $audioParams);

        return $audioParams;
    }
}
