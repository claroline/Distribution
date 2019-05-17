<?php

namespace Claroline\AudioPlayerBundle\Serializer\Resource;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\AudioPlayerBundle\Entity\Resource\Section;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.audio.resource_section")
 * @DI\Tag("claroline.serializer")
 */
class SectionSerializer
{
    use SerializerTrait;

    /** @var ObjectManager */
    private $om;

    private $resourceNodeRepo;

    /**
     * @DI\InjectParams({
     *     "om" = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param ObjectManager $om
     */
    public function __construct(ObjectManager $om)
    {
        $this->om = $om;

        $this->resourceNodeRepo = $om->getRepository(ResourceNode::class);
    }

    /**
     * @param Section $section
     * @param array   $options
     *
     * @return array
     */
    public function serialize(Section $section, array $options = [])
    {
        $serialized = [
            'id' => $section->getUuid(),
            'type' => $section->getType(),
            'start' => $section->getStart(),
            'end' => $section->getEnd(),
            'color' => $section->getColor(),
            'showTranscript' => $section->getShowTranscript(),
            'transcript' => $section->getTranscript(),
            'commentsAllowed' => $section->isCommentsAllowed(),
            'showHelp' => $section->getShowHelp(),
            'help' => $section->getHelp(),
        ];

        return $serialized;
    }

    /**
     * @param array   $data
     * @param Section $section
     * @param array   $options
     *
     * @return Section
     */
    public function deserialize($data, Section $section, array $options = [])
    {
        $this->sipe('id', 'setUuid', $data, $section);
        $this->sipe('type', 'setType', $data, $section);
        $this->sipe('start', 'setStart', $data, $section);
        $this->sipe('end', 'setEnd', $data, $section);
        $this->sipe('color', 'setColor', $data, $section);
        $this->sipe('showTranscript', 'setShowTranscript', $data, $section);
        $this->sipe('transcript', 'setTranscript', $data, $section);
        $this->sipe('commentsAllowed', 'setCommentsAllowed', $data, $section);
        $this->sipe('showHelp', 'setShowHelp', $data, $section);
        $this->sipe('help', 'setHelp', $data, $section);

        if (isset($data['meta']['resourceNode']['id']) && !$section->getResourceNode()) {
            $resourceNode = $this->resourceNodeRepo->findOneBy(['uuid' => $data['meta']['resourceNode']['id']]);

            if ($resourceNode) {
                $section->setResourceNode($resourceNode);
            }
        }

        return $section;
    }
}
