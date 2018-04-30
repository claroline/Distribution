<?php

namespace Claroline\CoreBundle\API\Serializer\Platform;

use Claroline\CoreBundle\Entity\Plugin;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CoreBundle\Manager\PluginManager;
use Claroline\CoreBundle\Manager\VersionManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\HttpFoundation\RequestStack;
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

    /** @var TokenStorageInterface */
    private $tokenStorage;

    /** @var RequestStack */
    private $requestStack;

    /** @var PlatformConfigurationHandler */
    private $config;

    /** @var VersionManager */
    private $versionManager;

    /** @var PluginManager */
    private $pluginManager;

    /**
     * ClientSerializer constructor.
     *
     * @DI\InjectParams({
     *     "env"            = @DI\Inject("%kernel.environment%"),
     *     "tokenStorage"   = @DI\Inject("security.token_storage"),
     *     "requestStack"   = @DI\Inject("request_stack"),
     *     "config"         = @DI\Inject("claroline.config.platform_config_handler"),
     *     "versionManager" = @DI\Inject("claroline.manager.version_manager"),
     *     "pluginManager"  = @DI\Inject("claroline.manager.plugin_manager")
     * })
     *
     * @param string                       $env,
     * @param TokenStorageInterface        $tokenStorage
     * @param RequestStack                 $requestStack
     * @param PlatformConfigurationHandler $config
     * @param VersionManager               $versionManager
     * @param PluginManager                $pluginManager
     */
    public function __construct(
        $env,
        TokenStorageInterface $tokenStorage,
        RequestStack $requestStack,
        PlatformConfigurationHandler $config,
        VersionManager $versionManager,
        PluginManager $pluginManager
    ) {
        $this->env = $env;
        $this->tokenStorage = $tokenStorage;
        $this->requestStack = $requestStack;
        $this->config = $config;
        $this->versionManager = $versionManager;
        $this->pluginManager = $pluginManager;
    }

    /**
     * Serializes required information for FrontEnd rendering.
     */
    public function serialize()
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
            'name' => $this->config->getParameter('name'),
            'description' => null, // the one for the current locale
            'version' => $this->versionManager->getDistributionVersion(),
            'environment' => $this->env,
            'server' => [
                'protocol' => $request->isSecure() || $this->config->getParameter('theme') ? 'https' : 'http',
                'host' => $this->config->getParameter('domain_name') ? $this->config->getParameter('domain_name') : $request->getHost(),
            ],
            'theme' => [
                'name' => $this->config->getParameter('theme'),
            ],
            'locale' => [
                'current' => $locale,
                'available' => $this->config->getParameter('locales'),
            ],
            'openGraph' => [
                'enabled' => $this->config->getParameter('enable_opengraph'),
            ],
            'plugins' => array_map(function (Plugin $plugin) {
                return;
            }, $this->pluginManager->getEnabled()),
        ];
    }
}
