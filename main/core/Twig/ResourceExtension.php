<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Twig;

use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Manager\Resource\ResourceRestrictionsManager;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service
 * @DI\Tag("twig.extension")
 *
 * @todo : remove me when new resource restrictions page will be implemented
 */
class ResourceExtension extends \Twig_Extension
{
    /** @var ResourceRestrictionsManager */
    private $restrictionsManager;

    /**
     * ResourceExtension constructor.
     *
     * @DI\InjectParams({
     *     "restrictionsManager" = @DI\Inject("claroline.manager.resource_restrictions")
     * })
     *
     * @param ResourceRestrictionsManager $restrictionsManager
     */
    public function __construct(ResourceRestrictionsManager $restrictionsManager)
    {
        $this->restrictionsManager = $restrictionsManager;
    }

    public function getName()
    {
        return 'resource_extension';
    }

    public function getFunctions()
    {
        return [
            'isCodeProtected' => new \Twig_SimpleFunction('isCodeProtected', [$this, 'isCodeProtected']),
            'requiresUnlock' => new \Twig_SimpleFunction('requiresUnlock', [$this, 'requiresUnlock']),
        ];
    }

    public function isCodeProtected(ResourceNode $resourceNode)
    {
        return $this->restrictionsManager->isCodeProtected($resourceNode);
    }

    public function requiresUnlock(ResourceNode $resourceNode)
    {
        return $this->restrictionsManager->requiresUnlock($resourceNode);
    }
}
