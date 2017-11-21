<?php

namespace HeVinci\UrlBundle\Listener;

use Claroline\CoreBundle\Event\Resource\DecorateResourceNodeEvent;
use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * Class ApiListener.
 *
 * @DI\Service
 */
class ApiListener
{
    /** @var ObjectManager */
    private $om;

    /**
     * @DI\InjectParams({
     *     "om" = @DI\Inject("claroline.persistence.object_manager"),
     * })
     */
    public function __construct(ObjectManager $om)
    {
        $this->om = $om;
    }

    /**
     * @DI\Observe("serialize_resource_node")
     */
    public function onSerialize(DecorateResourceNodeEvent $event)
    {
        // Restrict listener to Url resources only
        $resourceNode = $event->getResourceNode();
        if ($resourceNode->getResourceType()->getName() === 'hevinci_url') {
            $isYoutube = false;

            $resource = $this->om->getRepository('HeVinciUrlBundle:Url')->findOneByResourceNode($resourceNode);

            // Is it a youtube video ?
            $youtubeId = $this->getYoutubeId($resource->getUrl());
            if ($youtubeId !== false) {
                $thumbnailUrl = 'http://img.youtube.com/vi/'.$youtubeId.'/hqdefault.jpg';
                $event->add('poster', $thumbnailUrl);
                $isYoutube = true;
            }

            $event->add('url', [
                'isYoutube' => $isYoutube,
            ]);
        }
    }

    private function getYoutubeId($url)
    {
        $parsedUrl = parse_url($url);

        switch ($parsedUrl['host']) {
            case 'www.youtube.com':
                parse_str($parsedUrl['query'], $parsedQuery);

                return $parsedQuery['v'];
            case 'youtu.be':
                return substr($parsedUrl['path'], 1);
            default:
                break;
        }

        return false;
    }
}
