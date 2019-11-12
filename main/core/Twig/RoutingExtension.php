<?php

/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * Author: Panagiotis TSAVDARIS
 *
 * Date: 11/18/15
 */

namespace Claroline\CoreBundle\Twig;

use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Symfony\Component\Routing\RouterInterface;

//Maybe it'll be usefull to have that in a real service and not a twig one
class RoutingExtension extends \Twig_Extension
{
    public function __construct(RouterInterface $router)
    {
        $this->router = $router;
    }

    public function getName()
    {
        return 'twig_claroline_path';
    }

    public function getFunctions()
    {
        return [
            'resourcePath' => new \Twig_SimpleFunction('resourcePath', [$this, 'resourcePath']),
            'workspacePath' => new \Twig_SimpleFunction('workspacePath', [$this, 'workspacePath']),
        ];
    }

    public function resourcePath(ResourceNode $resource)
    {
        return $this->router->generate('claro_index')
          .'#/desktop/open/'
          .$resource->getWorkspace()->getSlug()
          .'/resources/'
          .$resource->getSlug();
    }

    public function workspacePath(Workspace $workspace)
    {
    }
}
