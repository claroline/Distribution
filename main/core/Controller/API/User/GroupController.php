<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\API\User;

use Claroline\CoreBundle\API\FinderProvider;
use Claroline\CoreBundle\Entity\Group;
use Claroline\CoreBundle\Library\Security\Collection\GroupCollection;
use Claroline\CoreBundle\Manager\GroupManager;
use Claroline\CoreBundle\Persistence\ObjectManager;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations\NamePrefix;
use FOS\RestBundle\Controller\Annotations\Post;
use FOS\RestBundle\Controller\Annotations\View;
use FOS\RestBundle\Controller\FOSRestController;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Form\FormFactory;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * @NamePrefix("api_")
 * @TODO REMOVE ME
 */
class GroupController extends FOSRestController
{
    /**
     * @DI\InjectParams({
     *     "groupManager" = @DI\Inject("claroline.manager.group_manager")
     * })
     */
    public function __construct(GroupManager  $groupManager)
    {
        $this->groupManager = $groupManager;
    }

    /**
     * @Post("/groups/{group}/import/members", name="group_members_import", options={ "method_prefix" = false })
     * @View(serializerGroups={"api_user"})
     *
     * @TODO REMOVE ME
     * REPLACED BY TRANSFER ACTION OF THE API
     *
     * @param Group $group
     *
     * @return Response
     */
    public function importMembersAction(Group $group)
    {
        $this->throwsExceptionIfNotAdmin();

        return $this->groupManager->importMembers(file_get_contents($this->request->files->get('csv')), $group);
    }

    private function isAdmin()
    {
        return $this->container->get('security.authorization_checker')->isGranted('ROLE_ADMIN');
    }

    private function throwsExceptionIfNotAdmin()
    {
        if (!$this->isAdmin()) {
            throw new AccessDeniedException('This action can only be done by the administrator');
        }
    }
}
