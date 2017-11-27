<?php

namespace Claroline\CoreBundle\API\Serializer\User;

use Claroline\CoreBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Manager\FacetManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * @DI\Service("claroline.serializer.user")
 * @DI\Tag("claroline.serializer")
 */
class UserSerializer
{
    use SerializerTrait;

    private $facetManager;
    private $tokenStorage;

    /**
     * UserManager constructor.
     *
     * @DI\InjectParams({
     *     "facetManager" = @DI\Inject("claroline.manager.facet_manager"),
     *     "tokenStorage" = @DI\Inject("security.token_storage")
     * })
     *
     * @param FacetManager          $facetManager
     * @param TokenStorageInterface $tokenStorage
     */
    public function __construct(
        FacetManager $facetManager,
        TokenStorageInterface $tokenStorage
    ) {
        $this->facetManager = $facetManager;
        $this->tokenStorage = $tokenStorage;
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
            'roles' => array_map(function (Role $role) {
                return ['id' => $role->getId(), 'uuid' => $role->getUuid(), 'name' => $role->getName()];
            }, $user->getEntityRoles()),
        ];
    }

    public function serializeMeta(User $user)
    {
        return [
            'publicUrl' => $user->getPublicUrl(),
            'acceptedTerms' => $user->hasAcceptedTerms(),
            'lastLogin' => $user->getLastLogin() ? $user->getLastLogin()->format('Y-m-d\TH:i:s') : null,
            'created' => $user->getCreated()->format('Y-m-d\TH:i:s'),
            'description' => $user->getDescription(),
            'mailValidated' => $user->isMailNotified(),
            'mailNotified' => $user->isMailNotified(),
            'mailWarningHidden' => $user->getHideMailWarning(),
            'publicUrlTuned' => $user->hasTunedPublicUrl(),
            'authentication' => $user->getAuthentication(),
            'personalWorkspace' => !!$user->getPersonalWorkspace(),
            'enabled' => $user->isEnabled(),
            'removed' => $user->isRemoved(),
        ];
    }

    public function serializeRestrictions(User $user)
    {
        return [
            'accessibleFrom' => !empty($user->getInitDate()) ? $user->getInitDate()->format('Y-m-d\TH:i:s') : null,
            'accessibleUntil' => !empty($user->getExpirationDate()) ? $user->getExpirationDate()->format('Y-m-d\TH:i:s') : null,
        ];
    }

    public function serializePublic(User $user)
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
     * This is only a partial implementation.
     */
    public function deserialize($data, User $user = null, array $options = [])
    {
        //remove this later (with the Trait)
        $object = $this->genericSerializer->deserialize($data, $user, $options);

        //@todo rename mail into email later
        if (isset($data['email'])) {
            $object->setMail($data['email']);
        }

        if (isset($data['plainPassword'])) {
            $object->setPlainPassword($data['plainPassword']);
        }

        if (isset($data['isEnabled'])) {
            $object->setIsEnabled($data['isEnabled']);
        }

        return $object;
    }

    public function getClass()
    {
        return 'Claroline\CoreBundle\Entity\User';
    }

    public function getSchema()
    {
        return '#/main/core/user.json';
    }
}
