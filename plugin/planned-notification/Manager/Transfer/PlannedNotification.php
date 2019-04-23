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

use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\API\Utils\FileBag;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Manager\Workspace\Transfer\Tools\ToolImporterInterface;
use Claroline\PlannedNotificationBundle\Entity\Message;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * @DI\Service("claroline.transfer.claroline_planned_notification_tool")
 */
class PlannedNotification implements ToolImporterInterface
{
    /**
     * @DI\InjectParams({
     *     "authorization" = @DI\Inject("security.authorization_checker"),
     *     "tokenStorage"  = @DI\Inject("security.token_storage"),
     *     "om"            = @DI\Inject("claroline.persistence.object_manager"),
     *     "finder"        = @DI\Inject("claroline.api.finder")
     * })
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        TokenStorageInterface $tokenStorage,
        FinderProvider $finder,
        ObjectManager $om
    ) {
        $this->authorization = $authorization;
        $this->tokenStorage = $tokenStorage;
        $this->om = $om;
        $this->finder = $finder;
    }

    public function serialize(Workspace $workspace, array $options): array
    {
        return [
            'planned' => $this->finder->search(self::class, ['workspace' => $workspace->getUuid()]),
            'messages' => $this->finder->search(Message::class, ['workspace' => $workspace->getUuid()]),
        ];
    }

    public function deserialize(array $data, Workspace $workspace, array $options, FileBag $bag)
    {
        foreach ($data['planned'] as $planned) {
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

        foreach ($data['messages'] as $message) {
            $new = $this->crud->copy($old, [Options::GENERATE_UUID]);
            $new->setWorkspace($workspace);
            $new->emptyNotifications();

            foreach ($old->getNotifications() as $oldNotification) {
                if (isset($newNotifs[$oldNotification->getId()])) {
                    $new->addNotification($newNotifs[$oldNotification->getId()]);
                }
            }

            $this->om->persist($new);
        }
    }

    public function prepareImport(array $orderedToolData, array $data): array
    {
        return $data;
    }
}
