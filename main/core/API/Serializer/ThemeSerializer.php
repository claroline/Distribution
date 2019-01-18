<?php

namespace Claroline\CoreBundle\API\Serializer;

use Claroline\CoreBundle\API\Serializer\User\UserSerializer;
use Claroline\CoreBundle\Entity\Theme\Theme;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.theme")
 * @DI\Tag("claroline.serializer")
 */
class ThemeSerializer
{
    /** @var PlatformConfigurationHandler */
    private $config;

    /**
     * ThemeSerializer constructor.
     *
     * @DI\InjectParams({
     *     "config"         = @DI\Inject("claroline.config.platform_config_handler")
     * })
     *
     * @param PlatformConfigurationHandler $config
     */
    public function __construct(
        PlatformConfigurationHandler $config
    ) {
        $this->config = $config;
    }

    /**
     * Serializes a Theme entity for the JSON api.
     *
     * @param Theme $theme - the theme to serialize
     *
     * @return array - the serialized representation of the theme
     */
    public function serialize(Theme $theme)
    {
        return [
            'id' => $theme->getUuid(),
            'name' => $theme->getName(),
            'current' => $theme->getNormalizedName() === $this->config->getParameter('theme'),
            'meta' => [
                'description' => $theme->getDescription(),
                'default' => $theme->isDefault(),
                'enabled' => $theme->isEnabled(),
                'custom' => $theme->isCustom(),
                'plugin' => $theme->getPlugin() ? $theme->getPlugin()->getDisplayName() : null,
                //TODO: Rétablir la clé creator sans provoquer de référence circulaire
                //TODO: 'creator' => $theme->getUser() ? $this->userSerializer->serialize($theme->getUser()) : null,
            ],
            'parameters' => [
                'extendDefault' => $theme->isExtendingDefault(),
            ],
        ];
    }

    /**
     * Deserializes JSON api data into a Theme entity.
     *
     * @param array $data  - the data to deserialize
     * @param Theme $theme - the theme entity to update
     *
     * @return Theme - the updated theme entity
     */
    public function deserialize(array $data, Theme $theme = null)
    {
        $theme = $theme ?: new Theme();

        $theme->setName($data['name']);

        // todo : update other themes props

        return $theme;
    }
}
