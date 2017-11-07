<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\APINew\User;

use Claroline\CoreBundle\Annotations\ApiMeta;
use Claroline\CoreBundle\Controller\APINew\AbstractController;
use Claroline\CoreBundle\Controller\APINew\Model\HasGroupsTrait;
use Claroline\CoreBundle\Controller\APINew\Model\HasOrganizationsTrait;
use Claroline\CoreBundle\Controller\APINew\Model\HasRolesTrait;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Claroline\CoreBundle\Entity\User;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * @ApiMeta(class="Claroline\CoreBundle\Entity\User")
 * @Route("user")
 */
class UserController extends AbstractController
{
    use HasRolesTrait;
    use HasOrganizationsTrait;
    use HasGroupsTrait;

    /**
     * @Route("/{uuid}/pws/create", name="apiv2_user_pws_create")
     * @Method("POST")
     * @ParamConverter("location", class = "Claroline\CoreBundle\Entity\User", options = {"uuid" = "user"})
     */
    public function createPersonalWorkspaceAction(User $user)
    {
        if (!$user->getPersonalWorkspace()) {
            $this->container->get('claroline.manager.user_manager')
              ->setPersonalWorkspace($user);
        } else {
            throw new \Exception('Workspace already exists');
        }

        return new JsonResponse($this->serializer->get('Claroline\CoreBundle\Entity\User')->serialize($user));
    }

    /**
     * @Route("/{uuid}/pws/delete", name="apiv2_user_pws_delete")
     * @Method("DELETE")
     * @ParamConverter("location", class = "Claroline\CoreBundle\Entity\User", options = {"uuid" = "user"})
     */
    public function deletePersonalWorkspaceAction(User $user)
    {
        $personalWorkspace = $user->getPersonalWorkspace();
        $this->eventDispatcher->dispatch('log', 'Log\LogWorkspaceDelete', [$personalWorkspace]);
        $this->workspaceManager->deleteWorkspace($personalWorkspace);

        return new JsonResponse($this->serializer->get('Claroline\CoreBundle\Entity\User')->serialize($user));
    }
}
