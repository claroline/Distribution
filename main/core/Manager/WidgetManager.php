<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Manager;

use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Entity\Widget\Widget;
use Claroline\CoreBundle\Entity\Widget\WidgetDisplayConfig;
use Claroline\CoreBundle\Entity\Widget\WidgetHomeTabConfig;
use Claroline\CoreBundle\Entity\Widget\WidgetInstance;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Translation\TranslatorInterface;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Claroline\BundleRecorder\Log\LoggableTrait;
use Psr\Log\LoggerInterface;
use Claroline\CoreBundle\Entity\Home\HomeTab;
use Claroline\CoreBundle\Entity\Widget\SimpleTextConfig;

/**
 * @DI\Service("claroline.manager.widget_manager")
 */
class WidgetManager
{
    use LoggableTrait;

    private $om;
    private $widgetDisplayConfigRepo;
    private $widgetInstanceRepo;
    private $widgetRepo;
    private $router;
    private $translator;
    private $container;

    /**
     * Constructor.
     *
     * @DI\InjectParams({
     *     "om"         = @DI\Inject("claroline.persistence.object_manager"),
     *     "router"     = @DI\Inject("router"),
     *     "translator" = @DI\Inject("translator"),
     *     "container"  = @DI\Inject("service_container")
     * })
     */
    public function __construct(
        ObjectManager $om,
        RouterInterface $router,
        TranslatorInterface $translator,
        ContainerInterface $container
    ) {
        $this->om = $om;
        $this->widgetDisplayConfigRepo = $om->getRepository('ClarolineCoreBundle:Widget\WidgetDisplayConfig');
        $this->widgetInstanceRepo = $om->getRepository('ClarolineCoreBundle:Widget\WidgetInstance');
        $this->widgetRepo = $om->getRepository('ClarolineCoreBundle:Widget\Widget');
        $this->router = $router;
        $this->translator = $translator;
        $this->container = $container;
    }

    /**
     * @param \Claroline\CoreBundle\Entity\Widget\WidgetInstance $widgetInstance
     */
    public function removeInstance(WidgetInstance $widgetInstance)
    {
        $this->om->remove($widgetInstance);
        $this->om->flush();
    }

    public function persistWidget(Widget $widget)
    {
        $this->om->persist($widget);
        $this->om->flush();
    }

    /**
     * Finds all widgets.
     *
     * @return \Claroline\CoreBundle\Entity\Widget\Widget
     */
    public function getAll()
    {
        return  $this->widgetRepo->findAll();
    }

