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
        return [
            'id' => $sco->getUuid(),
        ];
    }
}
