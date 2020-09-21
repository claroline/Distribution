<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CursusBundle\Listener\Tool;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\API\Options;
use Claroline\CoreBundle\API\Serializer\ParametersSerializer;
use Claroline\CoreBundle\Event\Tool\OpenToolEvent;
use Claroline\CursusBundle\Entity\CourseSession;

class TrainingEventsListener
{
    /** @var FinderProvider */
    private $finder;
    /** @var ParametersSerializer */
    private $parametersSerializer;

    /**
     * TrainingEventsListener constructor.
     *
     * @param FinderProvider       $finder
     * @param ParametersSerializer $parametersSerializer
     */
    public function __construct(
        FinderProvider $finder,
        ParametersSerializer $parametersSerializer
    ) {
        $this->finder = $finder;
        $this->parametersSerializer = $parametersSerializer;
    }

    /**
     * @param OpenToolEvent $event
     */
    public function onDisplayWorkspace(OpenToolEvent $event)
    {
        $parameters = $this->parametersSerializer->serialize([Options::SERIALIZE_MINIMAL]);
        $sessionList = $this->finder->search(CourseSession::class, [
            'filters' => ['workspace' => $event->getWorkspace()->getUuid()],
        ], [Options::SERIALIZE_MINIMAL]);

        $event->setData([
            'parameters' => $parameters['cursus'],
            'sessions' => $sessionList['data'],
        ]);
        $event->stopPropagation();
    }
}
