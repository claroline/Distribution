<?php

namespace Claroline\CoreBundle\API\Serializer\Widget;

use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Home\HomeTab;
use Claroline\CoreBundle\Entity\Home\HomeTabConfig;
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
     *     "om"         = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param SerializerProvider $serializer
     */
    public function __construct(
        SerializerProvider $serializer,
        ObjectManager $om
    ) {
        $this->serializer = $serializer;
        $this->om = $om;
    }

    public function getClass()
    {
        return HomeTab::class;
    }

    public function serialize(HomeTab $homeTab, array $options = []): array
    {
        $widgetHomeTabConfigs = $homeTab->getWidgetHomeTabConfigs();
        $containers = [];

        foreach ($widgetHomeTabConfigs as $config) {
            $container = $config->getWidgetInstance()->getContainer();

            if ($container) {
                $containers[$container->getUuid()] = $container;
            }
        }

        //probablement pas ça
        $homeTabConfig = $this->om->getRepository(HomeTabConfig::class)
          ->findOneBy(['homeTab' => $homeTab]);

        return [
          'title' => $homeTab->getName(),
          'description' => $homeTab->getDescription(),
          'poster' => $homeTab->getPoster(),
          'icon' => $homeTab->getIcon(),
          'position' => $homeTabConfig->getTabOrder(),
          'widgets' => array_map(function ($container) {
              return $this->serializer->serialize($container);
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
