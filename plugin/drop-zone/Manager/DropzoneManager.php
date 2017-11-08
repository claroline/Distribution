<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\DropZoneBundle\Manager;

use Claroline\CoreBundle\API\Crud;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Utilities\ClaroUtilities;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\DropZoneBundle\API\Serializer\DocumentSerializer;
use Claroline\DropZoneBundle\API\Serializer\DropSerializer;
use Claroline\DropZoneBundle\API\Serializer\DropzoneSerializer;
use Claroline\DropZoneBundle\Entity\Document;
use Claroline\DropZoneBundle\Entity\Drop;
use Claroline\DropZoneBundle\Entity\Dropzone;
use Claroline\DropZoneBundle\Repository\DropRepository;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * @DI\Service("claroline.manager.dropzone_manager")
 */
class DropzoneManager
{
    /** @var Crud */
    private $crud;

    /** @var DropzoneSerializer */
    private $dropzoneSerializer;

    /** @var DropSerializer */
    private $dropSerializer;

    /** @var DocumentSerializer */
    private $documentSerializer;

    /** @var Filesystem */
    private $fileSystem;

    private $filesDir;

    /** @var ObjectManager */
    private $om;

    /** @var ClaroUtilities */
    private $utils;

    /** @var DropRepository */
    private $dropRepo;

    /**
     * DropzoneManager constructor.
     *
     * @DI\InjectParams({
     *     "crud"               = @DI\Inject("claroline.api.crud"),
     *     "dropzoneSerializer" = @DI\Inject("claroline.serializer.dropzone"),
     *     "dropSerializer"     = @DI\Inject("claroline.serializer.dropzone.drop"),
     *     "documentSerializer" = @DI\Inject("claroline.serializer.dropzone.document"),
     *     "fileSystem"         = @DI\Inject("filesystem"),
     *     "filesDir"           = @DI\Inject("%claroline.param.files_directory%"),
     *     "om"                 = @DI\Inject("claroline.persistence.object_manager"),
     *     "utils"              = @DI\Inject("claroline.utilities.misc")
     * })
     *
     * @param Crud               $crud
     * @param DropzoneSerializer $dropzoneSerializer
     * @param DropSerializer     $dropSerializer
     * @param DocumentSerializer $documentSerializer
     * @param Filesystem         $fileSystem
     * @param string             $filesDir
     * @param ObjectManager      $om
     * @param ClaroUtilities     $utils
     */
    public function __construct(
        Crud $crud,
        DropzoneSerializer $dropzoneSerializer,
        DropSerializer $dropSerializer,
        DocumentSerializer $documentSerializer,
        Filesystem $fileSystem,
        $filesDir,
        ObjectManager $om,
        ClaroUtilities $utils
    ) {
        $this->crud = $crud;
        $this->dropzoneSerializer = $dropzoneSerializer;
        $this->dropSerializer = $dropSerializer;
        $this->documentSerializer = $documentSerializer;
        $this->fileSystem = $fileSystem;
        $this->filesDir = $filesDir;
        $this->om = $om;
        $this->utils = $utils;

        $this->dropRepo = $om->getRepository('Claroline\DropZoneBundle\Entity\Drop');
    }

    /**
     * Serializes a Dropzone entity.
     *
     * @param Dropzone $dropzone
     *
     * @return array
     */
    public function serialize(Dropzone $dropzone)
    {
        return $this->dropzoneSerializer->serialize($dropzone);
    }

    /**
     * Serializes a Drop entity.
     *
     * @param Drop $drop
     *
     * @return array
     */
    public function serializeDrop(Drop $drop)
    {
        return $this->dropSerializer->serialize($drop);
    }

    /**
     * Serializes a Document entity.
     *
     * @param Document $document
     *
     * @return array
     */
    public function serializeDocument(Document $document)
    {
        return $this->documentSerializer->serialize($document);
    }

    /**
     * Updates a Dropzone.
     *
     * @param Dropzone $dropzone
     * @param array    $data
     *
     * @return Dropzone
     */
    public function update(Dropzone $dropzone, array $data)
    {
        $this->crud->update('Claroline\DropZoneBundle\Entity\Dropzone', $data);

        return $dropzone;
    }

