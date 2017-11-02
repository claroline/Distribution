<?php

namespace Claroline\CoreBundle\API\Serializer\User;

use Claroline\CoreBundle\API\Serializer\AbstractSerializer;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Manager\FacetManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * @DI\Service("claroline.serializer.user")
 * @DI\Tag("claroline.serializer")
 */
class UserSerializer extends AbstractSerializer
{
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
     * Serializes a Workspace entity for the JSON api.
     *
     * @param User  $user    - the user to serialize
     * @param array $options
     *
     * @return array - the serialized representation of the user
     */
    public function serialize($user, array $options = [])
    {
        if (isset($options['public']) && $options['public']) {
            return $this->serializePublic($user);
        }

        return [
            'id' => $user->getId(),
            'uuid' => $user->getUuid(),
            'name' => $user->getFirstName().' '.$user->getLastName(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'username' => $user->getUsername(),
            'picture' => $user->getPicture(),
            'mail' => $user->getMail(),
            'administrativeCode' => $user->getAdministrativeCode(),
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
     * Default deserialize method.
     */
    public function deserialize($class, $data, array $options = [])
    {
        $object = parent::deserialize($class, $data, $options);
        $object->setPlainPassword($data->plainPassword);

        return $object;
    }

    public function getClass()
    {
        return 'Claroline\CoreBundle\Entity\User';
    }
}
