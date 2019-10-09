<?php

namespace Claroline\ForumBundle\Listener\DataSource;

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Claroline\AppBundle\API\FinderProvider;
use Claroline\CoreBundle\Entity\DataSource;
use Claroline\CoreBundle\Event\DataSource\GetDataEvent;
use Claroline\ForumBundle\Entity\Message;
use JMS\DiExtraBundle\Annotation as DI;

class ForumSource
{
    /** @var FinderProvider */
    private $finder;

    /**
     * ForumSource constructor.
     *
     * @param FinderProvider $finder
     */
    public function __construct(FinderProvider $finder)
    {
        $this->finder = $finder;
    }

    /**
     * @DI\Observe("data_source.forum_messages.load")
     *
     * @param GetDataEvent $event
     */
    public function getData(GetDataEvent $event)
    {
        $options = $event->getOptions() ? $event->getOptions() : [];
        $options['hiddenFilters']['moderation'] = false;

        if (DataSource::CONTEXT_WORKSPACE === $event->getContext()) {
            $options['hiddenFilters']['workspace'] = $event->getWorkspace()->getUuid();
        } elseif (DataSource::CONTEXT_HOME === $event->getContext()) {
            $options['hiddenFilters']['anonymous'] = true;
        }
        $event->setData(
            $this->finder->search(Message::class, $options)
        );

        $event->stopPropagation();
    }
}
