<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\LinkBundle\Listener\Resource;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Event\Resource\DeleteResourceEvent;
use Claroline\CoreBundle\Event\Resource\ResourceActionEvent;
use Claroline\LinkBundle\Manager\ShortcutManager;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * Integrates the "Shortcut" resource.
 *
 * @DI\Service
 */
class ResourceListener
{
    /** @var ObjectManager */
    private $shortcutManager;

    /**
     * ShortcutListener constructor.
     *
     * @DI\InjectParams({
     *     "shortcutManager" = @DI\Inject("claroline.manager.shortcut")
     * })
     *
     * @param ShortcutManager $shortcutManager
     */
    public function __construct(
        ShortcutManager $shortcutManager
    ) {
        $this->shortcutManager = $shortcutManager;
    }

    /**
     * Gets all shortcuts of a resource.
     *
     * @DI\Observe("resource.shortcuts")
     *
     * @param DeleteResourceEvent $event
     */
    public function shortcuts(DeleteResourceEvent $event)
    {
        /*$this->shortcutManager->removeShortcutsTo($event->getResourceNode());*/
    }

    /**
     * Removes all linked shortcuts when a resource is deleted.
     *
     * @DI\Observe("resource.delete")
     *
     * @param ResourceActionEvent $event
     */
    public function delete(ResourceActionEvent $event)
    {
        $this->shortcutManager->removeShortcutsTo($event->getResourceNode());
    }
}
