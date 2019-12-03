<?php

namespace Claroline\CoreBundle\API\Serializer\Platform;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\AuthenticationBundle\Manager\OauthManager;
use Claroline\CoreBundle\API\Serializer\Resource\ResourceTypeSerializer;
use Claroline\CoreBundle\Entity\File\PublicFile;
use Claroline\CoreBundle\Entity\Resource\ResourceType;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Event\GenericDataEvent;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CoreBundle\Library\Icon\ResourceIconItemFilename;
use Claroline\CoreBundle\Manager\IconSetManager;
use Claroline\CoreBundle\Manager\PluginManager;
use Claroline\CoreBundle\Manager\VersionManager;
use Symfony\Component\Asset\Packages;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * Serializes platform parameters used for client rendering.
 */
class ClientSerializer
{
    /** @var string */
    private $env;

    /** @var Packages */
    private $assets;

    /** @var TokenStorageInterface */
    private $tokenStorage;

    /** @var RequestStack */
    private $requestStack;

    /** @var ObjectManager */
    private $om;

    /** @var RouterInterface */
    private $router;

    /** @var PlatformConfigurationHandler */
    private $config;

    /** @var VersionManager */
    private $versionManager;

    /** @var PluginManager */
    private $pluginManager;

    /** @var IconSetManager */
    private $iconManager;

    /** @var ResourceTypeSerializer */
    private $resourceTypeSerializer;

    /** @var OauthManager */
    private $oauthManager;

    /**
     * ClientSerializer constructor.
     *
     * @param string                       $env
     * @param Packages                     $assets
     * @param EventDispatcherInterface     $eventDispatcher
     * @param TokenStorageInterface        $tokenStorage
     * @param RequestStack                 $requestStack
     * @param ObjectManager                $om
     * @param RouterInterface              $router
     * @param PlatformConfigurationHandler $config
     * @param VersionManager               $versionManager
     * @param PluginManager                $pluginManager
     * @param IconSetManager               $iconManager
     * @param ResourceTypeSerializer       $resourceTypeSerializer
     * @param OauthManager                 $oauthManager
     */
    public function __construct(
        $env,
        Packages $assets,

        EventDispatcherInterface $eventDispatcher,
        TokenStorageInterface $tokenStorage,
        RequestStack $requestStack,
        ObjectManager $om,
        RouterInterface $router,
        PlatformConfigurationHandler $config,
        VersionManager $versionManager,
        PluginManager $pluginManager,
        IconSetManager $iconManager,
        ResourceTypeSerializer $resourceTypeSerializer,
        OauthManager $oauthManager
    ) {
        $this->env = $env;
        $this->assets = $assets;
        $this->tokenStorage = $tokenStorage;
        $this->requestStack = $requestStack;
        $this->om = $om;
        $this->router = $router;
        $this->config = $config;
        $this->versionManager = $versionManager;
        $this->pluginManager = $pluginManager;
        $this->iconManager = $iconManager;
        $this->resourceTypeSerializer = $resourceTypeSerializer;
        $this->eventDispatcher = $eventDispatcher;
        $this->oauthManager = $oauthManager;
    }

    public function getName()
    {
        return 'client';
    }

