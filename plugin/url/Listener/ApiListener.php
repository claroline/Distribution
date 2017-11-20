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
        $resource = $this->om->getRepository('HeVinciUrlBundle:Url')->findOneByResourceNode($event->getResourceNode());

        // Detect if an automatic poster can be displayed if none has been defined
        if ($event->getInjectedData()['poster'] === null && $resource !== null) {

            // Is it a youtube video ?
            $youtubeId = $this->getYoutubeId($resource->getUrl());
            if ($youtubeId !== false) {
                $thumbnailUrl = 'http://img.youtube.com/vi/'.$youtubeId.'/hqdefault.jpg';
                $event->add('poster', $thumbnailUrl);
            }
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