    /**
     * Deletes a Dropzone.
     *
     * @param Dropzone $dropzone
     */
    public function delete(Dropzone $dropzone)
    {
        $this->om->startFlushSuite();
        $uuid = $dropzone->getUuid();
        $ds = DIRECTORY_SEPARATOR;
        $dropzoneDir = $this->filesDir.$ds.'dropzone'.$ds.$uuid;

        if ($this->fileSystem->exists($dropzoneDir)) {
            $this->fileSystem->remove($dropzoneDir);
        }
        $this->crud->delete($dropzone, 'Claroline\DropZoneBundle\Entity\Dropzone');
        $this->om->endFlushSuite();
    }

    /**
     * Gets user drop or create one.
     *
     * @param Dropzone $dropzone
     * @param User     $user
     */
    public function getUserDrop(Dropzone $dropzone, User $user)
    {
        $drops = $this->dropRepo->findBy(['dropzone' => $dropzone, 'user' => $user]);
        $drop = count($drops) > 0 ? $drops[0] : null;

        if (empty($drop)) {
            $drop = new Drop();
            $drop->setUser($user);
            $drop->setDropzone($dropzone);
            $this->om->persist($drop);
            $this->om->flush();
        }

        return $drop;
    }

    /**
     * Gets all user drops.
     *
     * @param Dropzone $dropzone
     * @param User     $user
     */
    public function getSerializedUserDrops(Dropzone $dropzone, User $user)
    {
        $serializedDrops = [];
        $drops = $this->dropRepo->findUserDrops($dropzone, $user);

        foreach ($drops as $drop) {
            $serializedDrops[] = $this->dropSerializer->serialize($drop);
        }

        return $serializedDrops;
    }

    /**
     * Deletes a Drop.
     *
     * @param Drop $drop
     */
    public function deleteDrop(Drop $drop)
    {
        $this->om->startFlushSuite();
        $documents = $drop->getDocuments();

        foreach ($documents as $document) {
            $this->deleteDocument($document);
        }
        $this->om->remove($drop);
        $this->om->endFlushSuite();
    }

    /**
     * Creates a Document.
     *
     * @param Drop  $drop
     * @param User  $user
     * @param int   $documentType
     * @param mixed $documentData
     */
    public function createDocument(Drop $drop, User $user, $documentType, $documentData)
    {
        $document = new Document();
        $document->setDrop($drop);
        $document->setUser($user);
        $document->setDropDate(new \DateTime());
        $document->setType($documentType);
        $data = $documentData;
        $document->setData($data);
        $this->om->persist($document);
        $this->om->flush();

        return $document;
    }

    /**
     * Creates Files Documents.
     *
     * @param Drop  $drop
     * @param User  $user
     * @param array $files
     */
    public function createFilesDocuments(Drop $drop, User $user, array $files)
    {
        $documents = [];
        $currentDate = new \DateTime();
        $dropzone = $drop->getDropzone();
        $this->om->startFlushSuite();

        foreach ($files as $file) {
            $document = new Document();
            $document->setDrop($drop);
            $document->setUser($user);
            $document->setDropDate($currentDate);
            $document->setType(Document::DOCUMENT_TYPE_FILE);
            $data = $this->registerFile($dropzone, $file);
            $document->setFile($data);
            $this->om->persist($document);
            $documents[] = $this->serializeDocument($document);
        }
        $this->om->endFlushSuite();

        return $documents;
    }

    /**
     * Deletes a Document.
     *
     * @param Document $document
     */
    public function deleteDocument(Document $document)
    {
        if ($document->getType() === Document::DOCUMENT_TYPE_FILE) {
            $data = $document->getFile();

            if (isset($data['url'])) {
                $this->fileSystem->remove($this->filesDir.DIRECTORY_SEPARATOR.$data['url']);
            }
        }
        $this->om->remove($document);
        $this->om->flush();
    }

    /**
     * Terminates a drop.
     *
     * @param Drop $drop
     */
    public function submitDrop(Drop $drop)
    {
        $drop->setFinished(true);
        $drop->setDropDate(new \DateTime());
        $this->om->persist($drop);
        $this->om->flush();
    }

    private function registerFile(Dropzone $dropzone, UploadedFile $file)
    {
        $ds = DIRECTORY_SEPARATOR;
        $hashName = $this->utils->generateGuid();
        $dir = $this->filesDir.$ds.'dropzone'.$ds.$dropzone->getUuid();
        $fileName = $hashName.'.'.$file->getClientOriginalExtension();

        $file->move($dir, $fileName);

        return [
            'name' => $file->getClientOriginalName(),
            'mimeType' => $file->getClientMimeType(),
            'url' => '../files/dropzone'.$ds.$dropzone->getUuid().$ds.$fileName,
        ];
    }
}
