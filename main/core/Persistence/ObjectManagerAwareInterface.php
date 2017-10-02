<?php

namespace Claroline\CoreBundle\Persistence;

interface ObjectManagerAwareInterface
{
    public function setObjectManager(ObjectManager $om);
}
