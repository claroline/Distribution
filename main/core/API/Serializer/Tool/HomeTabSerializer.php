<?php

namespace Claroline\CoreBundle\API\Serializer\Tool;

use Claroline\AppBundle\API\SerializerProvider;
use Claroline\CoreBundle\Entity\Tool\Home\HomeTab;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.home_tab")
 * @DI\Tag("claroline.serializer")
 */
class HomeTabSerializer
{
    private $serializer;

    /**
     * ContactSerializer constructor.
     *
     * @DI\InjectParams({
     *     "serializer" = @DI\Inject("claroline.api.serializer"),
     * })
     *
     * @param SerializerProvider $serializer
     */
    public function __construct(
        SerializerProvider $serializer
    ) {
        $this->serializer = $serializer;
    }

    public function getClass()
    {
        return HomeTab::class;
    }

    public function serialize(HomeTab $homeTab, array $options = [])
    {
        $widgetHomeTabConfigs = $homeTab->getWidgetHomeTabConfigs();
        $widgetInstances = [];
        $containers = [];

        foreach ($widgetHomeTabConfigs as $config) {
            $widgetInstance = $config->getWidgetInstance();
            $container = $widgetInstance->getContainer();
            if (!array_key_exists($container->getUuid(), $containers)) {
                $containers[$container->getUuid()] = $container;
            }
        }

        return [
          'widgets' => array_map(function ($container) {
              return $this->serialize($container);
          }, $containers),
        ];
    }

    public function deserialize(array $data, HomeTab $homeTab, array $options = [])
    {/*
        foreach () {

        }*/

        return $widget;
    }
}
