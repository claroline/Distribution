<?php

namespace Claroline\CoreBundle\Library;

use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Symfony\Component\Routing\RouterInterface;

//Maybe it'll be usefull to have that in a real service and not a twig one
class RoutingHelper
{
    public function __construct(RouterInterface $router)
    {
        $this->router = $router;
    }

    public function resourcePath(ResourceNode $resource)
    {
        return $this->router->generate('claro_index')
          .'#'.$this->resourceFragment($resource);
    }

    public function resourceFragment($resource)
    {
        if ($resource instanceof ResourceNode) {
            $slug = $resource->getSlug();
        } elseif (is_array($resource)) {
            if (isset($resource['slug'])) {
                $slug = $resource['slug'];
            } else {
                $slug = $resource['guid'];
            }
        } elseif (is_string($resource)) {
            $slug = $resource;
        }

        return '/desktop/open/'.$slug.'/resources/'.$slug;
    }

    public function workspacePath(Workspace $workspace)
    {
    }
}
