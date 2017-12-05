<?php

namespace Claroline\CoreBundle\Controller\APINew;

use Symfony\Component\DependencyInjection\ContainerAware;
use Symfony\Component\DependencyInjection\ContainerInterface;

abstract class AbstractApiController extends ContainerAware
{
    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }
}
