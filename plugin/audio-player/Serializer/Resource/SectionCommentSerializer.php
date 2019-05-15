<?php

namespace Claroline\AudioPlayerBundle\Serializer\Resource;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\AudioPlayerBundle\Entity\Resource\SectionComment;
use Claroline\CoreBundle\API\Serializer\User\UserSerializer;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline_audio.serializer.section_comment")
 * @DI\Tag("claroline.serializer")
 */
class SectionCommentSerializer
{
    use SerializerTrait;

    /** @var ObjectManager */
    private $om;

    /** @var UserSerializer */
    private $userSerializer;

    private $resourceNodeRepo;
    private $userRepo;

    /**
     * @DI\InjectParams({
     *     "om"              = @DI\Inject("claroline.persistence.object_manager"),
     *      "userSerializer" = @DI\Inject("claroline.serializer.user")
     * })
     *
     * @param ObjectManager  $om
     * @param UserSerializer $userSerializer
     */
    public function __construct(ObjectManager $om, UserSerializer $userSerializer)
    {
        $this->om = $om;
        $this->userSerializer = $userSerializer;

        $this->resourceNodeRepo = $om->getRepository(ResourceNode::class);
        $this->userRepo = $om->getRepository(User::class);
    }

    /**
     * @param SectionComment $sectionComment
     * @param array          $options
     *
     * @return array
     */
    public function serialize(SectionComment $sectionComment, array $options = [])
    {
        $serialized = [
            'id' => $sectionComment->getUuid(),
            'content' => $sectionComment->getContent(),
            'start' => $sectionComment->getStart(),
            'end' => $sectionComment->getEnd(),
            'color' => $sectionComment->getContent(),
            'meta' => [
                'creationDate' => DateNormalizer::normalize($sectionComment->getCreationDate()),
                'editionDate' => $sectionComment->getEditionDate() ?
                    DateNormalizer::normalize($sectionComment->getEditionDate()) :
                    null,
                'user' => $sectionComment->getUser() ?
                    $this->userSerializer->serialize($sectionComment->getUser(), [Options::SERIALIZE_MINIMAL]) :
                    null,
            ],
        ];

        return $serialized;
    }

    /**
     * @param array          $data
     * @param SectionComment $sectionComment
     * @param array          $options
     *
     * @return SectionComment $sectionComment
     */
    public function deserialize($data, SectionComment $sectionComment, array $options = [])
    {
        $this->sipe('content', 'setContent', $data, $sectionComment);
        $this->sipe('start', 'setStart', $data, $sectionComment);
        $this->sipe('end', 'setEnd', $data, $sectionComment);
        $this->sipe('color', 'setColor', $data, $sectionComment);

        if (isset($data['meta']['user']['id']) && !$sectionComment->getUser()) {
            $user = $this->userRepo->findOneBy(['uuid' => $data['meta']['user']['id']]);

            if ($user) {
                $sectionComment->setUser($user);
            }
        }
        if (isset($data['meta']['resourceNode']['id']) && !$sectionComment->getNode()) {
            $node = $this->resourceNodeRepo->findOneBy(['uuid' => $data['meta']['resourceNode']['id']]);

            if ($node) {
                $sectionComment->setNode($node);
            }
        }

        return $sectionComment;
    }
}
