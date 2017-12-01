<?php

namespace Claroline\DropZoneBundle\API\Serializer;

use Claroline\CoreBundle\API\Serializer\RoleSerializer;
use Claroline\CoreBundle\API\Serializer\UserSerializer;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\DropZoneBundle\Entity\Drop;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.dropzone.drop")
 * @DI\Tag("claroline.serializer")
 */
class DropSerializer
{
    private $correctionSerializer;
    private $documentSerializer;
    private $userSerializer;
    private $roleSerializer;

    private $dropRepo;
    private $dropzoneRepo;
    private $roleRepo;
    private $userRepo;

    /**
     * DropSerializer constructor.
     *
     * @DI\InjectParams({
     *     "correctionSerializer" = @DI\Inject("claroline.serializer.dropzone.correction"),
     *     "documentSerializer"   = @DI\Inject("claroline.serializer.dropzone.document"),
     *     "userSerializer"       = @DI\Inject("claroline.serializer.user"),
     *     "roleSerializer"       = @DI\Inject("claroline.serializer.role"),
     *     "om"                   = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param CorrectionSerializer $correctionSerializer
     * @param DocumentSerializer   $documentSerializer
     * @param UserSerializer       $userSerializer
     * @param RoleSerializer       $roleSerializer
     * @param ObjectManager        $om
     */
    public function __construct(
        CorrectionSerializer $correctionSerializer,
        DocumentSerializer $documentSerializer,
        UserSerializer $userSerializer,
        RoleSerializer $roleSerializer,
        ObjectManager $om
    ) {
        $this->correctionSerializer = $correctionSerializer;
        $this->documentSerializer = $documentSerializer;
        $this->userSerializer = $userSerializer;
        $this->roleSerializer = $roleSerializer;

        $this->dropRepo = $om->getRepository('Claroline\DropZoneBundle\Entity\Drop');
        $this->dropzoneRepo = $om->getRepository('Claroline\DropZoneBundle\Entity\Dropzone');
        $this->roleRepo = $om->getRepository('Claroline\CoreBundle\Entity\Role');
        $this->userRepo = $om->getRepository('Claroline\CoreBundle\Entity\User');
    }

    /**
     * @param Drop $drop
     *
     * @return array
     */
    public function serialize(Drop $drop)
    {
        return [
            'id' => $drop->getUuid(),
            'dropzone' => $drop->getDropzone()->getUuid(),
            'user' => $drop->getUser() ? $this->userSerializer->serialize($drop->getUser()) : null,
            'role' => $drop->getRole() ? $this->roleSerializer->serialize($drop->getRole()) : null,
            'dropDate' => $drop->getDropDate() ? $drop->getDropDate()->format('Y-m-d H:i') : null,
            'score' => $drop->getScore(),
            'reported' => $drop->isReported(),
            'finished' => $drop->isFinished(),
            'number' => $drop->getNumber(),
            'autoClosedDrop' => $drop->getAutoClosedDrop(),
            'unlockedDrop' => $drop->isUnlockedDrop(),
            'unlockedUser' => $drop->isUnlockedUser(),
            'documents' => $this->getDocuments($drop),
            'corrections' => $this->getCorrections($drop),
        ];
    }

    /**
     * @param string $class
     * @param array  $data
     *
     * @return Drop
     */
    public function deserialize($class, $data)
    {
        $drop = $this->dropRepo->findOneBy(['uuid' => $data['id']]);

        if (empty($drop)) {
            $drop = new Drop();
            $drop->setUuid($data['id']);
            $dropzone = $this->dropzoneRepo->findOneBy(['uuid' => $data['drop']]);
            $drop->setDropzone($dropzone);
        }
        if (isset($data['user'])) {
            $user = isset($data['user']['id']) ? $this->userRepo->findOneBy(['id' => $data['user']['id']]) : null;
            $drop->setUser($user);
        }
        if (isset($data['role'])) {
            $role = isset($data['role']['id']) ? $this->roleRepo->findOneBy(['id' => $data['role']['id']]) : null;
            $drop->setRole($role);
        }
        if (isset($data['dropDate'])) {
            $dropDate = !empty($data['dropDate']) ? new \DateTime($data['dropDate']) : null;
            $drop->setDropDate($dropDate);
        }
        if (isset($data['score'])) {
            $drop->setScore($data['score']);
        }
        if (isset($data['reported'])) {
            $drop->setReported($data['reported']);
        }
        if (isset($data['finished'])) {
            $drop->setFinished($data['finished']);
        }
        if (isset($data['number'])) {
            $drop->setNumber($data['number']);
        }
        if (isset($data['autoClosedDrop'])) {
            $drop->setAutoClosedDrop($data['autoClosedDrop']);
        }
        if (isset($data['unlockedDrop'])) {
            $drop->setUnlockedDrop($data['unlockedDrop']);
        }
        if (isset($data['unlockedUser'])) {
            $drop->setUnlockedUser($data['unlockedUser']);
        }
        $this->deserializeDocuments($drop, $data['documents']);
        $this->deserializeCorrections($drop, $data['corrections']);

        return $drop;
    }

    private function getDocuments(Drop $drop)
    {
        $documents = [];

        foreach ($drop->getDocuments() as $document) {
            $documents[] = $this->documentSerializer->serialize($document);
        }

        return $documents;
    }

    private function getCorrections(Drop $drop)
    {
        $corrections = [];

        foreach ($drop->getCorrections() as $correction) {
            $corrections[] = $this->correctionSerializer->serialize($correction);
        }

        return $corrections;
    }

    private function deserializeDocuments(Drop $drop, $documentsData)
    {
        $drop->emptyDocuments();

        foreach ($documentsData as $documentData) {
            $document = $this->documentSerializer->deserialize('Claroline\DropZoneBundle\Entity\Document', $documentData);
            $drop->addDocument($document);
        }
    }

    private function deserializeCorrections(Drop $drop, $correctionsData)
    {
        $drop->emptyCorrections();

        foreach ($correctionsData as $correctionData) {
            $correction = $this->correctionSerializer->deserialize('Claroline\DropZoneBundle\Entity\Correction', $correctionData);
            $drop->addCorrection($correction);
        }
    }
}
