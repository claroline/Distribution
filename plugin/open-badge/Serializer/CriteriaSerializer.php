<?php

namespace Claroline\OpenBadgeBundle\Serializer;

use Claroline\OpenBadgeBundle\Entity\BadgeClass;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Routing\RouterInterface;

/**
 * @DI\Service("claroline.serializer.open_badge.criteria")
 */
class CriteriaSerializer
{
    /**
     * @DI\InjectParams({
     *     "router" = @DI\Inject("router")
     * })
     *
     * @param Router $router
     */
    public function __construct(RouterInterface $router)
    {
        $this->router = $router;
    }

    public function serialize(BadgeClass $badge)
    {
        return  [
            'type' => 'Criteria',
            'narrative' => $badge->getCriteria(),
            'id' => $this->router->generate('apiv2_open_badge__criteria', ['badge' => $badge->getUuid()]),
        ];
    }
}
