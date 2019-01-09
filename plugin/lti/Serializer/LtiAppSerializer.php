<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace UJM\LtiBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use JMS\DiExtraBundle\Annotation as DI;
use UJM\LtiBundle\Entity\LtiApp;

/**
 * @DI\Service("claroline.serializer.lti.app")
 * @DI\Tag("claroline.serializer")
 */
class LtiAppSerializer
{
    use SerializerTrait;

    /**
     * @return string
     */
    public function getSchema()
    {
        return '#/plugin/lti/app.json';
    }

    /**
     * @param LtiApp $app
     *
     * @return array
     */
    public function serialize(LtiApp $app)
    {
        $serialized = [
            'id' => $app->getUuid(),
            'title' => $app->getTitle(),
            'url' => $app->getUrl(),
            'appKey' => $app->getAppkey(),
            'secret' => $app->getSecret(),
            'description' => $app->getDescription(),
        ];

        return $serialized;
    }

    /**
     * @param array  $data
     * @param LtiApp $app
     *
     * @return LtiApp
     */
    public function deserialize($data, LtiApp $app)
    {
        $this->sipe('id', 'setUuid', $data, $app);
        $this->sipe('title', 'setTitle', $data, $app);
        $this->sipe('url', 'setUrl', $data, $app);
        $this->sipe('appKey', 'setAppkey', $data, $app);
        $this->sipe('secret', 'setSecret', $data, $app);
        $this->sipe('description', 'setDescription', $data, $app);

        return $app;
    }
}
