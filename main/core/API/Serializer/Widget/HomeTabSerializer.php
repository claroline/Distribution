<?php

namespace Claroline\CoreBundle\API\Serializer\Widget;

use Claroline\AppBundle\API\SerializerProvider;
use Claroline\CoreBundle\Entity\Home\HomeTab;
use Claroline\CoreBundle\Entity\Widget\WidgetContainer;
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

    public function serialize(HomeTab $homeTab, array $options = []): array
    {
        $widgetHomeTabConfigs = $homeTab->getWidgetHomeTabConfigs();
        $widgetHomeTabConfigs = [];
        $containers = [];

        foreach ($widgetHomeTabConfigs as $config) {
            $container = $config->getWidgetInstance()->getContainer();

            if ($container) {
                $containers[$container->getUuid()] = $container;
            }
        }

        return [
          'widgets' => array_map(function ($container) {
              $this->serializer->serialize($container);
          }, $containers),
        ];
    }

    public function deserialize(array $data, HomeTab $homeTab, array $options = []): HomeTab
    {
        foreach ($data['widgets'] as $widgetContainer) {
            $this->serializer->deserialize(WidgetContainer::class, $widgetContainer);
        }

        return $widget;
    }
}