    public function generateWidgetDisplayConfigsForUser(User $user, array $widgetHTCs)
    {
        $results = array();
        $widgetInstances = array();
        $mappedWHTCs = array();
        $userTab = array();
        $adminTab = array();

        foreach ($widgetHTCs as $whtc) {
            $widgetInstance = $whtc->getWidgetInstance();
            $widgetInstances[] = $widgetInstance;

            if ($whtc->getType() === 'admin') {
                $mappedWHTCs[$widgetInstance->getId()] = $whtc;
            }
        }
        $usersWDCs = $this->getWidgetDisplayConfigsByUserAndWidgets($user, $widgetInstances);
        $adminWDCs = $this->getAdminWidgetDisplayConfigsByWidgets($widgetInstances);

        foreach ($usersWDCs as $userWDC) {
            $widgetInstanceId = $userWDC->getWidgetInstance()->getId();
            $userTab[$widgetInstanceId] = $userWDC;
        }

        foreach ($adminWDCs as $adminWDC) {
            $widgetInstanceId = $adminWDC->getWidgetInstance()->getId();
            $adminTab[$widgetInstanceId] = $adminWDC;
        }

        $this->om->startFlushSuite();

        foreach ($widgetInstances as $widgetInstance) {
            $id = $widgetInstance->getId();

            if (isset($userTab[$id])) {
                if (isset($mappedWHTCs[$id]) && isset($adminTab[$id])) {
                    $changed = false;

                    if ($userTab[$id]->getColor() !== $adminTab[$id]->getColor()) {
                        $userTab[$id]->setColor($adminTab[$id]->getColor());
                        $changed = true;
                    }

                    if ($mappedWHTCs[$id]->isLocked()) {
                        $userTab[$id]->setRow($adminTab[$id]->getRow());
                        $userTab[$id]->setColumn($adminTab[$id]->getColumn());
                        $userTab[$id]->setWidth($adminTab[$id]->getWidth());
                        $userTab[$id]->setHeight($adminTab[$id]->getHeight());
                        $changed = true;
                    }

                    if ($changed) {
                        $this->om->persist($userTab[$id]);
                    }
                }
                $results[$id] = $userTab[$id];
            } elseif (isset($adminTab[$id])) {
                $wdc = new WidgetDisplayConfig();
                $wdc->setWidgetInstance($widgetInstance);
                $wdc->setUser($user);
                $wdc->setRow($adminTab[$id]->getRow());
                $wdc->setColumn($adminTab[$id]->getColumn());
                $wdc->setWidth($adminTab[$id]->getWidth());
                $wdc->setHeight($adminTab[$id]->getHeight());
                $wdc->setColor($adminTab[$id]->getColor());
                $this->om->persist($wdc);
                $results[$id] = $wdc;
            } else {
                $widget = $widgetInstance->getWidget();
                $wdc = new WidgetDisplayConfig();
                $wdc->setWidgetInstance($widgetInstance);
                $wdc->setUser($user);
                $wdc->setWidth($widget->getDefaultWidth());
                $wdc->setHeight($widget->getDefaultHeight());
                $this->om->persist($wdc);
                $results[$id] = $wdc;
            }
        }
        $this->om->endFlushSuite();

        return $results;
    }

    public function generateWidgetDisplayConfigsForWorkspace(
        Workspace $workspace,
        array $widgetHTCs
    ) {
        $results = array();
        $widgetInstances = array();
        $workspaceTab = array();

        foreach ($widgetHTCs as $htc) {
            $widgetInstances[] = $htc->getWidgetInstance();
        }
        $workspaceWDCs = $this->getWidgetDisplayConfigsByWorkspaceAndWidgets(
            $workspace,
            $widgetInstances
        );

        foreach ($workspaceWDCs as $wdc) {
            $widgetInstanceId = $wdc->getWidgetInstance()->getId();

            $workspaceTab[$widgetInstanceId] = $wdc;
        }

        $this->om->startFlushSuite();

        foreach ($widgetInstances as $widgetInstance) {
            $id = $widgetInstance->getId();

            if (isset($workspaceTab[$id])) {
                $results[$id] = $workspaceTab[$id];
            } else {
                $widget = $widgetInstance->getWidget();
                $wdc = new WidgetDisplayConfig();
                $wdc->setWidgetInstance($widgetInstance);
                $wdc->setWorkspace($workspace);
                $wdc->setWidth($widget->getDefaultWidth());
                $wdc->setHeight($widget->getDefaultHeight());
                $this->om->persist($wdc);
                $results[$id] = $wdc;
            }
        }
        $this->om->endFlushSuite();

        return $results;
    }

    public function generateWidgetDisplayConfigsForAdmin(array $widgetHTCs)
    {
        $results = array();
        $widgetInstances = array();
        $adminTab = array();

        foreach ($widgetHTCs as $htc) {
            $widgetInstances[] = $htc->getWidgetInstance();
        }
        $adminWDCs = $this->getWidgetDisplayConfigsByWidgetsForAdmin($widgetInstances);

        foreach ($adminWDCs as $wdc) {
            $widgetInstanceId = $wdc->getWidgetInstance()->getId();

            $adminTab[$widgetInstanceId] = $wdc;
        }

        $this->om->startFlushSuite();

        foreach ($widgetInstances as $widgetInstance) {
            $id = $widgetInstance->getId();

            if (isset($adminTab[$id])) {
                $results[$id] = $adminTab[$id];
            } else {
                $widget = $widgetInstance->getWidget();
                $wdc = new WidgetDisplayConfig();
                $wdc->setWidgetInstance($widgetInstance);
                $wdc->setWidth($widget->getDefaultWidth());
                $wdc->setHeight($widget->getDefaultHeight());
                $this->om->persist($wdc);
                $results[$id] = $wdc;
            }
        }
        $this->om->endFlushSuite();

        return $results;
    }

