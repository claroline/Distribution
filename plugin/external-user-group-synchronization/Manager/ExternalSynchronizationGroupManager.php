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

    public function importExternalGroup($externalGroupId, $roles, $source, $name)
    {
        $internalGroup = new Group();

        $internalGroup->setName($name);
        $internalGroup->setPlatformRoles($roles);
        $this->groupManager->insertGroup($internalGroup);
        $externalGroup = new ExternalGroup($externalGroupId, $source, $internalGroup);
        $this->om->persist($externalGroup);
        $this->om->flush();

        return $externalGroup;
    }

    public function getExternalGroupsBySourceSlug($sourceSlug)
    {
        return $this->externalGroupRepo->findBy(['sourceSlug' => $sourceSlug]);
    }

    public function updateExternalGroupDate(ExternalGroup $externalGroup)
    {
        if ($externalGroup->updateLastSynchronizationDate()) {
            $this->om->persist($externalGroup);
            $this->om->flush();
        }
    }

    public function removeGroupsFromDeletedExternalSource($source)
    {
        $groups = $this->externalGroupRepo->findBySourceSlug($source);
        foreach ($groups as $group) {
            $this->om->remove($group);
        }
        $this->om->flush();
    }

    public function updateGroupsFromUpdatedExternalSource($old_source, $new_source)
    {
        $groups = $this->externalGroupRepo->findBySourceSlug($old_source);
        foreach ($groups as $group) {
            $group->setSourceSlug($new_source);
        }
        $this->om->flush();
    }
}
