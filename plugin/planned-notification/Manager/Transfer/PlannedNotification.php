<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\PlannedNotificationBundle\Manager\Transfer;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\API\Utils\FileBag;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Manager\Workspace\Transfer\Tools\ToolImporterInterface;
use Claroline\PlannedNotificationBundle\Entity\Message;
use Claroline\PlannedNotificationBundle\Entity\PlannedNotification;
use Claroline\PlannedNotificationBundle\Manager\PlannedNotificationManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Bundle\TwigBundle\TwigEngine;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * @DI\Service("claroline.transfer.resource_manager")
 */
class PlannedNotification implements ToolImporterInterface
{
    /**
     * @DI\InjectParams({
     *     "authorization" = @DI\Inject("security.authorization_checker"),
     *     "manager"       = @DI\Inject("claroline.manager.planned_notification_manager"),
     *     "tokenStorage"  = @DI\Inject("security.token_storage"),
     *     "om"            = @DI\Inject("claroline.persistence.object_manager"),
     *     "crud"          = @DI\Inject("claroline.api.crud"),
     *     "finder"        = @DI\Inject("claroline.api.finder")
     * })
     *
     * @param AuthorizationCheckerInterface $authorization
     * @param PlannedNotificationManager    $manager
     * @param TwigEngine                    $templating
     * @param TokenStorageInterface         $tokenStorage
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        PlannedNotificationManager $manager,
        TokenStorageInterface $tokenStorage,
        Crud $crud,
        FinderProvider $finder,
        ObjectManager $om
    ) {
        $this->authorization = $authorization;
        $this->manager = $manager;
        $this->tokenStorage = $tokenStorage;
        $this->om = $om;
        $this->crud = $crud;
        $this->finder = $finder;
    }

    public function serialize(Workspace $workspace, array $options)
    {
        return [
            'planned' => $this->search->fetch(PlannedNotification::class, ['workspace' => $oldWs->getUuid()]),
            'messages' => $this->search->fetch(Message::class, ['workspace' => $oldWs->getUuid()]),
        ];
    }

    public function deserialize(array $data, Workspace $workspace, array $options, FileBag $bag)
    {/*
        foreach ($planned as $old) {
            $new = $this->crud->copy($old, [Options::GENERATE_UUID]);
            $new->setWorkspace($workspace);
            $new->emptyRoles();

            foreach ($old->getRoles() as $role) {
                foreach ($workspace->getRoles() as $wsRole) {
                    if ($wsRole->getTranslationKey() === $role->getTranslationKey()) {
                        $new->addRole($wsRole);
                    }
                }
            }
            $newNotifs[$old->getId()] = $new;
            $this->om->persist($new);
        }

        foreach ($oldMessages as $old) {
            $new = $this->crud->copy($old, [Options::GENERATE_UUID]);
            $new->setWorkspace($workspace);
            $new->emptyNotifications();

            foreach ($old->getNotifications() as $oldNotification) {
                if (isset($newNotifs[$oldNotification->getId()])) {
                    $new->addNotification($newNotifs[$oldNotification->getId()]);
                }
            }

            $this->om->persist($new);
        }*/
    }

    public function prepareImport(array $orderedToolData, array $data)
    {
        //maybe do something about ids.
    }
}
