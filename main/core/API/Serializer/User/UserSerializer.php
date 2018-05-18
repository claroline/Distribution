<?php

namespace Claroline\CoreBundle\API\Serializer\User;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Event\StrictDispatcher;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\File\PublicFileSerializer;
use Claroline\CoreBundle\Entity\Facet\FieldFacet;
use Claroline\CoreBundle\Entity\Facet\FieldFacetValue;
use Claroline\CoreBundle\Entity\File\PublicFile;
use Claroline\CoreBundle\Entity\Group;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Event\User\DecorateUserEvent;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CoreBundle\Library\Normalizer\DateRangeNormalizer;
use Claroline\CoreBundle\Manager\FacetManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Encoder\EncoderFactoryInterface;

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

    /** @var EncoderFactoryInterface */
    private $encoderFactory;

    /** @var ObjectManager */
    private $om;

    /** @var PlatformConfigurationHandler */
    private $config;

    /** @var FacetManager */
    private $facetManager;

    /** @var PublicFileSerializer */
    private $fileSerializer;

    /** @var ContainerInterface */
    private $container;

    /** @var StrictDispatcher */
    private $eventDispatcher;

    /**
     * UserManager constructor.
     *
     * @DI\InjectParams({
     *     "tokenStorage"    = @DI\Inject("security.token_storage"),
     *     "authChecker"     = @DI\Inject("security.authorization_checker"),
     *     "encoderFactory"  = @DI\Inject("security.encoder_factory"),
     *     "om"              = @DI\Inject("claroline.persistence.object_manager"),
     *     "config"          = @DI\Inject("claroline.config.platform_config_handler"),
     *     "facetManager"    = @DI\Inject("claroline.manager.facet_manager"),
     *     "fileSerializer"  = @DI\Inject("claroline.serializer.public_file"),
     *     "container"       = @DI\Inject("service_container"),
     *     "eventDispatcher" = @DI\Inject("claroline.event.event_dispatcher")
     * })
     *
     * @param TokenStorageInterface         $tokenStorage
     * @param AuthorizationCheckerInterface $authChecker
     * @param EncoderFactoryInterface       $encoderFactory
     * @param ObjectManager                 $om
     * @param PlatformConfigurationHandler  $config
     * @param FacetManager                  $facetManager
     * @param PublicFileSerializer          $fileSerializer
     * @param ContainerInterface            $container
     * @param StrictDispatcher              $eventDispatcher
     */
    public function __construct(
        TokenStorageInterface $tokenStorage,
        AuthorizationCheckerInterface $authChecker,
        EncoderFactoryInterface $encoderFactory,
        ObjectManager $om,
        PlatformConfigurationHandler $config,
        FacetManager $facetManager,
        PublicFileSerializer $fileSerializer,
        ContainerInterface $container,
        StrictDispatcher $eventDispatcher
    ) {
        $this->tokenStorage = $tokenStorage;
        $this->authChecker = $authChecker;
        $this->encoderFactory = $encoderFactory;
        $this->om = $om;
        $this->config = $config;
        $this->facetManager = $facetManager;
        $this->fileSerializer = $fileSerializer;
        $this->container = $container;
        $this->eventDispatcher = $eventDispatcher;
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

        $serializedUser = [
            'autoId' => $user->getId(), //for old compatibility purposes
            'id' => $user->getUuid(),
            'name' => $user->getFirstName().' '.$user->getLastName(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'username' => $user->getUsername(),
            'picture' => $this->serializePicture($user),
            'email' => $user->getEmail(),
            'administrativeCode' => $user->getAdministrativeCode(),
            'phone' => $user->getPhone(),
        ];

        if (!in_array(Options::SERIALIZE_MINIMAL, $options)) {
            $userRoles = array_map(function (Role $role) {
                return [
                    'id' => $role->getUuid(),
                    'type' => $role->getType(),
                    'name' => $role->getName(),
                    'translationKey' => $role->getTranslationKey(),
                    'workspace' => $role->getWorkspace() ? ['id' => $role->getWorkspace()->getUuid()] : null,
                    'context' => 'user',
                ];
            }, $user->getEntityRoles(false));
            $groupRoles = array_map(function (Role $role) {
                return [
                    'id' => $role->getUuid(),
                    'type' => $role->getType(),
                    'name' => $role->getName(),
                    'translationKey' => $role->getTranslationKey(),
                    'workspace' => $role->getWorkspace() ? ['id' => $role->getWorkspace()->getUuid()] : null,
                    'context' => 'group',
                ];
            }, $user->getGroupRoles());

            $serializedUser = array_merge($serializedUser, [
                'meta' => $this->serializeMeta($user),
                'restrictions' => $this->serializeRestrictions($user),
                'rights' => $this->serializeRights($user),
                'roles' => array_merge($userRoles, $groupRoles),
                'groups' => array_map(function (Group $group) {
                    return [
                        'id' => $group->getUuid(),
                        'name' => $group->getName(),
                    ];
                }, $user->getGroups()->toArray()),
            ]);

            $serializer = $this->container->get('claroline.api.serializer');

            if ($user->getMainOrganization()) {
                $serializedUser['mainOrganization'] = $serializer->serialize($user->getMainOrganization());
            }

            $serializedUser['administratedOrganizations'] = array_map(function ($organization) use ($serializer) {
                return $serializer->serialize($organization);
            }, $user->getAdministratedOrganizations()->toArray());
        }

        if (in_array(Options::SERIALIZE_FACET, $options)) {
            $fields = $this->om
                ->getRepository('Claroline\CoreBundle\Entity\Facet\FieldFacetValue')
                ->findPlatformValuesByUser($user);

            /** @var FieldFacetValue $field */
            foreach ($fields as $field) {
                // we just flatten field facets in the base user structure
                $serializedUser[$field->getFieldFacet()->getUuid()] = $field->getValue();
            }
        }

        return $this->decorate($user, $serializedUser);
    }

    /**
     * Dispatches an event to let plugins add some custom data to the serialized user.
     * For example: CasBundle adds CAS Id to the serialized user.
     *
     * @param User  $user           - the original user entity
     * @param array $serializedUser - the serialized version of the user
     *
     * @return array - the decorated user
     */
    private function decorate(User $user, array $serializedUser)
    {
        $unauthorizedKeys = array_keys($serializedUser);

        /** @var DecorateUserEvent $event */
        $event = $this->eventDispatcher->dispatch(
            'serialize_user',
            'User\DecorateUser',
            [
                $user,
                $unauthorizedKeys,
            ]
        );

        return array_merge(
            $serializedUser,
            $event->getInjectedData()
        );
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
                        $publicUser['mail'] = $user->getEmail();
                        break;
                    case 'phone':
                        $publicUser['phone'] = $user->getPhone();
                        break;
                    case 'sendMail':
                        $publicUser['mail'] = $user->getEmail();
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
     * Serialize the user picture.
     *
     * @param User $user
     *
     * @return array|null
     */
    private function serializePicture(User $user)
    {
        if (!empty($user->getPicture())) {
            /** @var PublicFile $file */
            $file = $this->om
                ->getRepository('Claroline\CoreBundle\Entity\File\PublicFile')
                ->findOneBy(['url' => $user->getPicture()]);

            if ($file) {
                return $this->fileSerializer->serialize($file);
            }
        }

        return null;
    }

    /**
     * @param User $user
     *
     * @return array
     */
    private function serializeMeta(User $user)
    {
        $locale = $user->getLocale();
        if (empty($locale)) {
            $locale = $this->config->getParameter('locale_language');
        }

        return [
            'publicUrl' => $user->getPublicUrl(),
            'acceptedTerms' => $user->hasAcceptedTerms(),
            'lastLogin' => $user->getLastLogin() ? $user->getLastLogin()->format('Y-m-d\TH:i:s') : null,
            'created' => $user->getCreated() ? $user->getCreated()->format('Y-m-d\TH:i:s') : null,
            'description' => $user->getDescription(),
            'mailValidated' => $user->isMailValidated(),
            'mailNotified' => $user->isMailNotified(),
            'mailWarningHidden' => $user->getHideMailWarning(),
            'publicUrlTuned' => $user->hasTunedPublicUrl(),
            'authentication' => $user->getAuthentication(),
            'personalWorkspace' => (bool) $user->getPersonalWorkspace(),
            'removed' => $user->isRemoved(),
            'locale' => $locale,
            'loggedIn' => $user === $this->tokenStorage->getToken()->getUser(),
        ];
    }

    private function deserializeMeta(array $meta, User $user)
    {
        $this->sipe('description', 'setDescription', $meta, $user);
        if (empty($meta) || empty($meta['locale'])) {
            if (empty($user->getLocale())) {
                // set default
                $user->setLocale($this->config->getParameter('locale_language'));
            }
        } else {
            // use given locale
            $user->setLocale($meta['locale']);
        }
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
                'contact' => !$isOwner,
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
            'disabled' => !$user->isEnabled(),
            'dates' => DateRangeNormalizer::normalize($user->getInitDate(), $user->getExpirationDate()),
        ];
    }

    private function deserializeRestrictions(array $restrictions, User $user)
    {
        if (isset($restrictions['disabled'])) {
            $user->setIsEnabled(!$restrictions['disabled']);
        }

        if (isset($restrictions['dates'])) {
            $dateRange = DateRangeNormalizer::denormalize($restrictions['dates']);

            $user->setInitDate($dateRange[0]);
            $user->setExpirationDate($dateRange[1]);
        }
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
        $this->genericSerializer->deserialize($data, $user, $options);

        $this->sipe('picture.url', 'setPicture', $data, $user);
        $this->sipe('email', 'setEmail', $data, $user);

        if (isset($data['meta'])) {
            $this->deserializeMeta($data['meta'], $user);
        }

        if (isset($data['restrictions'])) {
            $this->deserializeRestrictions($data['restrictions'], $user);
        }

        if (isset($data['plainPassword'])) {
            $this->deserializePassword($data['plainPassword'], $user);
        }

        //avoid recursive dependencies
        $serializer = $this->container->get('claroline.api.serializer');

        if (isset($data['mainOrganization'])) {
            $user->setMainOrganization($serializer->deserialize(
                'Claroline\CoreBundle\Entity\Organization\Organization',
                $data['mainOrganization']
            ));
        }

        //only add role here. If we want to remove them, use the crud remove method instead
        //it's usefull if we want to create a user with a list of roles
        if (isset($data['roles'])) {
            foreach ($data['roles'] as $role) {
                $role = $this->container->get('claroline.api.serializer')
                    ->deserialize('Claroline\CoreBundle\Entity\Role', $role);
                if ($role && $role->getId()) {
                    $user->addRole($role);
                }
            }
        }

        //only add groups here. If we want to remove them, use the crud remove method instead
        //it's usefull if we want to create a user with a list of roles
        if (isset($data['groups'])) {
            foreach ($data['groups'] as $group) {
                $group = $this->container->get('claroline.api.serializer')
                    ->deserialize('Claroline\CoreBundle\Entity\Group', $group);
                if ($group && $group->getId()) {
                    $user->addGroup($group);
                }
            }
        }

        //only add organizations here. If we want to remove them, use the crud remove method instead
        //it's usefull if we want to create a user with a list of roles
        if (isset($data['organizations'])) {
            foreach ($data['organizations'] as $organization) {
                $organization = $this->container->get('claroline.api.serializer')
                    ->deserialize('Claroline\CoreBundle\Entity\Organization\Organization', $organization);
                if ($organization && $organization->getId()) {
                    $user->addOrganization($organization);
                }
            }
        }

        $fieldFacets = $this->om
            ->getRepository('Claroline\CoreBundle\Entity\Facet\FieldFacet')
            ->findPlatformFieldFacets();

        /** @var FieldFacet $fieldFacet */
        foreach ($fieldFacets as $fieldFacet) {
            if (isset($data[$fieldFacet->getUuid()])) {
                /** @var FieldFacetValue $fieldFacetValue */
                $fieldFacetValue = $this->om
                    ->getRepository('Claroline\CoreBundle\Entity\Facet\FieldFacetValue')
                    ->findOneBy([
                        'user' => $user,
                        'fieldFacet' => $fieldFacet,
                    ]);

                $user->addFieldFacet(
                    $serializer->deserialize('Claroline\CoreBundle\Entity\Facet\FieldFacetValue', [
                        'id' => !empty($fieldFacetValue) ? $fieldFacetValue->getUuid() : null,
                        'name' => $fieldFacet->getName(),
                        'value' => $data[$fieldFacet->getUuid()],
                        'fieldFacet' => ['id' => $fieldFacet->getUuid()],
                    ])
                );
            }
        }

        return $user;
    }

    private function deserializePassword($plainPassword, User $user)
    {
        $user->setPlainPassword($plainPassword);

        $password = $this->encoderFactory
            ->getEncoder($user)
            ->encodePassword($user->getPlainPassword(), $user->getSalt());

        $user->setPassword($password);
    }
}
