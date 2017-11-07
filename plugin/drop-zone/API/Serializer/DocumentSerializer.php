<?php

namespace Claroline\DropZoneBundle\API\Serializer;

use Claroline\CoreBundle\API\Serializer\UserSerializer;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\DropZoneBundle\Entity\Document;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * @DI\Service("claroline.serializer.dropzone.document")
 * @DI\Tag("claroline.serializer")
 */
class DocumentSerializer
{
    private $userSerializer;
    private $tokenStorage;

    private $documentRepo;
    private $dropRepo;
    private $resourceNodeRepo;

    /**
     * DocumentSerializer constructor.
     *
     * @DI\InjectParams({
     *     "userSerializer" = @DI\Inject("claroline.serializer.user"),
     *     "tokenStorage"   = @DI\Inject("security.token_storage"),
     *     "om"             = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param UserSerializer        $userSerializer
     * @param TokenStorageInterface $tokenStorage
     * @param ObjectManager         $om
     */
    public function __construct(
        UserSerializer $userSerializer,
        TokenStorageInterface $tokenStorage,
        ObjectManager $om
    ) {
        $this->userSerializer = $userSerializer;
        $this->tokenStorage = $tokenStorage;

        $this->documentRepo = $om->getRepository('Claroline\DropZoneBundle\Entity\Document');
        $this->dropRepo = $om->getRepository('Claroline\DropZoneBundle\Entity\Drop');
        $this->resourceNodeRepo = $om->getRepository('Claroline\CoreBundle\Entity\Resource\ResourceNode');
    }

    /**
     * @param Document $document
     *
     * @return array
     */
    public function serialize(Document $document)
    {
        $type = $document->getType();

        return [
            'id' => $document->getUuid(),
            'type' => $type,
            'data' => $type === Document::DOCUMENT_TYPE_RESOURCE ? $document->getData()->getUuid() : $document->getData(),
            'drop' => $document->getDrop()->getUuid(),
            'user' => $document->getUser() ? $this->userSerializer->serialize($document->getUser()) : null,
            'dropDate' => $document->getDropDate() ? $document->getDropDate()->format('Y-m-d H:i') : null,
        ];
    }

    /**
     * @param string $class
     * @param array  $data
     *
     * @return Document
     */
    public function deserialize($class, $data)
    {
        $document = $this->documentRepo->findOneBy(['uuid' => $data['id']]);

        if (empty($document)) {
            $document = new Document();
            $document->setUuid($data['id']);
            $drop = $this->dropRepo->findOneBy(['uuid' => $data['drop']]);
            $document->setDrop($drop);
            $currentUser = $this->tokenStorage->getToken()->getUser();

            if ($currentUser instanceof User) {
                $document->setUser($currentUser);
            }
            $document->setDropDate(new \DateTime());
        }
        if (isset($data['type'])) {
            $document->setType($data['type']);

            if (isset($data['data'])) {
                $documentData = $data['type'] === Document::DOCUMENT_TYPE_RESOURCE ?
                    $this->resourceNodeRepo->findOneBy(['uuid' => $data['data']]) :
                    $data['data'];
                $document->setData($documentData);
            }
        }

        return $document;
    }
}