    /**
     * Serializes required information for FrontEnd rendering.
     */
    public function serialize()
    {
        $request = $this->requestStack->getCurrentRequest();

        $logo = null;
        if ($this->config->getParameter('logo')) {
            $logo = $this->om->getRepository(PublicFile::class)->findOneBy([
                'url' => $this->config->getParameter('logo'),
            ]);
        }
        $usersLimitReached = false;

        if ($this->config->getParameter('restrictions.users') && $this->config->getParameter('restrictions.max_users')) {
            $maxUsers = $this->config->getParameter('restrictions.max_users');
            $userRepo = $this->om->getRepository(User::class);
            $usersCount = $userRepo->countAllEnabledUsers();

            if ($usersCount >= $maxUsers) {
                $usersLimitReached = true;
            }
        }

        $data = [
            'logo' => $logo ? $logo->getUrl() : null,
            'name' => $this->config->getParameter('name'),
            'secondaryName' => $this->config->getParameter('secondary_name'),
            'description' => null, // the one for the current locale
            'version' => $this->versionManager->getDistributionVersion(),
            'environment' => $this->env,
            'helpUrl' => $this->config->getParameter('help_url'),
            'selfRegistration' => $this->config->getParameter('registration.self') && !$usersLimitReached,
            'asset' => $this->assets->getUrl(''),
            'server' => [ // TODO : maybe only expose final URL
                'protocol' => $request->isSecure() || $this->config->getParameter('ssl_enabled') ? 'https' : 'http',
                'host' => $this->config->getParameter('domain_name') ? $this->config->getParameter('domain_name') : $request->getHost(),
                'path' => $request->getBasePath(),
            ],
            'theme' => $this->serializeTheme(),
            'locale' => $this->serializeLocale(),
            'display' => [
                'breadcrumb' => $this->config->getParameter('display.breadcrumb'),
            ],
            'restrictions' => $this->config->getParameter('restrictions'),
            'openGraph' => [
                'enabled' => $this->config->getParameter('enable_opengraph'),
            ],
            'home' => $this->config->getParameter('home'),
            'resources' => [ // TODO : maybe no longer needed here
                'types' => array_map(function (ResourceType $resourceType) {
                    return $this->resourceTypeSerializer->serialize($resourceType);
                }, $this->om->getRepository('ClarolineCoreBundle:Resource\ResourceType')->findAll()),
                'softDelete' => $this->config->getParameter('resource.soft_delete'),
            ],
            'swagger' => [
                'base' => $this->config->getParameter('swagger.base'),
            ],
            'desktop' => [ // TODO : find a better way to store and expose this
                'defaultTool' => $this->config->getParameter('desktop.default_tool'),
                'showProgression' => $this->config->getParameter('desktop.show_progression'),
            ],
            'admin' => [ // TODO : find a better way to store and expose this
                'defaultTool' => $this->config->getParameter('admin.default_tool'),
            ],
            'sso' => array_map(function (array $sso) { // TODO : do it elsewhere
                return [
                    'service' => $sso['service'],
                    'label' => isset($sso['display_name']) ? $sso['display_name'] : null,
                    'primary' => isset($sso['client_primary']) ? $sso['client_primary'] : false,
                ];
            }, $this->oauthManager->getActiveServices()),
            'plugins' => $this->pluginManager->getEnabled(true),
            'javascripts' => $this->config->getParameter('javascripts'),
            'stylesheets' => $this->config->getParameter('stylesheets'),
        ];

        $event = new GenericDataEvent();
        $this->eventDispatcher->dispatch('claroline_populate_client_config', $event);
        $data = array_merge($data, $event->getResponse() ?? []);

        return $data;
    }

    private function serializeLocale()
    {
        $request = $this->requestStack->getCurrentRequest();

        $currentUser = null;
        if (!empty($this->tokenStorage->getToken())) {
            $currentUser = $this->tokenStorage->getToken()->getUser();
        }

        // retrieve the current platform locale
        $locale = $this->config->getParameter('locale_language');
        if ($currentUser instanceof User) {
            // Get the locale for the logged user
            $locale = $currentUser->getLocale();
        } elseif (!empty($this->config->getParameter('locales')) && array_key_exists($request->getLocale(), $this->config->getParameter('locales'))) {
            // The current request locale is implemented so we use it
            $locale = $request->getLocale();
        }

        return [
            'current' => $locale,
            'available' => $this->config->getParameter('locales.available'),
        ];
    }

    private function serializeTheme()
    {
        $icons = $this->iconManager->getIconSetIconsByType(
            $this->iconManager->getActiveResourceIconSet()
        );

        return [
            'name' => strtolower($this->config->getParameter('theme')),
            'icons' => array_map(function (ResourceIconItemFilename $icon) {
                return [
                    'mimeTypes' => $icon->getMimeTypes(),
                    'url' => $icon->getRelativeUrl(),
                ];
            }, array_values(array_merge(
                $icons->getDefaultIcons()->getAllIcons(),
                $icons->getSetIcons()->getAllIcons()
            ))),
        ];
    }
}
