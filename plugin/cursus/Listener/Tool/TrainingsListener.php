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

use Claroline\AppBundle\API\Options;
use Claroline\CoreBundle\API\Serializer\ParametersSerializer;
use Claroline\CoreBundle\Event\Tool\OpenToolEvent;

class TrainingsListener
{
    /** @var ParametersSerializer */
    private $parametersSerializer;

    /**
     * TrainingsListener constructor.
     *
     * @param ParametersSerializer $parametersSerializer
     */
    public function __construct(
        ParametersSerializer $parametersSerializer
    ) {
        $this->parametersSerializer = $parametersSerializer;
    }

    /**
     * @param OpenToolEvent $event
     */
    public function onDisplayDesktop(OpenToolEvent $event)
    {
        $parameters = $this->parametersSerializer->serialize([Options::SERIALIZE_MINIMAL]);

        $event->setData([
            'parameters' => $parameters['cursus'],
        ]);
        $event->stopPropagation();
    }
}
