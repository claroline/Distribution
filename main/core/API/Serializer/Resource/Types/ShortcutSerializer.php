<?php

namespace Claroline\CoreBundle\API\Serializer\Resource\Types;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\API\Serializer\Resource\ResourceNodeSerializer;
use Claroline\CoreBundle\Entity\Resource\ResourceShortcut;
use Claroline\CoreBundle\Entity\Resource\Text;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.resource_shortcut")
 * @DI\Tag("claroline.serializer")
 */
class ShortcutSerializer
{
    use SerializerTrait;

    /** @var ResourceNodeSerializer */
    private $resourceNodeSerializer;

    /**
     * ShortcutSerializer constructor.
     *
     * @DI\InjectParams({
     *     "resourceNodeSerializer" = @DI\Inject("claroline.serializer.resource_node")
     * })
     *
     * @param ResourceNodeSerializer $resourceNodeSerializer
     */
    public function __construct(
        ResourceNodeSerializer $resourceNodeSerializer)
    {
        $this->resourceNodeSerializer = $resourceNodeSerializer;
    }

    /**
     * Serializes a Shortcut resource entity for the JSON api.
     *
     * @param ResourceShortcut $shortcut
     * @param array            $options
     *
     * @return array
     */
    public function serialize(ResourceShortcut $shortcut, array $options = [])
    {
        return [
            'target' => $this->resourceNodeSerializer->serialize($shortcut->getTarget(), $options),
        ];
    }

    /**
     * Deserializes shortcut data into an Entity.
     *
     * @param array $data
     * @param ResourceShortcut $shortcut
     *
     * @return Text
     */
    public function deserialize(array $data, ResourceShortcut $shortcut)
    {

    }
}
