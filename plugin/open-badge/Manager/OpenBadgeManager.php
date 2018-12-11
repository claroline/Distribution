<?php

namespace Claroline\OpenBadgeBundle\Manager;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Claroline\OpenBadgeBundle\Entity\Assertion;
use Claroline\OpenBadgeBundle\Entity\BadgeClass;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.manager.open_badge_manager")
 */
class OpenBadgeManager
{
    /**
     * Crud constructor.
     *
     * @DI\InjectParams({
     *     "om" = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param ObjectManager $om
     */
    public function __construct(ObjectManager $om)
    {
        $this->om = $om;
    }

    public function addAssertion(BadgeClass $badge, User $user)
    {
        $assertion = $this->om->getRepository(Assertion::class)->findOneBy(['badge' => $badge, 'recipient' => $user]);

        if (!$assertion) {
            $assertion = new Assertion();
            $assertion->setBadge($badge);
            $assertion->setRecipient($user);
            $assertion->setImage($badge->getImage());
        }

        $assertion->setRevoked(false);

        $this->om->persist($assertion);
        $this->om->flush();
    }

    public function revokeAssertion(Assertion $assertion)
    {
        $assertion->setRevoked(true);
        $this->om->persist($assertion);
        $this->om->flush();
    }
}
