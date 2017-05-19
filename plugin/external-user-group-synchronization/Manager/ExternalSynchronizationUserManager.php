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

namespace Claroline\ExternalSynchronizationBundle\Manager;

use Claroline\CoreBundle\Pager\PagerFactory;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\ExternalSynchronizationBundle\Repository\ExternalUserRepository;
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
        $this->externalUserRepo = $om->getRepository('ClarolineExternalSynchronizationBundle:ExternalUser');
    }

    public function getExternalUserByExternalIdAndSourceSlug($externalId, $sourceSlug)
    {
        return $this->externalUserRepo->findOneBy(['externalUserId' => $externalId, 'sourceSlug' => $sourceSlug]);
    }

    public function getExternalUsersByExternalIdsAndSourceSlug($externalIds, $sourceSlug)
    {
        return $this->externalUserRepo->findByExternalIdsAndSourceSlug($externalIds, $sourceSlug);
    }
}
