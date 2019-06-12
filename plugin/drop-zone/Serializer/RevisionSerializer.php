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
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\User\UserSerializer;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use Claroline\DropZoneBundle\Entity\Document;
use Claroline\DropZoneBundle\Entity\Revision;
use Claroline\DropZoneBundle\Entity\RevisionComment;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.dropzone.revision")
 * @DI\Tag("claroline.serializer")
 */
class RevisionSerializer
{
    use SerializerTrait;

    private $documentSerializer;
    private $revisionCommentSerializer;
    private $userSerializer;

    private $revisionRepo;
    private $dropRepo;
    private $userRepo;

    /**
     * RevisionSerializer constructor.
     *
     * @DI\InjectParams({
     *     "documentSerializer"        = @DI\Inject("claroline.serializer.dropzone.document"),
     *     "revisionCommentSerializer" = @DI\Inject("claroline.serializer.dropzone.revision.comment"),
     *     "userSerializer"            = @DI\Inject("claroline.serializer.user"),
     *     "om"                        = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param DocumentSerializer        $documentSerializer
     * @param RevisionCommentSerializer $revisionCommentSerializer
     * @param UserSerializer            $userSerializer
     * @param ObjectManager             $om
     */
    public function __construct(
        DocumentSerializer $documentSerializer,
        RevisionCommentSerializer $revisionCommentSerializer,
        UserSerializer $userSerializer,
        ObjectManager $om
    ) {
        $this->documentSerializer = $documentSerializer;
        $this->revisionCommentSerializer = $revisionCommentSerializer;
        $this->userSerializer = $userSerializer;

        $this->revisionRepo = $om->getRepository('Claroline\DropZoneBundle\Entity\Revision');
        $this->dropRepo = $om->getRepository('Claroline\DropZoneBundle\Entity\Drop');
        $this->userRepo = $om->getRepository('Claroline\CoreBundle\Entity\User');
    }

    /**
     * @param Revision $revision
     * @param array    $options
     *
     * @return array
     */
    public function serialize(Revision $revision, array $options = [])
    {
        $serialized = [
            'id' => $revision->getUuid(),
            'creator' => $revision->getCreator() ?
                $this->userSerializer->serialize($revision->getCreator(), [Options::SERIALIZE_MINIMAL]) :
                null,
            'creationDate' => DateNormalizer::normalize($revision->getCreationDate()),
        ];

        if (!in_array(Options::SERIALIZE_MINIMAL, $options)) {
            $serialized = array_merge($serialized, [
                'documents' => array_values(array_map(function (Document $document) {
                    return $this->documentSerializer->serialize($document);
                }, $revision->getComments()->toArray())),
                'comments' => array_values(array_map(function (RevisionComment $comment) use ($options) {
                    return $this->revisionCommentSerializer->serialize($comment, $options);
                }, $revision->getComments()->toArray())),
            ]);
        }

        return $serialized;
    }

    /**
     * @param array    $data
     * @param Revision $revision
     *
     * @return Revision
     */
    public function deserialize($data, Revision $revision = null)
    {
        if (empty($correction)) {
            $revision = $this->revisionRepo->findOneBy(['uuid' => $data['id']]);
        }
        $revision = $revision ?: new Revision();

        $this->sipe('id', 'setUuid', $data, $revision);

        if (!$revision->getDrop() && isset($data['drop']['id'])) {
            $drop = $this->dropRepo->findOneBy(['uuid' => $data['drop']['id']]);
            $revision->setDrop($drop);
        }
        if (!$revision->getCreator() && isset($data['creator']['id'])) {
            $creator = isset($data['creator']['id']) ? $this->userRepo->findOneBy(['uuid' => $data['creator']['id']]) : null;
            $revision->setCreator($creator);
        }

        return $correction;
    }
}
