<?php

namespace Claroline\DropZoneBundle\API\Serializer;

use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\DropZoneBundle\Entity\DropzoneToolDrop;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.dropzone.tool.drop")
 * @DI\Tag("claroline.serializer")
 */
class DropzoneToolDropSerializer
{
    private $dropzoneToolDropRepo;

    /**
     * DropzoneToolDropSerializer constructor.
     *
     * @DI\InjectParams({
     *     "om" = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param ObjectManager $om
     */
    public function __construct(ObjectManager $om)
    {
        $this->dropzoneToolDropRepo = $om->getRepository('Claroline\DropZoneBundle\Entity\DropzoneToolDrop');
        $this->dropzoneToolRepo = $om->getRepository('Claroline\DropZoneBundle\Entity\DropzoneTool');
        $this->dropRepo = $om->getRepository('Claroline\DropZoneBundle\Entity\Drop');
    }

    /**
     * @param DropzoneToolDrop $dropzoneToolDrop
     *
     * @return array
     */
    public function serialize(DropzoneToolDrop $dropzoneToolDrop)
    {
        return [
            'id' => $dropzoneToolDrop->getUuid(),
            'drop' => $dropzoneToolDrop->getDrop() ? $dropzoneToolDrop->getDrop()->getUuid() : null,
            'tool' => $dropzoneToolDrop->getTool()->getUuid(),
            'data' => $dropzoneToolDrop->getData(),
        ];
    }

    /**
     * @param string $class
     * @param array  $data
     *
     * @return DropzoneToolDrop
     */
    public function deserialize($class, $data)
    {
        $dropzoneToolDrop = $this->dropzoneToolDropRepo->findOneBy(['uuid' => $data['id']]);

        if (empty($dropzoneTool)) {
            $dropzoneToolDrop = new DropzoneToolDrop();
            $dropzoneToolDrop->setUuid($data['id']);
            $tool = $this->dropzoneToolRepo->findOneBy(['uuid' => $data['tool']]);
            $dropzoneToolDrop->setTool($tool);
        }
        if (isset($data['drop'])) {
            $drop = $this->dropRepo->findOneBy(['uuid' => $data['drop']]);
            $dropzoneToolDrop->setDrop($drop);
        }
        if (isset($data['data'])) {
            $dropzoneToolDrop->setData($data['data']);
        }

        return $dropzoneToolDrop;
    }
}
