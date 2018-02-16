<?php

namespace Claroline\CoreBundle\API\Crud\User;

use Claroline\CoreBundle\API\Crud;
use Claroline\CoreBundle\Entity\Organization\Organization;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Event\Crud\CreateEvent;
use Claroline\CoreBundle\Event\Crud\DeleteEvent;
use Claroline\CoreBundle\Event\Crud\PatchEvent;
use Claroline\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * @DI\Service("claroline.crud.organization")
 * @DI\Tag("claroline.crud")
 */
class OrganizationCrud
{
    /**
     * @DI\InjectParams({
     *     "tokenStorage" = @DI\Inject("security.token_storage"),
     *     "om"           = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param TokenStorageInterface $tokenStorage
     */
    public function __construct(TokenStorageInterface $tokenStorage, ObjectManager $om)
    {
        $this->tokenStorage = $tokenStorage;
        $this->om = $om;
    }

    /**
     * @DI\Observe("crud_pre_create_object_claroline_corebundle_entity_organization_organization")
     *
     * @param CreateEvent $event
     */
    public function preCreate(CreateEvent $event)
    {
        $organization = $event->getObject();
        $user = $this->tokenStorage->getToken()->getUser();

        if ($user instanceof User) {
            $organization->addAdministrator($user);
        }
    }

    /**
     * @DI\Observe("crud_pre_delete_object_claroline_corebundle_entity_organization_organization")
     *
     * @param DeleteEvent $event
     */
    public function preDelete(DeleteEvent $event)
    {
        /** @var Organization $organization */
        $organization = $event->getObject();
        if ($organization->isDefault()) {
            $event->block();

            // we can also throw an exception
        }
    }

    /**
     * @DI\Observe("crud_post_patch_object_claroline_corebundle_entity_organization_organization")
     *
     * @param PatchEvent $event
     */
    public function postPatch(PatchEvent $event)
    {
        $action = $event->getAction();
        $user = $event->getValue();
        $property = $event->getProperty();
        $organization = $event->getObject();

        if ('administrator' === $property) {
            $roleAdminOrga = $this->om->getRepository('ClarolineCoreBundle:Role')->findOneByName('ROLE_ADMIN_ORGANIZATION');
            if (Crud::COLLECTION_ADD === $action) {
                $user->addRole($roleAdminOrga);
            } elseif (Crud::COLLECTION_REMOVE === $action) {
                if (0 === count($user->getAdministratedOrganizations())) {
                    $user->removeRole($roleAdminOrga);
                }
            }
        }
    }
}
