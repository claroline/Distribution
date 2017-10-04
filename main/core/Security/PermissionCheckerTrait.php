<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Security;

use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * Allows the target class to checks the current user permissions on a ResourceNode.
 */
trait PermissionCheckerTrait
{
    /**
     * @var AuthorizationCheckerInterface
     */
    private $authorization;

    /**
     * Injects Authorization service.
     *
     * @DI\InjectParams({
     *      "authorization" = @DI\Inject("security.authorization_checker")
     * })
     *
     * @param AuthorizationCheckerInterface $authorization
     */
    public function setAuthorization(AuthorizationCheckerInterface $authorization)
    {
        $this->authorization = $authorization;
    }

    private function checkPermission($permission, $object, $options = [], $throwException = false)
    {
        $collection = new ObjectCollection([$object]);

        if (!$this->authorization->isGranted($permission, $collection)) {
            if ($throwException) {
                throw new AccessDeniedException(
                'operation '.$permission.' couldn\'t be done on object '.get_class($object)
              );
            }
        }
    }
}
