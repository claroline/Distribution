<?php

namespace Icap\BadgeBundle\Controller\Tool;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Icap\BadgeBundle\Entity\Badge;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class BadgeController extends Controller
{
    public function myWorkspaceBadgeAction(Workspace $workspace, User $loggedUser, $badgePage)
    {
        /** @var \Claroline\CoreBundle\Rule\Validator $badgeRuleValidator */
        $badgeRuleValidator = $this->get('claroline.rule.validator');

        /** @var \Icap\BadgeBundle\Entity\Badge[] $workspaceBadges */
        $workspaceBadges = $this->getDoctrine()->getManager()->getRepository('IcapBadgeBundle:Badge')->findByWorkspace($workspace);

        $ownedBadges = [];
        /** @var \Icap\BadgeBundle\Entity\Badge[] $finishedBadges */
        $finishedBadges = [];
        $inProgressBadges = [];
        $availableBadges = [];
        $displayedBadges = [];

        foreach ($workspaceBadges as $workspaceBadge) {
            $isOwned = false;
            foreach ($workspaceBadge->getUserBadges() as $userBadge) {
                if ($loggedUser->getId() === $userBadge->getUser()->getId()) {
                    $ownedBadges[] = $userBadge;
                    $isOwned = true;
                }
            }

            if (!$isOwned) {
                $nbBadgeRules = count($workspaceBadge->getRules());
                $validatedRules = $badgeRuleValidator->validate($workspaceBadge, $loggedUser);

                if (0 < $nbBadgeRules && 0 < $validatedRules['validRules']) {
                    if ($validatedRules['validRules'] >= $nbBadgeRules) {
                        $finishedBadges[] = $workspaceBadge;
                    } else {
                        $inProgressBadges[] = $workspaceBadge;
                    }
                } else {
                    $availableBadges[] = $workspaceBadge;
                }
            }
        }

        // Create badge list to display (owned badges first, in progress badges and then other badges)
        $displayedBadges = [];
        foreach ($ownedBadges as $ownedBadge) {
            $displayedBadges[] = [
                'type' => 'owned',
                'badge' => $ownedBadge,
            ];
        }

        $claimedBadges = [];

        if (count($finishedBadges) > 0) {
            /** @var \Icap\BadgeBundle\Manager\BadgeClaimManager $badgeClaimManager */
            $badgeClaimManager = $this->get('icap_badge.manager.badge_claim');
            /** @var \Icap\badgeBundle\Entity\BadgeClaim $claimedBadges */
            $claimedBadges = $badgeClaimManager->getByUser($loggedUser);
        }

        foreach ($finishedBadges as $finishedBadge) {
            $badgeType = 'finished';

            if (isset($claimedBadges[$finishedBadge->getId()])) {
                $badgeType = 'claimed';
            }

            $displayedBadges[] = [
                'type' => $badgeType,
                'badge' => $finishedBadge,
            ];
        }

        foreach ($inProgressBadges as $inProgressBadge) {
            $displayedBadges[] = [
                'type' => 'inprogress',
                'badge' => $inProgressBadge,
            ];
        }

        foreach ($availableBadges as $availableBadge) {
            $displayedBadges[] = [
                'type' => 'available',
                'badge' => $availableBadge,
            ];
        }

        /** @var \Claroline\CoreBundle\Pager\PagerFactory $pagerFactory */
        $pagerFactory = $this->get('claroline.pager.pager_factory');
        $badgePager = $pagerFactory->createPagerFromArray($displayedBadges, $badgePage, 10);

        return $this->render(
            'IcapBadgeBundle:Template:Tool/list.html.twig',
            [
                'badgePager' => $badgePager,
                'workspace' => $workspace,
                'badgePage' => $badgePage,
            ]
        );
    }
}
