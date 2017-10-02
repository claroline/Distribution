<?php

namespace Claroline\CoreBundle\Entity\Model;

use Claroline\CoreBundle\Entity\Organization\Organization;
use Doctrine\Common\Collections\ArrayCollection;

trait OrganizationsTrait
{
    use HasPropertyTrait;

    /**
     * Add an organization.
     */
    public function addOrganization(Organization $organization)
    {
        $this->propertyExists('organizations');

        if (!$this->organizations->contains($organization)) {
            $this->organizations->add($organization);
        }
    }

    /**
     * Removes an organization.
     */
    public function removeOrganization()
    {
        $this->propertyExists('organizations');

        if ($this->organizations->contains($organization)) {
            $this->organizations->remove($organization);
        }
    }

    /**
     * Set the array directly.
     */
    public function setOrganizations($organizations)
    {
        $this->propertyExists('organizations');

        $this->organizations = $organizations instanceof ArrayCollection ?
            $organizations :
            new ArrayCollection($organizations);
    }

    /**
     * Get the organizations.
     */
    public function getOrganizations()
    {
        $this->propertyExists('organizations');

        return $this->organizations;
    }
}
