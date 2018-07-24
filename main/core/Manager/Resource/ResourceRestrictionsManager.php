<?php

namespace Claroline\CoreBundle\Manager\Resource;

use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * @DI\Service("claroline.manager.resource_restrictions")
 */
class ResourceRestrictionsManager
{
    /** @var SessionInterface */
    private $session;

    /**
     * ResourceRestrictionsManager constructor.
     *
     * @param SessionInterface $session
     */
    public function __construct(
        SessionInterface $session)
    {
        $this->session = $session;
    }

    public function unlock(ResourceNode $resourceNode, $code)
    {
        //if a code is defined
        if ($accessCode = $resourceNode->getAccessCode()) {
            if ($accessCode === $code) {
                $this->session->set($resourceNode->getUuid(), true);

                return true;
            } else {
                $this->session->set($resourceNode->getUuid(), false);

                return false;
            }
        }

        return true;
    }

    public function isCodeProtected(ResourceNode $resourceNode)
    {
        return !empty($resourceNode->getAccessCode());
    }

    public function requiresUnlock(ResourceNode $resourceNode)
    {
        $isProtected = $this->isCodeProtected($resourceNode);
        if ($isProtected) {
            return !$this->isUnlocked($resourceNode);
        }

        return false;
    }

    public function isUnlocked(ResourceNode $node)
    {
        if ($node->getAccessCode()) {
            $access = $this->session->get($node->getUuid());
        }

        return !empty($access);
    }
}
