<?php

namespace Claroline\CoreBundle\API\Serializer\Resource\Types;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\Entity\Resource\File;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Routing\RouterInterface;

/**
 * @DI\Service("claroline.serializer.resource_file")
 * @DI\Tag("claroline.serializer")
 */
class FileSerializer
{
    use SerializerTrait;

    /** @var RouterInterface */
    private $router;

    /**
     * ResourceNodeManager constructor.
     *
     * @DI\InjectParams({
     *     "router" = @DI\Inject("router")
     * })
     *
     * @param RouterInterface $router
     */
    public function __construct(RouterInterface $router)
    {
        $this->router = $router;
    }

    /**
     * Serializes a File resource entity for the JSON api.
     *
     * @param File $file - the file to serialize
     *
     * @return array - the serialized representation of the file
     */
    public function serialize(File $file)
    {
        return [
            //'id' => $file->getId(),
            'hashName' => $file->getHashName(),
            'size' => $file->getSize(),

            // We generate URL here because the stream API endpoint uses ResourceNode ID,
            // but the new api only contains the ResourceNode UUID.

            // NB : This will no longer be required when the stream API will use UUIDs
            'url' => $this->router->generate('claro_file_get_media', [
                'node' => $file->getResourceNode()->getId(),
            ]),
        ];
    }

    public function deserialize($data, File $file)
    {
        $this->sipe('size', 'setSize', $data, $file);
        $this->sipe('hashName', 'setHashName', $data, $file);
    }
}
