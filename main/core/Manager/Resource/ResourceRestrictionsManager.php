<?php

namespace Claroline\CoreBundle\Manager\Resource;

use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Validator\Exception\InvalidDataException;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * ResourceRestrictionsManager.
 *
 * It validates access restrictions on ResourceNodes.
 *
 * @DI\Service("claroline.manager.resource_restrictions")
 */
class ResourceRestrictionsManager
{
    /** @var SessionInterface */
    private $session;

    /** @var RightsManager */
    private $rightsManager;

    /**
     * ResourceRestrictionsManager constructor.
     *
     * @DI\InjectParams({
     *     "session"       = @DI\Inject("session"),
     *     "rightsManager" = @DI\Inject("claroline.manager.rights_manager")
     * })
     *
     * @param SessionInterface $session
     * @param RightsManager    $rightsManager
     */
    public function __construct(
        SessionInterface $session,
        RightsManager $rightsManager)
    {
        $this->session = $session;
        $this->rightsManager = $rightsManager;
    }

    /**
     * Checks if the current user can bypass the restrictions.
     *
     * @param ResourceNode $resourceNode
     *
     * @return bool
     */
    public function canBypass(ResourceNode $resourceNode): bool
    {
        return $this->rightsManager->isManager($resourceNode);
    }

    /**
     * Checks access restrictions of a ResourceNodes.
     *
     * @param ResourceNode $resourceNode
     * @param Role[]       $userRoles
     *
     * @return array
     */
    public function check(ResourceNode $resourceNode, array $userRoles): array
    {
        return [
            'rights' => $this->hasRights($resourceNode, $userRoles),
            'active' => $resourceNode->isActive(),
            'published' => $resourceNode->isPublished(),
            'started' => $this->isStarted($resourceNode),
            'ended' => $this->isEnded($resourceNode),
            'unlocked' => $this->isUnlocked($resourceNode),
            'location' => $this->isIpAuthorized($resourceNode),
        ];
    }

    /**
     * Checks if a user has at least the right to access to one of the resource action.
     *
     * @param ResourceNode $resourceNode
     * @param Role[]       $userRoles
     *
     * @return bool
     */
    public function hasRights(ResourceNode $resourceNode, array $userRoles)
    {
        return 0 !== $this->rightsManager->getMaximumRights($userRoles, $resourceNode);
    }

    /**
     * Checks if the access period of the resource is started.
     *
     * @param ResourceNode $resourceNode
     *
     * @return bool
     */
    public function isStarted(ResourceNode $resourceNode): bool
    {
        return empty($resourceNode->getAccessibleFrom()) || $resourceNode->getAccessibleFrom() <= new \DateTime();
    }

    /**
     * Checks if the access period of the resource is over.
     *
     * @param ResourceNode $resourceNode
     *
     * @return bool
     */
    public function isEnded(ResourceNode $resourceNode): bool
    {
        return empty($resourceNode->getAccessibleUntil()) || $resourceNode->getAccessibleUntil() > new \DateTime();
    }

    /**
     * Checks if the ip of the current user is allowed to access the resource.
     *
     * @param ResourceNode $resourceNode
     *
     * @return bool
     */
    public function isIpAuthorized(ResourceNode $resourceNode): bool
    {
        $allowed = $resourceNode->getAllowedIps();
        if (!empty($allowed)) {
            $currentParts = explode('.', $_SERVER['REMOTE_ADDR']);

            foreach ($allowed as $allowedIp) {
                $allowedParts = explode('.', $allowedIp);
                $allowBlock = [];

                foreach ($allowedParts as $key => $val) {
                    $allowBlock[] = ($val === $currentParts[$key] || '*' === $val);
                }

                if (!in_array(false, $allowBlock)) {
                    return true;
                }
            }

            // the current user ip is not in the allowed list
            return false;
        }

        // the current resource does not restrict ips
        return true;
    }

    /**
     * Checks if a resource is unlocked.
     * (aka it has no access code, or user has already submitted it)
     *
     * @param ResourceNode $node
     *
     * @return bool
     */
    public function isUnlocked(ResourceNode $node): bool
    {
        if ($node->getAccessCode()) {
            // check if the current user already has unlocked the resource
            // maybe store it another way to avoid require it each time the user session expires
            return !empty($this->session->get($node->getUuid()));
        }

        // the current resource does not require a code
        return true;
    }

    /**
     * Submits a code to unlock a resource.
     * NB. The resource will stay unlocked as long as the user session stay alive.
     *
     * @param ResourceNode $resourceNode - The resource to unlock
     * @param string       $code         - The code sent by the user
     *
     * @throws InvalidDataException - If the submitted code is incorrect
     */
    public function unlock(ResourceNode $resourceNode, $code = null)
    {
        //if a code is defined
        if ($accessCode = $resourceNode->getAccessCode()) {
            if (empty($code) || $accessCode !== $code) {
                $this->session->set($resourceNode->getUuid(), false);

                throw new InvalidDataException('Invalid code sent');
            }

            $this->session->set($resourceNode->getUuid(), true);
        }
    }
}
