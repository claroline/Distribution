<?php

namespace Claroline\DropZoneBundle\API\Serializer;

use Claroline\CoreBundle\API\Serializer\RoleSerializer;
use Claroline\CoreBundle\API\Serializer\UserSerializer;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\DropZoneBundle\Entity\Drop;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * @DI\Service("claroline.serializer.dropzone.drop")
 * @DI\Tag("claroline.serializer")
 */
class DropSerializer
{
    private $documentSerializer;
    private $userSerializer;
    private $roleSerializer;
    private $tokenStorage;
    private $dropRepo;
    private $dropzoneRepo;
    private $roleRepo;

    /**
     * DropSerializer constructor.
     *
     * @DI\InjectParams({
     *     "documentSerializer" = @DI\Inject("claroline.serializer.dropzone.document"),
     *     "userSerializer"     = @DI\Inject("claroline.serializer.user"),
     *     "roleSerializer"     = @DI\Inject("claroline.serializer.role"),
     *     "tokenStorage"       = @DI\Inject("security.token_storage"),
     *     "om"                 = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param DocumentSerializer    $documentSerializer
     * @param UserSerializer        $userSerializer
     * @param RoleSerializer        $roleSerializer
     * @param TokenStorageInterface $tokenStorage
     * @param ObjectManager         $om
     */
    public function __construct(
        DocumentSerializer $documentSerializer,
        UserSerializer $userSerializer,
        RoleSerializer $roleSerializer,
        TokenStorageInterface $tokenStorage,
        ObjectManager $om
    ) {
        $this->documentSerializer = $documentSerializer;
        $this->userSerializer = $userSerializer;
        $this->roleSerializer = $roleSerializer;
        $this->tokenStorage = $tokenStorage;
        $this->dropRepo = $om->getRepository('Claroline\DropZoneBundle\Entity\Drop');
        $this->dropzoneRepo = $om->getRepository('Claroline\DropZoneBundle\Entity\Dropzone');
        $this->roleRepo = $om->getRepository('Claroline\CoreBundle\Entity\Role');
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
            'user' => $this->userSerializer->serialize($drop->getUser()),
            'role' => $drop->getRole() ? $this->roleSerializer->serialize($drop->getRole()) : null,
            'dropDate' => $drop->getDropDate()->format('Y-m-d H:i'),
            'reported' => $drop->isReported(),
            'finished' => $drop->isFinished(),
            'number' => $drop->getNumber(),
            'autoClosedDrop' => $drop->getAutoClosedDrop(),
            'unlockedDrop' => $drop->isUnlockedDrop(),
            'unlockedUser' => $drop->isUnlockedUser(),
            'documents' => $this->getDocuments($drop),
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
            $drop->setDropDate(new \DateTime());
            $currentUser = $this->tokenStorage->getToken()->getUser();

            if ($currentUser instanceof User) {
                $drop->setUser($currentUser);
            }
        }
        if (isset($data['role'])) {
            $role = isset($data['role']['id']) ? $this->roleRepo->findOneBy(['id' => $data['role']['id']]) : null;
            $drop->setRole($role);
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

    private function deserializeDocuments(Drop $drop, $documentsData)
    {
        $drop->emptyDocuments();

        foreach ($documentsData as $documentData) {
            $document = $this->documentSerializer->deserialize('Claroline\DropZoneBundle\Entity\Document', $documentData);
            $drop->addDocument($document);
        }
    }
}