    public function persistWidgetDisplayConfigs(array $configs)
    {
        $this->om->startFlushSuite();

        foreach ($configs as $config) {
            $this->om->persist($config);
        }
        $this->om->endFlushSuite();
    }

    public function persistWidgetConfigs(
        WidgetInstance $widgetInstance = null,
        WidgetHomeTabConfig $widgetHomeTabConfig = null,
        WidgetDisplayConfig $widgetDisplayConfig = null
    ) {
        if ($widgetInstance) {
            $this->om->persist($widgetInstance);
        }

        if ($widgetHomeTabConfig) {
            $this->om->persist($widgetHomeTabConfig);
        }

        if ($widgetDisplayConfig) {
            $this->om->persist($widgetDisplayConfig);
        }
        $this->om->flush();
    }

    /************************************
     * Access to TeamRepository methods *
     ************************************/

    public function getWidgetDisplayConfigsByUserAndWidgets(
        User $user,
        array $widgetInstances,
        $executeQuery = true
    ) {
        return count($widgetInstances) > 0 ?
            $this->widgetDisplayConfigRepo->findWidgetDisplayConfigsByUserAndWidgets(
                $user,
                $widgetInstances,
                $executeQuery
            ) :
            array();
    }

    public function getAdminWidgetDisplayConfigsByWidgets(
        array $widgetInstances,
        $executeQuery = true
    ) {
        return count($widgetInstances) > 0 ?
            $this->widgetDisplayConfigRepo->findAdminWidgetDisplayConfigsByWidgets(
                $widgetInstances,
                $executeQuery
            ) :
            array();
    }

    public function getWidgetDisplayConfigsByWorkspaceAndWidgets(
        Workspace $workspace,
        array $widgetInstances,
        $executeQuery = true
    ) {
        return count($widgetInstances) > 0 ?
            $this->widgetDisplayConfigRepo->findWidgetDisplayConfigsByWorkspaceAndWidgets(
                $workspace,
                $widgetInstances,
                $executeQuery
            ) :
            array();
    }

    public function getWidgetDisplayConfigsByWidgetsForAdmin(
        array $widgetInstances,
        $executeQuery = true
    ) {
        return count($widgetInstances) > 0 ?
            $this->widgetDisplayConfigRepo->findWidgetDisplayConfigsByWidgetsForAdmin(
                $widgetInstances,
                $executeQuery
            ) :
            array();
    }

    public function getWidgetDisplayConfigsByWorkspaceAndWidgetHTCs(
        Workspace $workspace,
        array $widgetHomeTabConfigs,
        $executeQuery = true
    ) {
        return count($widgetHomeTabConfigs) > 0 ?
            $this->widgetDisplayConfigRepo->findWidgetDisplayConfigsByWorkspaceAndWidgetHTCs(
                $workspace,
                $widgetHomeTabConfigs,
                $executeQuery
            ) :
            array();
    }

