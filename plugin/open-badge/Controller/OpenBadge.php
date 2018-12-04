<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\OpenBadgeBundle\Controller;

use Claroline\OpenBadgeBundle\Entity\BadgeClass;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

/**
 * @Route("/openbadge2")
 */
class OpenBadgeController
{
    /**
     * @DI\InjectParams({
     *     "serializer" = @DI\Inject("claroline.api.serializer")
     * })
     */
    public function _construct(SerializerProvider $serializer)
    {
        $this->serializer = $serializer;
    }

    public function getBadgeAction(BadgeClass $badge)
    {
    }

    public function getAssertionAction(BadgeClass $badge)
    {
    }
}
