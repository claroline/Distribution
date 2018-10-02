<?php

namespace Claroline\CoreBundle\API\Serializer\Widget;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Finder\Home\WidgetContainerFinder;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\Tab\HomeTab;
use Claroline\CoreBundle\Entity\Tab\HomeTabConfig;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Widget\WidgetContainer;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.home_tab")
 * @DI\Tag("claroline.serializer")
 *
 * @todo simplify relationships (there are lots of duplicates)
 * @todo simplify serialized structure
 */
class HomeTabSerializer
{
    use SerializerTrait;

    private $serializer;
    private $om;
    private $widgetContainerFinder;

    /**
     * ContactSerializer constructor.
     *
     * @DI\InjectParams({
     *     "serializer"            = @DI\Inject("claroline.api.serializer"),
     *     "om"                    = @DI\Inject("claroline.persistence.object_manager"),
     *     "widgetContainerFinder" = @DI\Inject("claroline.api.finder.widget_container")
     * })
     *
     * @param SerializerProvider    $serializer
     * @param ObjectManager         $om
     * @param WidgetContainerFinder $widgetContainerFinder
     */
    public function __construct(
        SerializerProvider $serializer,
        ObjectManager $om,
        WidgetContainerFinder $widgetContainerFinder
    ) {
        $this->serializer = $serializer;
        $this->om = $om;
        $this->widgetContainerFinder = $widgetContainerFinder;
    }

    public function getClass()
    {
        return HomeTab::class;
    }

    public function serialize(HomeTab $homeTab, array $options = []): array
    {
        $homeTabConfig = $this->getConfig($homeTab);

        if (!$homeTabConfig) {
            //something went wrong
            return [];
        }

        /** @var WidgetContainer[] $savedContainers */
        $savedContainers = $homeTab->getWidgetContainers()->toArray();
        $containers = [];

        foreach ($savedContainers as $container) {
            //temporary
            $widgetContainerConfig = $container->getWidgetContainerConfigs()[0];
            if ($widgetContainerConfig) {
                if (!array_key_exists($widgetContainerConfig->getPosition(), $containers)) {
                    $containers[$widgetContainerConfig->getPosition()] = $container;
                } else {
                    $containers[] = $container;
                }
            }
        }

        ksort($containers);
        $containers = array_values($containers);

        $poster = null;

        if ($homeTab->getPoster()) {
            $file = $this->om
                ->getRepository('Claroline\CoreBundle\Entity\File\PublicFile')
                ->findOneBy(['url' => $homeTab->getPoster()]);

            if ($file) {
                $poster = $this->serializer->serialize($file);
            }
        }

        return [
            'id' => $this->getUuid($homeTab, $options),
            'title' => $homeTabConfig->getName(),
            'longTitle' => $homeTabConfig->getLongTitle(),
            'centerTitle' => $homeTabConfig->isCenterTitle(),
            'poster' => $poster,
            'icon' => $homeTabConfig->getIcon(),
            'type' => $homeTab->getType(),
            'position' => $homeTabConfig->getTabOrder(),
            'restrictions' => [
                'hidden' => !$homeTabConfig->isLocked(),
                'roles' => array_map(function (Role $role) {
                    return $role->getUuid();
                }, $homeTabConfig->getRoles()),
            ],
            'user' => $homeTab->getUser() ? $this->serializer->serialize($homeTab->getUser(), [Options::SERIALIZE_MINIMAL]) : null,
            'workspace' => $homeTab->getWorkspace() ? $this->serializer->serialize($homeTab->getWorkspace(), [Options::SERIALIZE_MINIMAL]) : null,
            'widgets' => array_map(function ($container) use ($options) {
                return $this->serializer->serialize($container, $options);
            }, $containers),
        ];
    }

    public function deserialize(array $data, HomeTab $homeTab, array $options = []): HomeTab
    {
        $homeTabConfig = $this->om->getRepository(HomeTabConfig::class)
          ->findOneBy(['homeTab' => $homeTab]);

        if (!$homeTabConfig) {
            $homeTabConfig = new HomeTabConfig();
            $homeTabConfig->setHomeTab($homeTab);
        }

        if (isset($data['position'])) {
            $homeTabConfig->setPosition($data['position']);
        }

        $this->sipe('id', 'setUuid', $data, $homeTab);
        $this->sipe('title', 'setName', $data, $homeTabConfig);
        $this->sipe('longTitle', 'setLongTitle', $data, $homeTabConfig);
        $this->sipe('centerTitle', 'setCenterTitle', $data, $homeTabConfig);
        $this->sipe('poster.url', 'setPoster', $data, $homeTab);
        $this->sipe('icon', 'setIcon', $data, $homeTabConfig);
        $this->sipe('type', 'setType', $data, $homeTab);

        if (isset($data['restrictions'])) {
            if (isset($data['restrictions']['hidden'])) {
                $homeTabConfig->setLocked(!$data['restrictions']['hidden']);
            }

            if (isset($data['restrictions']['roles'])) {
                foreach ($data['restrictions']['roles'] as $roleUuid) {
                    /** @var Role $role */
                    $role = $this->om->getRepository(Role::class)->findOneBy(['uuid' => $roleUuid]);

                    $homeTabConfig->addRole($role);
                }

                $existingRoles = $homeTabConfig->getRoles();

                foreach ($existingRoles as $role) {
                    if (!in_array($role->getUuid(), $data['roles'])) {
                        // the role no longer exist we can remove it
                        $homeTabConfig->removeRole($role);
                    }
                }
            }
        }

        if (isset($data['workspace'])) {
            $workspace = $this->serializer->deserialize(Workspace::class, $data['workspace']);
            $homeTab->setWorkspace($workspace);
        }

        if (isset($data['user'])) {
            $user = $this->serializer->deserialize(User::class, $data['user'], $options);
            $homeTab->setUser($user);
        }

        // We either do this or cascade persist ¯\_(ツ)_/¯
        $this->om->persist($homeTabConfig);
        $containerIds = [];

        if (isset($data['widgets'])) {
            foreach ($data['widgets'] as $position => $widgetContainer) {
                /** @var WidgetContainer $widgetContainer */
                $widgetContainer = $this->serializer->deserialize(WidgetContainer::class, $widgetContainer, $options);
                $widgetContainer->setHomeTab($homeTab);
                $widgetContainerConfig = $widgetContainer->getWidgetContainerConfigs()[0];
                $widgetContainerConfig->setPosition($position);
                $this->om->persist($widgetContainerConfig);
                $containerIds[] = $widgetContainer->getUuid();
            }
        }

        return $homeTab;
    }

    /**
     * @param HomeTab $tab
     *
     * @return HomeTabConfig
     */
    public function getConfig(HomeTab $tab)
    {
        /** @var HomeTabConfig $homeTabConfig */
        $homeTabConfig = $this->om->getRepository(HomeTabConfig::class)
          ->findOneBy(['homeTab' => $tab]);

        return $homeTabConfig;
    }
}
