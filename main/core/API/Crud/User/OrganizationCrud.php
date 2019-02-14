<?php

namespace Claroline\CoreBundle\API\Crud\User;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\Event\Crud\CreateEvent;
use Claroline\AppBundle\Event\Crud\DeleteEvent;
use Claroline\AppBundle\Event\Crud\PatchEvent;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Cryptography\CryptographicKey;
use Claroline\CoreBundle\Entity\Organization\Organization;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Manager\CryptographyManager;
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
     *     "tokenStorage"  = @DI\Inject("security.token_storage"),
     *     "om"            = @DI\Inject("claroline.persistence.object_manager"),
     *     "cryptoManager" = @DI\Inject("claroline.manager.cryptography_manager"),
     *     "crud"          = @DI\Inject("claroline.api.crud")
     * })
     *
     * @param TokenStorageInterface $tokenStorage
     */
    public function __construct(TokenStorageInterface $tokenStorage, ObjectManager $om, CryptographyManager $cryptoManager, Crud $crud)
    {
        $this->tokenStorage = $tokenStorage;
        $this->om = $om;
        $this->crud = $crud;
        $this->cryptoManager = $cryptoManager;
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
     * @DI\Observe("crud_post_create_object_claroline_corebundle_entity_organization_organization")
     *
     * @param CreateEvent $event
     */
    public function postCreate(CreateEvent $event)
    {
        $organization = $event->getObject();
        $key = $this->cryptoManager->generatePair();
        $key->setOrganization($organization);
        $this->om->persist($key);
        $this->om->flush();
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

        $keys = $this->om->getRepository(CryptographicKey::class)->findBy(['organization' => $organization]);

        foreach ($keys as $key) {
            $this->crud->delete($key);
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
        $users = $event->getValue();
        $property = $event->getProperty();

        if ('administrator' === $property) {
            $roleAdminOrga = $this->om->getRepository('ClarolineCoreBundle:Role')->findOneByName('ROLE_ADMIN_ORGANIZATION');
            if (Crud::COLLECTION_ADD === $action) {
                if (is_array($users)) {
                    foreach ($users as $user) {
                        $user->addRole($roleAdminOrga);
                        $this->om->persist($user);
                    }
                } else {
                    $users->addRole($roleAdminOrga);
                    $this->om->persist($users);
                }
            } elseif (Crud::COLLECTION_REMOVE === $action) {
                if (is_array($users)) {
                    foreach ($users as $user) {
                        if (0 === count($user->getAdministratedOrganizations())) {
                            $user->removeRole($roleAdminOrga);
                            $this->om->persist($user);
                        }
                    }
                } else {
                    if (0 === count($user->getAdministratedOrganizations())) {
                        $user->removeRole($roleAdminOrga);
                        $this->om->persist($users);
                    }
                }
            }
        }

        $this->om->flush();
    }
}