    public function importTextFromCsv($file)
    {
        $data = file_get_contents($file);
        $data = $this->container->get('claroline.utilities.misc')->formatCsvOutput($data);
        $lines = str_getcsv($data, PHP_EOL);
        $textWidget = $this->om->getRepository('ClarolineCoreBundle:Widget\Widget')->findOneByName('simple_text');
        $this->om->startFlushSuite();
        $i = 0;

        foreach ($lines as $line) {
            $values = str_getcsv($line, ';');
            $code = $values[0];
            $workspace = $this->om->getRepository('ClarolineCoreBundle:Workspace\Workspace')->findOneByCode($code);
            $name = $values[1];
            $title = $values[2];
            $width = isset($values[3]) ? $values[3] : 4;
            $height = isset($values[4]) ? $values[4] : 3;
            $tab = $this->om->getRepository('ClarolineCoreBundle:Home\HomeTab')->findOneBy(['workspace' => $workspace, 'name' => $name]);
            $widgetInstance = $this->om->getRepository('ClarolineCoreBundle:Widget\WidgetInstance')
                ->findOneBy(['workspace' => $workspace, 'name' => $title]);

            if (!$widgetInstance) {
                $widgetInstance = $this->createWidgetInstance(
                    $title,
                    $textWidget,
                    $tab,
                    $workspace
                );
            } else {
                $this->log("Widget {$title} already exists in workspace {$code}: Updating...");
            }

            $simpleTextConfig = $this->container->get('claroline.manager.simple_text_manager')->getTextConfig($widgetInstance);

            if (!$simpleTextConfig) {
                $simpleTextConfig = new SimpleTextConfig();
                $simpleTextConfig->setWidgetInstance($widgetInstance);
            }

            $widgetDisplayConfigs = $widgetInstance->getWidgetDisplayConfigs();
            $widgetDisplayConfig = $widgetDisplayConfigs[0];
            $widgetDisplayConfig->setHeight($height);
            $widgetDisplayConfig->setWidth($width);
            $this->om->persist($widgetDisplayConfig);
            $content = file_get_contents($values[3]);
            $simpleTextConfig->setContent($content);
            $this->om->persist($simpleTextConfig);

            ++$i;

            if ($i % 100 === 0) {
                $this->om->forceFlush();
                $this->om->clear();
                $textWidget = $this->om->getRepository('ClarolineCoreBundle:Widget\Widget')->findOneByName('simple_text');
                $this->om->merge($textWidget);
            }
        }

        $this->om->endFlushSuite();
    }

    public function createWidgetInstance(
        $name,
        Widget $widget,
        HomeTab $homeTab,
        Workspace $workspace = null,
        $isAdmin = false,
        $isLocked = false
    ) {
        $this->log("Create widget {$name} in {$workspace->getCode()}");
        $widgetInstance = new WidgetInstance();
        $widgetHomeTabConfig = new WidgetHomeTabConfig();
        $widgetDisplayConfig = new WidgetDisplayConfig();

        if ($workspace) {
            $type = 'workspace';
            $isDesktop = false;
        } else {
            $type = 'user';
            $isDesktop = true;
        }

        $widgetInstance->setWorkspace($workspace);
        $widgetInstance->setName($name);
        $widgetInstance->setIsAdmin($isAdmin);
        $widgetInstance->setIsDesktop($isDesktop);
        $widgetInstance->setWidget($widget);
        $widgetHomeTabConfig->setHomeTab($homeTab);
        $widgetHomeTabConfig->setWidgetInstance($widgetInstance);
        $widgetHomeTabConfig->setWorkspace($workspace);
        $widgetHomeTabConfig->setLocked($isLocked);
        $widgetHomeTabConfig->setWidgetOrder(1);
        $widgetHomeTabConfig->setType($type);
        $widgetDisplayConfig->setWidgetInstance($widgetInstance);
        $widgetDisplayConfig->setWorkspace($workspace);
        $widgetDisplayConfig->setWidth($widget->getDefaultWidth());
        $widgetDisplayConfig->setHeight($widget->getDefaultHeight());
        $this->om->persist($widgetInstance);
        $this->om->persist($widgetHomeTabConfig);
        $this->om->persist($widgetDisplayConfig);

        return $widgetInstance;
    }

    public function setLogger(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    public function getLogger()
    {
        return $this->logger;
    }
}
