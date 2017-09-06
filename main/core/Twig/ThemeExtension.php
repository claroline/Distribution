<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Twig;

use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CoreBundle\Manager\Theme\ThemeManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Bridge\Twig\Extension\AssetExtension;

/**
 * @DI\Service
 * @DI\Tag("twig.extension")
 */
class ThemeExtension extends \Twig_Extension
{
    /** @var AssetExtension */
    private $assetExtension;
    /** @var ThemeManager */
    private $themeManager;
    /** @var PlatformConfigurationHandler */
    private $config;
    /** @var string */
    private $rootDir;
    /** @var array */
    private $assetCache;

    /**
     * ThemeExtension constructor.
     *
     * @DI\InjectParams({
     *     "extension" = @DI\Inject("twig.extension.assets"),
     *     "themeManager" = @DI\Inject("claroline.manager.theme_manager"),
     *     "config"    = @DI\Inject("claroline.config.platform_config_handler"),
     *     "rootDir"   = @DI\Inject("%kernel.root_dir%")
     * })
     *
     * @param AssetExtension               $extension
     * @param ThemeManager                 $themeManager
     * @param PlatformConfigurationHandler $config
     * @param string                       $rootDir
     */
    public function __construct(
        AssetExtension               $extension,
        ThemeManager                 $themeManager,
        PlatformConfigurationHandler $config,
        $rootDir)
    {
        $this->assetExtension = $extension;
        $this->themeManager = $themeManager;
        $this->config = $config;
        $this->rootDir = $rootDir;
    }

    public function getName()
    {
        return 'theme_extension';
    }

    public function getFunctions()
    {
        return [
            'themeAsset' => new \Twig_Function_Method($this, 'themeAsset'),
        ];
    }

    public function themeAsset($path, $themeName = null)
    {
        if (empty($themeName)) {
            $themeName = $this->config->getParameter('theme');
        }

        $assets = $this->getThemeAssets();
        if (!isset($assets[$themeName]) || !isset($assets[$themeName][$path])) {
            // selected theme can not be found, fall back to default theme
            $defaultTheme = $this->themeManager->getDefaultTheme();
            $themeName = $defaultTheme->getNormalizedName();

            if (!isset($assets[$themeName]) || !isset($assets[$themeName][$path])) {
                // default theme not found too, this time we can not do anything
                $assetNames = implode("\n", array_keys($assets));

                throw new \Exception(
                    "Cannot find asset '{$path}' for theme '{$themeName}' ".
                    "in theme build. Found:\n{$assetNames})"
                );
            }
        }

        return $this->assetExtension->getAssetUrl(
            'themes/'.$themeName.'/'.$path.'?v='.$assets[$themeName][$path]
        );
    }

    private function getThemeAssets()
    {
        if (!$this->assetCache) {
            $assetFile = "{$this->rootDir}/../theme-assets.json";

            if (!file_exists($assetFile)) {
                throw new \Exception(sprintf(
                    'Cannot find theme generated assets file(s). Make sure you have built them.'
                ));
            }

            $this->assetCache = json_decode(file_get_contents($assetFile), true);
        }

        return $this->assetCache;
    }
}
