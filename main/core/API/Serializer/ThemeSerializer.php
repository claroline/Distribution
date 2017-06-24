<?php

namespace Claroline\CoreBundle\API\Serializer;

use Claroline\CoreBundle\Entity\Theme\Theme;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.theme")
 * @DI\Tag("claroline.serializer")
 */
class ThemeSerializer
{
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
        ];
    }
}
