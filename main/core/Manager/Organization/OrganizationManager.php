<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Manager\Organization;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\BundleRecorder\Log\LoggableTrait;
use Claroline\CoreBundle\Entity\Organization\Organization;

class OrganizationManager
{
    use LoggableTrait;

    private $om;

    public function __construct(ObjectManager $om)
    {
        $this->om = $om;
        $this->repo = $om->getRepository('ClarolineCoreBundle:Organization\Organization');
    }

    public function getDefault($createIfEmpty = false)
    {
        $defaultOrganization = $this->repo->findOneByDefault(true);

        if ($createIfEmpty && null === $defaultOrganization) {
            $defaultOrganization = $this->createDefault(true);
        }

        return $defaultOrganization;
    }

    public function createDefault($force = false)
    {
        if (!$force && $this->getDefault()) {
            return;
        }
        $this->log('Adding default organization...');
        $orga = new Organization();
        $orga->setName('default');
        $orga->setDefault(true);
        $orga->setPosition(1);
        $orga->setParent(null);
        $this->om->persist($orga);
        $this->om->flush();

        return $orga;
    }

    public function getOrganizationsByIds(array $ids)
    {
        return $this->repo->findOrganizationsByIds($ids);
    }

    public function getAllOrganizations()
    {
        return $this->repo->findAll();
    }
}
