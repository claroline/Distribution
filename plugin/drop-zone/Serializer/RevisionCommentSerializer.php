<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\DropZoneBundle\Serializer;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use Claroline\DropZoneBundle\Entity\Revision;
use Claroline\DropZoneBundle\Entity\RevisionComment;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.dropzone.revision.comment")
 * @DI\Tag("claroline.serializer")
 */
class RevisionCommentSerializer
{
    use SerializerTrait;

    /** @var SerializerProvider */
    private $serializer;

    private $revisionRepo;
    private $userRepo;

    /**
     * RevisionCommentSerializer constructor.
     *
     * @DI\InjectParams({
     *     "om"         = @DI\Inject("claroline.persistence.object_manager"),
     *     "serializer" = @DI\Inject("claroline.api.serializer")
     * })
     *
     * @param ObjectManager      $om
     * @param SerializerProvider $serializer
     */
    public function __construct(ObjectManager $om, SerializerProvider $serializer)
    {
        $this->serializer = $serializer;

        $this->revisionRepo = $om->getRepository(Revision::class);
        $this->userRepo = $om->getRepository(User::class);
    }

    /**
     * @param RevisionComment $comment
     * @param array           $options
     *
     * @return array
     */
    public function serialize(RevisionComment $comment, array $options = [])
    {
        $serialized = [
            'id' => $comment->getUuid(),
            'content' => $comment->getContent(),
            'user' => $comment->getUser() ?
                $this->serializer->serialize($comment->getUser(), [Options::SERIALIZE_MINIMAL]) :
                null,
            'meta' => [
                'creationDate' => DateNormalizer::normalize($comment->getCreationDate()),
                'editionDate' => $comment->getEditionDate() ?
                    DateNormalizer::normalize($comment->getEditionDate()) :
                    null,
            ],
        ];

        return $serialized;
    }

    /**
     * @param array           $data
     * @param RevisionComment $comment
     *
     * @return RevisionComment
     */
    public function deserialize($data, RevisionComment $comment)
    {
        $this->sipe('id', 'setUuid', $data, $comment);
        $this->sipe('content', 'setContent', $data, $comment);

        if (!$comment->getUser() && isset($data['user']['id'])) {
            $user = $this->userRepo->findOneBy(['uuid' => $data['user']['id']]);
            $comment->setUser($user);
        }
        if (!$comment->getRevision() && isset($data['meta']['revision']['id'])) {
            $revision = $this->revisionRepo->findOneBy(['uuid' => $data['meta']['revision']['id']]);
            $comment->setRevision($revision);
        }

        return $comment;
    }
}