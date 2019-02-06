<?php

namespace Claroline\RssBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\RssBundle\Entity\Resource\RssFeed;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.rss")
 * @DI\Tag("claroline.serializer")
 */
class RssSerializer
{
    use SerializerTrait;

    public function serialize(RssFeed $rss)
    {
        return [
            'id' => $rss->getId(),
            'url' => $rss->getUrl(),
        ];
    }

    public function getClass()
    {
        return RssFeed::class;
    }

    public function deserialize($data, RssFeed $rss)
    {
        $this->sipe('url', 'setUrl', $data, $rss);

        return $rss;
    }
}
