<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\OpenBadgeBundle\Listener;

use Claroline\AppBundle\API\SerializerProvider;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service()
 */
class RuleListener
{
    /**
     * BadgeListener constructor.
     *
     * @DI\InjectParams({
     *     "serializer"        = @DI\Inject("claroline.api.serializer")
     * })
     */
    public function __construct(
        SerializerProvider $serializer
    ) {
        $this->serializer = $serializer;
    }

    /**
     * @DI\Observe("resource_evaluation")
     *
     * @param ResourceEvaluationEvent $event
     */
    public function onResourceEvaluation(ResourceEvaluationEvent $event)
    {
        $evaluation = $event->getEvaluation();

        //check the list of rules for the current node
    }
}
