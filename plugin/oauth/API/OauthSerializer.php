<?php

namespace Icap\OAuthBundle\API;

use Claroline\CoreBundle\API\Serializer\AbstractSerializer;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.oauth")
 * @DI\Tag("claroline.serializer")
 */
class OauthSerializer extends AbstractSerializer
{
    public function serialize($object, array $options = [])
    {
        $data = parent::serialize($object, $options);
        $data->user = $object->getUser()->getUsername();

        return $data;
    }

    public function deserialize($class, $data, array $options = [])
    {
        $object = parent::deserialize($class, $data, $options);
        $user = $this->om->getRepository('ClarolineCoreBundle:User')->lookFor($data->user);
        $object->setUser($user);

        return $object;
    }

    public function getClass()
    {
        return 'Icap\OAuthBundle\Entity\OauthUser';
    }
}
