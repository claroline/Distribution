<?php
/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Date: 5/19/17
 */

namespace Claroline\AuthenticationBundle\Manager\ExternalSynchronization;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\AuthenticationBundle\Entity\ExternalSynchronization\ExternalUser;
use Claroline\AuthenticationBundle\Repository\ExternalSynchronization\ExternalUserRepository;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Pager\PagerFactory;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * Class ExternalSynchronizationManager.
 *
 * @DI\Service("claroline.manager.external_user_sync_manager")
 */
class ExternalSynchronizationUserManager
{
    /** @var ObjectManager */
    private $om;
    /** @var ExternalUserRepository */
    private $externalUserRepo;
    /** @var PagerFactory */
    private $pagerFactory;

    /**
     * @DI\InjectParams({
     *     "om"                     = @DI\Inject("claroline.persistence.object_manager"),
     *     "pagerFactory"           = @DI\Inject("claroline.pager.pager_factory")
     * })
     *
     * @param ObjectManager $om
     * @param PagerFactory  $pagerFactory
     */
    public function __construct(
        ObjectManager $om,
        PagerFactory $pagerFactory
    ) {
        $this->om = $om;
        $this->pagerFactory = $pagerFactory;
        $this->externalUserRepo = $om->getRepository('ClarolineAuthenticationBundle:ExternalSynchronization\ExternalUser');
    }

    public function getExternalUserByExternalIdAndSourceSlug($externalId, $sourceSlug)
    {
        return $this->externalUserRepo->findOneBy(['externalUserId' => $externalId, 'sourceSlug' => $sourceSlug]);
    }

    /**
     * @param $externalIds
     * @param $sourceSlug
     *
     * @return array
     */
    public function getExternalUsersByExternalIdsAndSourceSlug($externalIds, $sourceSlug)
    {
        return $this->externalUserRepo->findByExternalIdsAndSourceSlug($externalIds, $sourceSlug);
    }

    public function createExternalUser($externalId, $sourceSlug, User $user)
    {
        $externalUser = new ExternalUser($externalId, $sourceSlug, $user);
        $this->om->persist($externalUser);
        $this->om->flush();

        return $externalUser;
    }

    public function updateExternalUserDate(ExternalUser $externalUser)
    {
        if ($externalUser->updateLastSynchronizationDate()) {
            $this->om->persist($externalUser);
            $this->om->flush();
        }
    }

    /**
     * @param $externalId
     * @param $sourceSlug
     * @param User $user
     * @param $referenceUserIds
     * @param ExternalUser[] $referenceUsers
     *
     * @return ExternalUser
     */
    public function createOrUpdateExternalUser(
        $externalId,
        $sourceSlug,
        User $user,
        $referenceUserIds,
        $referenceUsers
    ) {
        // Check if user's external reference has been updated, if so update it.
        if (false !== ($key = array_search($user->getId(), $referenceUserIds))) {
            $externalUser = $referenceUsers[$key];
            $externalUser->setExternalUserId($externalId);
            $externalUser->setSourceSlug($sourceSlug);
            $externalUser->updateLastSynchronizationDate();
            $this->om->persist($externalUser);
            $this->om->flush();

            return $externalUser;
        }

        // Otherwise create new user
        return $this->createExternalUser($externalId, $sourceSlug, $user);
    }

    public function searchExternalUsersForSource(
        $source,
        $page = 1,
        $max = 50,
        $orderBy = 'username',
        $direction = 'ASC',
        $search = ''
    ) {
        return $this->externalUserRepo->searchForSourcePaginated($source, $page, $max, $orderBy, $direction, $search);
    }

    public function countExternalUsersForSourceAndSearch($source, $search = '')
    {
        return $this->externalUserRepo->countBySearchForSource($source, $search);
    }

    public function deleteUsersForExternalSource($source)
    {
        $this->externalUserRepo->deleteBySourceSlug($source);
    }

    public function updateUsersExternalSourceName($old_source, $new_source)
    {
        $this->externalUserRepo->updateSourceSlug($old_source, $new_source);
    }

    public function deleteExternalUserByUserId($userId)
    {
        $this->externalUserRepo->deleteExternalUserByUserId($userId);
    }

    public function getExternalUsersByUserIds(array $userIds)
    {
        return $this->externalUserRepo->findBy(['user' => $userIds]);
    }
}
