<?php

namespace Claroline\CoreBundle\Entity\Model;

use Claroline\CoreBundle\Entity\Group;
use Doctrine\Common\Collections\ArrayCollection;

trait GroupsTrait
{
    use HasPropertyTrait;

    /**
     * Add an group.
     */
    public function addGroup(Group $group)
    {
        $this->propertyExists('groups');

        if (!$this->groups->contains($group)) {
            $this->groups->add($group);
        }
    }

    /**
     * Removes an group.
     */
    public function removeGroup(Group $group)
    {
        $this->propertyExists('groups');

        if ($this->groups->contains($group)) {
            $this->groups->remove($group);
        }
    }

    /**
     * Set the array directly.
     */
    public function setGroups($groups)
    {
        $this->propertyExists('organizations');

        $this->groups = $groups instanceof ArrayCollection ?
            $groups :
            new ArrayCollection($groups);
    }

    /**
     * Get the groups.
     */
    public function getGroups()
    {
        $this->propertyExists('groups');

        return $this->groups;
    }
}
