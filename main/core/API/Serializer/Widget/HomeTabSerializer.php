<?php

namespace Claroline\CoreBundle\API\Serializer\Widget;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Home\HomeTab;
use Claroline\CoreBundle\Entity\Home\HomeTabConfig;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Widget\WidgetContainer;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.home_tab")
 * @DI\Tag("claroline.serializer")
 */
class HomeTabSerializer
{
    use SerializerTrait;

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
        $this->sipe('title', 'setName', $data, $homeTab);
        $this->sipe('description', 'setDescription', $data, $homeTab);
        $this->sipe('poster', 'setPoster', $data, $homeTab);
        $this->sipe('icon', 'setIcon', $data, $homeTab);

        //persist cascade might ne beeded aswell
        $homeTabConfig = $this->om->getRepository(HomeTabConfig::class)
            ->findOneBy(['homeTab' => $homeTab]);

        if (!$homeTabConfig) {
            $homeTabConfig = new HomeTabConfig();
            $homeTabConfig->setHomeTab($homeTab);
        }

        if (isset($data['position'])) {
            $homeTabConfig->setPosition($data['position']);
        }

        $this->sipe('position', 'setPosition', $data, $homeTab);

        if (isset($data['workspace'])) {
            $workspace = $this->serializer->deserialize(Workspace::class, $data['workspace']);
            $homeTab->setWorkspace($workspace);
            $homeTabConfig->setWorkspace($workspace);
        }

        if (isset($data['user'])) {
            $user = $this->serializer->deserialize(User::class, $data['user']);
            $homeTab->setUser($user);
            $homeTabConfig->setUser($user);
        }

        foreach ($data['widgets'] as $widgetContainer) {
            $this->serializer->deserialize(WidgetContainer::class, $widgetContainer);
        }

        return $widget;
    }
}
