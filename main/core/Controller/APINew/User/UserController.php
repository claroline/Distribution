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
use Claroline\CoreBundle\Controller\APINew\AbstractCrudController;
use Claroline\CoreBundle\Controller\APINew\Model\HasGroupsTrait;
use Claroline\CoreBundle\Controller\APINew\Model\HasOrganizationsTrait;
use Claroline\CoreBundle\Controller\APINew\Model\HasRolesTrait;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\API\Options;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * @ApiMeta(class="Claroline\CoreBundle\Entity\User")
 * @Route("user")
 */
class UserController extends AbstractCrudController
{
    public function getName()
    {
        return 'user';
    }

    use HasRolesTrait;
    use HasOrganizationsTrait;
    use HasGroupsTrait;

    /**
     * @Route("/{id}/pws/create", name="apiv2_user_pws_create")
     * @Method("POST")
     * @ParamConverter("user", options={"mapping": {"id": "uuid"}})
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
     * @Route("/{id}/pws/delete", name="apiv2_user_pws_delete")
     * @Method("DELETE")
     * @ParamConverter("user", options={"mapping": {"id": "uuid"}})
     */
    public function deletePersonalWorkspaceAction(User $user)
    {
        $personalWorkspace = $user->getPersonalWorkspace();
        $this->eventDispatcher->dispatch('log', 'Log\LogWorkspaceDelete', [$personalWorkspace]);
        $this->workspaceManager->deleteWorkspace($personalWorkspace);

        return new JsonResponse($this->serializer->get('Claroline\CoreBundle\Entity\User')->serialize($user));
    }

    public function getOptions()
    {
        return [
            'deleteBulk' => [Options::SOFT_DELETE],
            'create' => [
                //maybe move these options in an other class
                Options::SEND_EMAIL,
                Options::ADD_NOTIFICATIONS
            ]
        ];
    }
}
