<?php
/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Date: 5/17/17
 */

namespace Claroline\ExternalSynchronizationBundle\Manager;

use Claroline\CoreBundle\Manager\GroupManager;
use Claroline\CoreBundle\Pager\PagerFactory;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\ExternalSynchronizationBundle\Entity\ExternalGroup;
use Claroline\ExternalSynchronizationBundle\Repository\ExternalGroupRepository;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * Class ExternalSynchronizationManager.
 *
 * @DI\Service("claroline.manager.external_user_group_sync_group_manager")
 */
class ExternalSynchronizationGroupManager
{
    /** @var ObjectManager */
    private $om;
    /** @var GroupManager */
    private $groupManager;
    /** @var ExternalGroupRepository */
    private $externalGroupRepo;
    /** @var PagerFactory */
    private $pagerFactory;

    /**
     * @DI\InjectParams({
     *     "om"                     = @DI\Inject("claroline.persistence.object_manager"),
     *     "groupManager"           = @DI\Inject("claroline.manager.group_manager"),
     *     "pagerFactory"           = @DI\Inject("claroline.pager.pager_factory")
     * })
     *
     * @param ObjectManager $om
     * @param GroupManager  $groupManager
     * @param PagerFactory  $pagerFactory
     */
    public function __construct(
        ObjectManager $om,
        GroupManager $groupManager,
        PagerFactory $pagerFactory
    ) {
        $this->om = $om;
        $this->groupManager = $groupManager;
        $this->pagerFactory = $pagerFactory;
        $this->externalGroupRepo = $om->getRepository('ClarolineExternalSynchronizationBundle:ExternalGroup');
    }

    public function getExternalGroupById($id)
    {
        return $this->externalGroupRepo->findOneById($id);
    }

    public function getExternalGroupByExternalIdAndSourceSlug($externalId, $sourceSlug)
    {
        return $this->externalGroupRepo->findOneBy(['externalGroupId' => $externalId, 'sourceSlug' => $sourceSlug]);
    }

    public function getExternalGroupsByRolesAndSearch(
        array $roles,
        $search = null,
        $page = 1,
        $max = 50,
        $orderedBy = 'name',
        $order = 'ASC'
    ) {
        $query = $this->externalGroupRepo->findByRolesAndSearch($roles, $search, $orderedBy, $order, false);

        return $this->pagerFactory->createPager($query, $page, $max);
    }
}
