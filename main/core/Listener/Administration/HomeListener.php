<?php

namespace Claroline\CoreBundle\Listener\Administration;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\Tab\HomeTab;
use Claroline\CoreBundle\Event\OpenAdministrationToolEvent;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service()
 */
class HomeListener
{
    /** @var FinderProvider */
    private $finder;

    /**
     * HomeListener constructor.
     *
     * @DI\InjectParams({
     *     "finder" = @DI\Inject("claroline.api.finder")
     * })
     *
     * @param FinderProvider $finder
     */
    public function __construct(FinderProvider $finder)
    {
        $this->finder = $finder;
    }

    /**
     * Displays analytics administration tool.
     *
     * @DI\Observe("administration_tool_home")
     *
     * @param OpenAdministrationToolEvent $event
     */
    public function onDisplayTool(OpenAdministrationToolEvent $event)
    {
        $tabs = $this->finder->search(
          HomeTab::class,
          ['filters' => ['type' => HomeTab::TYPE_ADMIN_DESKTOP]]
        );

        $tabs = array_filter($tabs['data'], function ($data) {
            return $data !== [];
        });

        foreach ($tabs as $tab) {
            $orderedTabs[$tab['position']] = $tab;
        }
        ksort($orderedTabs);

        $roles = $this->finder->search('Claroline\CoreBundle\Entity\Role',
          ['filters' => ['type' => Role::PLATFORM_ROLE]]
        );

        $event->setData([
            'editable' => true,
            'administration' => true,
            'tabs' => array_values($orderedTabs),
            'roles' => $roles['data'],
        ]);
        $event->stopPropagation();
    }
}
