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

use Claroline\CoreBundle\Entity\Group;
use Claroline\CoreBundle\Manager\GroupManager;
use Claroline\CoreBundle\Pager\PagerFactory;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\ExternalSynchronizationBundle\Entity\ExternalGroup;
use Claroline\ExternalSynchronizationBundle\Manager\ExternalSynchronizationManager;
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
    /** @var ExternalSynchronizationManager */
    private $externalSyncManager;
    /** @var PagerFactory */
    private $pagerFactory;

    /**
     * @DI\InjectParams({
     *     "om"                     = @DI\Inject("claroline.persistence.object_manager"),
     *     "groupManager"           = @DI\Inject("claroline.manager.group_manager"),
     *     "externalSyncManager"    = @DI\Inject("claroline.manager.external_user_group_sync_manager"),
     *     "pagerFactory"           = @DI\Inject("claroline.pager.pager_factory")
     * })
     *
     * @param ObjectManager $om
     * @param GroupManager  $groupManager
     * @param ExternalSynchronizationManager $externalSyncManager
     * @param PagerFactory  $pagerFactory
     */
    public function __construct(
        ObjectManager $om,
        GroupManager $groupManager,
        ExternalSynchronizationManager $externalSyncManager,
        PagerFactory $pagerFactory
    ) {
        $this->om = $om;
        $this->groupManager = $groupManager;
        $this->pagerFactory = $pagerFactory;
        $this->externalGroupRepo = $om->getRepository('ClarolineExternalSynchronizationBundle:ExternalGroup');
        $this->externalSyncManager = $externalSyncManager;
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

    public function importExternalGroup($externalGroupId, $roles, $source)
    {
        $internalGroup = new Group();

        $repo = $this->externalSyncManager->getRepositoryForExternalSource($this->externalSyncManager->getExternalSource($source));
        $name = $repo->findOneGroupById($externalGroupId)['name'];

        $internalGroup->setName($name);
        $internalGroup->setPlatformRoles($roles);
        $this->groupManager->insertGroup($internalGroup);

        $externalGroup = new ExternalGroup();
        $externalGroup
            ->setExternalGroupId($externalGroupId)
            ->setSourceSlug($source)
            ->setGroup($internalGroup);

        $this->om->persist($externalGroup);
        $this->om->flush();

        //TODO: Import Users
    }
}
