<?php

namespace Claroline\CoreBundle\API\Serializer\User;

use Claroline\CoreBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\Entity\Group;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Manager\FacetManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * @DI\Service("claroline.serializer.user")
 * @DI\Tag("claroline.serializer")
 */
class UserSerializer
{
    use SerializerTrait;

    /** @var TokenStorageInterface */
    private $tokenStorage;

    /** @var AuthorizationCheckerInterface */
    private $authChecker;

    /** @var FacetManager */
    private $facetManager;

    /**
     * UserManager constructor.
     *
     * @DI\InjectParams({
     *     "tokenStorage" = @DI\Inject("security.token_storage"),
     *     "authChecker"  = @DI\Inject("security.authorization_checker"),
     *     "facetManager" = @DI\Inject("claroline.manager.facet_manager")
     * })
     *
     * @param TokenStorageInterface         $tokenStorage
     * @param AuthorizationCheckerInterface $authChecker
     * @param FacetManager                  $facetManager
     */
    public function __construct(
        TokenStorageInterface $tokenStorage,
        AuthorizationCheckerInterface $authChecker,
        FacetManager $facetManager
    ) {
        $this->tokenStorage = $tokenStorage;
        $this->authChecker = $authChecker;
        $this->facetManager = $facetManager;
    }

    /**
     * @return string
     */
    public function getClass()
    {
        return 'Claroline\CoreBundle\Entity\User';
    }

    /**
     * @return string
     */
    public function getSchema()
    {
        return '#/main/core/user.json';
    }

    /**
     * @return string
     */
    public function getSamples()
    {
        return '#/main/core/user';
    }

    /**
     * Serializes a User entity for the JSON api.
     *
     * @param User  $user    - the user to serialize
     * @param array $options
     *
     * @return array - the serialized representation of the user
     */
    public function serialize(User $user, array $options = [])
    {
        if (isset($options['public']) && $options['public']) {
            return $this->serializePublic($user);
        }

        return [
            'id' => $user->getUuid(),
            'name' => $user->getFirstName().' '.$user->getLastName(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'username' => $user->getUsername(),
            'picture' => $user->getPicture(),
            'email' => $user->getMail(),
            'administrativeCode' => $user->getAdministrativeCode(),
            'meta' => $this->serializeMeta($user),
            'restrictions' => $this->serializeRestrictions($user),
            'rights' => $this->serializeRights($user),
            'roles' => array_map(function (Role $role) {
                return [
                    'id' => $role->getUuid(),
                    'type' => $role->getType(),
                    'name' => $role->getName(),
                    'translationKey' => $role->getTranslationKey(),
                ];
            }, $user->getEntityRoles()),
            'groups' => array_map(function (Group $group) {
                return [
                    'id' => $group->getUuid(),
                    'name' => $group->getName(),
                ];
            }, $user->getGroups()->toArray()),
        ];
    }

    /**
     * @param User $user
     *
     * @return array
     */
    private function serializeMeta(User $user)
    {
        return [
            'publicUrl' => $user->getPublicUrl(),
            'acceptedTerms' => $user->hasAcceptedTerms(),
            'lastLogin' => $user->getLastLogin() ? $user->getLastLogin()->format('Y-m-d\TH:i:s') : null,
            'created' => $user->getCreated() ? $user->getCreated()->format('Y-m-d\TH:i:s') : null,
            'description' => $user->getDescription(),
            'mailValidated' => $user->isMailNotified(),
            'mailNotified' => $user->isMailNotified(),
            'mailWarningHidden' => $user->getHideMailWarning(),
            'publicUrlTuned' => $user->hasTunedPublicUrl(),
            'authentication' => $user->getAuthentication(),
            'personalWorkspace' => (bool) $user->getPersonalWorkspace(),
            'enabled' => $user->isEnabled(),
            'removed' => $user->isRemoved(),
        ];
    }

    /**
     * @param User $user
     *
     * @return array
     */
    private function serializeRights(User $user)
    {
        $currentUser = $this->tokenStorage->getToken()->getUser();

        $isOwner = $currentUser instanceof User && $currentUser->getUuid() === $user->getUuid();
        $isAdmin = $this->authChecker->isGranted('ROLE_ADMIN'); // todo maybe add those who have access to UserManagement tool

        // return same structure than ResourceNode
        return [
            'current' => [
                'edit' => $isOwner || $isAdmin,
                'administrate' => $isAdmin,
                'delete' => $isOwner || $isAdmin, // todo check platform param to now if current user can destroy is account
            ],
        ];
    }

    /**
     * @param User $user
     *
     * @return array
     */
    private function serializeRestrictions(User $user)
    {
        return [
            'accessibleFrom' => !empty($user->getInitDate()) ? $user->getInitDate()->format('Y-m-d\TH:i:s') : null,
            'accessibleUntil' => !empty($user->getExpirationDate()) ? $user->getExpirationDate()->format('Y-m-d\TH:i:s') : null,
        ];
    }

    /**
     * @param User $user
     *
     * @return array
     */
    private function serializePublic(User $user)
    {
        $settingsProfile = $this->facetManager->getVisiblePublicPreference();
        $publicUser = [];

        foreach ($settingsProfile as $property => $isViewable) {
            if ($isViewable || $user === $this->tokenStorage->getToken()->getUser()) {
                switch ($property) {
                  case 'baseData':
                      $publicUser['lastName'] = $user->getLastName();
                      $publicUser['firstName'] = $user->getFirstName();
                      $publicUser['fullName'] = $user->getFirstName().' '.$user->getLastName();
                      $publicUser['username'] = $user->getUsername();
                      $publicUser['picture'] = $user->getPicture();
                      $publicUser['description'] = $user->getDescription();
                      break;
                  case 'email':
                      $publicUser['mail'] = $user->getMail();
                      break;
                  case 'phone':
                      $publicUser['phone'] = $user->getPhone();
                      break;
                  case 'sendMail':
                      $publicUser['mail'] = $user->getMail();
                      $publicUser['allowSendMail'] = true;
                      break;
                  case 'sendMessage':
                      $publicUser['allowSendMessage'] = true;
                      $publicUser['id'] = $user->getId();
                      break;
              }
            }
        }

        $publicUser['groups'] = [];
        //this should be protected by the visiblePublicPreference but it's not yet the case
        foreach ($user->getGroups() as $group) {
            $publicUser['groups'][] = ['name' => $group->getName(), 'id' => $group->getId()];
        }

        return $publicUser;
    }

    /**
     * Deserialize method.
     * TODO This is only a partial implementation.
     *
     * @param array     $data
     * @param User|null $user
     * @param array     $options
     *
     * @return User
     */
    public function deserialize(array $data, User $user = null, array $options = [])
    {
        // remove this later (with the Trait)
        $object = $this->genericSerializer->deserialize($data, $user, $options);

        // todo rename mail into email later
        if (isset($data['email'])) {
            $object->setMail($data['email']);
        }

        if (isset($data['plainPassword'])) {
            $object->setPlainPassword($data['plainPassword']);
        }

        if (isset($data['enabled'])) {
            $object->setEnabled($data['enabled']);
        }

        return $object;
    }
}
