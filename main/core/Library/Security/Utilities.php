<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Library\Security;

use Doctrine\ORM\EntityManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

/**
 * @DI\Service("claroline.security.utilities")
 */
class Utilities
{
    /** @var EntityManager */
    private $em;
    /** @var array */
    private $expectedKeysForResource;
    /** @var array */
    private $expectedKeysForWorkspace;

    /**
     * Constructor.
     *
     * @DI\InjectParams({
     *     "em" = @DI\Inject("doctrine.orm.entity_manager")
     * })
     */
    public function __construct(EntityManager $em)
    {
        $this->em = $em;
        $this->expectedTypeOfRight = ['workspace', 'resource'];
        $this->expectedKeysForResource = [
            'open',
            'delete',
            'edit',
            'copy',
            'create',
            'export',
        ];
        $this->expectedKeysForWorkspace = ['canView', 'canDelete', 'canEdit'];
    }

    /**
     * Takes the array of checked ids from the rights form (ie rights_form.html.twig) and
     * transforms them into a easy to use permission array.
     
     * @param array  $checks
     * @param string $typeOfRight
     *
     * @return array
     */
    public function setRightsRequest(array $checks, $typeOfRight)
    {
        if (!in_array($typeOfRight, $this->expectedTypeOfRight)) {
            throw new \Exception(
                "Unknown right type '{$typeOfRight}' (possible values are 'workspace' and 'resource')"
            );
        }

        $configs = [];

        foreach (array_keys($checks) as $key) {
            $arr = explode('-', $key);
            $configs[$arr[1]][$arr[0]] = true;
        }

        foreach ($configs as $key => $config) {
            $configs[$key] = $this->addMissingRights($config, $typeOfRight);
        }

        return $configs;
    }

    /**
     * Returns the roles (an array of string) of the $token.
     *
     * @todo remove this $method
     *
     * @param \Symfony\Component\Security\Core\Authentication\Token\TokenInterface $token
     *
     * @return array
     */
    public function getRoles(TokenInterface $token)
    {
        $roles = [];

        foreach ($token->getRoles() as $role) {
            $roles[] = $role->getRole();
        }

        return $roles;
    }

    /**
     * Adds the missing permissions to an array of permissions, setting missing
     * ones to false.
     *
     * @param array  $permissions The array of permissions
     * @param string $target      The target of the right ('resource' or 'workspace')
     *
     * @return array
     */
    private function addMissingRights(array $permissions, $target)
    {
        $expectedKeys = $target === 'resource' ?
            $this->expectedKeysForResource :
            $this->expectedKeysForWorkspace;

        foreach ($expectedKeys as $expected) {
            if (!isset($permissions[$expected])) {
                $permissions[$expected] = false;
            }
        }

        return $permissions;
    }
}
