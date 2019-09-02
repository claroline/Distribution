<?php

namespace Claroline\CoreBundle\API\Serializer\Platform;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\Resource\ResourceTypeSerializer;
use Claroline\CoreBundle\Entity\Resource\ResourceType;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Event\GenericDataEvent;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CoreBundle\Library\Icon\ResourceIconItemFilename;
use Claroline\CoreBundle\Library\Utilities\FileUtilities;
use Claroline\CoreBundle\Manager\IconSetManager;
use Claroline\CoreBundle\Manager\PluginManager;
use Claroline\CoreBundle\Manager\VersionManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Asset\Packages;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * Serializes platform parameters used for client rendering.
 *
 * @DI\Service("claroline.serializer.platform_client")
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

    /** @var FileUtilities */
    private $fileUtilities;

    /** @var VersionManager */
    private $versionManager;

    /** @var PluginManager */
    private $pluginManager;

    /** @var IconSetManager */
    private $iconManager;

    /** @var ResourceTypeSerializer */
    private $resourceTypeSerializer;

    /**
     * ClientSerializer constructor.
     *
     * @DI\InjectParams({
     *     "env"                    = @DI\Inject("%kernel.environment%"),
     *     "assets"                 = @DI\Inject("assets.packages"),
     *     "eventDispatcher"        = @DI\Inject("event_dispatcher"),
     *     "tokenStorage"           = @DI\Inject("security.token_storage"),
     *     "requestStack"           = @DI\Inject("request_stack"),
     *     "om"                     = @DI\Inject("claroline.persistence.object_manager"),
     *     "router"                 = @DI\Inject("router"),
     *     "config"                 = @DI\Inject("claroline.config.platform_config_handler"),
     *     "fileUtilities"          = @DI\Inject("claroline.utilities.file"),
     *     "versionManager"         = @DI\Inject("claroline.manager.version_manager"),
     *     "pluginManager"          = @DI\Inject("claroline.manager.plugin_manager"),
     *     "iconManager"            = @DI\Inject("claroline.manager.icon_set_manager"),
     *     "resourceTypeSerializer" = @DI\Inject("claroline.serializer.resource_type")
     * })
     *
     * @param string                       $env
     * @param Packages                     $assets
     * @param TokenStorageInterface        $tokenStorage
     * @param RequestStack                 $requestStack
     * @param ObjectManager                $om
     * @param RouterInterface              $router
     * @param PlatformConfigurationHandler $config
     * @param FileUtilities                $fileUtilities
     * @param VersionManager               $versionManager
     * @param PluginManager                $pluginManager
     * @param IconSetManager               $iconManager
     * @param ResourceTypeSerializer       $resourceTypeSerializer
     * @param EventDispatcherInterface     $eventDispatcher
     */
    public function __construct(
        $env,
        Packages $assets,
        TokenStorageInterface $tokenStorage,
        RequestStack $requestStack,
        ObjectManager $om,
        RouterInterface $router,
        PlatformConfigurationHandler $config,
        FileUtilities $fileUtilities,
        VersionManager $versionManager,
        PluginManager $pluginManager,
        IconSetManager $iconManager,
        ResourceTypeSerializer $resourceTypeSerializer,
        EventDispatcherInterface $eventDispatcher
    ) {
        $this->env = $env;
        $this->assets = $assets;
        $this->tokenStorage = $tokenStorage;
        $this->requestStack = $requestStack;
        $this->om = $om;
        $this->router = $router;
        $this->config = $config;
        $this->fileUtilities = $fileUtilities;
        $this->versionManager = $versionManager;
        $this->pluginManager = $pluginManager;
        $this->iconManager = $iconManager;
        $this->resourceTypeSerializer = $resourceTypeSerializer;
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * Serializes required information for FrontEnd rendering.
     */
    public function serialize()
    {
        $request = $this->requestStack->getCurrentRequest();

        $logo = $this->fileUtilities->getOneBy([
            'url' => $this->config->getParameter('logo'),
        ]);

        $data = [
            'logo' => $logo ? $logo->getUrl() : null,
            'name' => $this->config->getParameter('name'),
            'secondaryName' => $this->config->getParameter('secondary_name'),
            'description' => null, // the one for the current locale
            'version' => $this->versionManager->getDistributionVersion(),
            'environment' => $this->env,
            'helpUrl' => $this->config->getParameter('help_url'),
            'selfRegistration' => $this->config->getParameter('allow_self_registration'),
            'asset' => $this->assets->getUrl(''),
            'server' => [
                'protocol' => $request->isSecure() || $this->config->getParameter('ssl_enabled') ? 'https' : 'http',
                'host' => $this->config->getParameter('domain_name') ? $this->config->getParameter('domain_name') : $request->getHost(),
                'path' => $request->getBasePath(),
            ],
            'theme' => $this->serializeTheme(),
            'locale' => $this->serializeLocale(),
            'openGraph' => [
                'enabled' => $this->config->getParameter('enable_opengraph'),
            ],
            'home' => $this->config->getParameter('home'),
            'resources' => [
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
            'plugins' => $this->pluginManager->getEnabled(true),
            'javascripts' => $this->config->getParameter('javascripts'),
            'stylesheets' => $this->config->getParameter('stylesheets'),
        ];

        $event = new GenericDataEvent();
        $this->eventDispatcher->dispatch('claroline_populate_client_config', $event);
        $data = array_merge($data, $event->getData() ?? []);

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
