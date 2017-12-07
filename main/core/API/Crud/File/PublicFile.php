<?php

namespace Claroline\CoreBundle\API\Crud\File;

use Claroline\CoreBundle\Event\CrudEvent;
use Claroline\CoreBundle\Library\Utilities\FileUtilities;
use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use Ramsey\Uuid\Uuid;
use Symfony\Component\Filesystem\Filesystem as SymfonyFileSystem;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * @DI\Service("claroline.crud.publicfile")
 * @DI\Tag("claroline.crud")
 */
class PublicFile
{
    /** @var ObjectManager */
    private $om;

    /** @var FileUtilities */
    private $utils;

    /**
     * @DI\InjectParams({
     *     "filesDir"       = @DI\Inject("%claroline.param.files_directory%"),
     *     "fileSystem"     = @DI\Inject("filesystem"),
     *     "om"             = @DI\Inject("claroline.persistence.object_manager"),
     *     "publicFilesDir" = @DI\Inject("%claroline.param.public_files_directory%"),
     *     "tokenStorage"   = @DI\Inject("security.token_storage"),
     *     "fileUtils"      = @DI\Inject("claroline.utilities.file")
     * })
     */
    public function __construct(
        $filesDir,
        SymfonyFileSystem $fileSystem,
        ObjectManager $om,
        $publicFilesDir,
        TokenStorageInterface $tokenStorage,
        FileUtilities $fileUtils
    ) {
        $this->filesDir = $filesDir;
        $this->fileSystem = $fileSystem;
        $this->om = $om;
        $this->publicFilesDir = $publicFilesDir;
        $this->tokenStorage = $tokenStorage;
        $this->fileUtils = $fileUtils;
    }

    /**
     * @DI\Observe("crud_pre_create_object_claroline_corebundle_entity_file_publicfile")
     *
     * @param CrudEvent $event
     */
    public function preCreate(CrudEvent $event)
    {
        $publicFile = $event->getObject();
        $options = $event->getOptions();
        $tmpFile = $options['file'];

        $fileName = $tmpFile->getFilename();
        $directoryName = $this->fileUtils->getActiveDirectoryName();
        $size = filesize($tmpFile);
        $mimeType = $tmpFile->getMimeType();
        $extension = pathinfo($fileName, PATHINFO_EXTENSION);
        $hashName = Uuid::uuid4()->toString().'.'.$extension;
        $prefix = 'data'.DIRECTORY_SEPARATOR.$directoryName;
        $url = $prefix.DIRECTORY_SEPARATOR.$hashName;

        $publicFile->setDirectoryName($directoryName);
        $publicFile->setFilename($fileName);
        $publicFile->setSize($size);
        $publicFile->setMimeType($mimeType);
        $publicFile->setCreationDate(new \DateTime());
        $publicFile->setUrl($url);

        if ($this->tokenStorage->getToken() && $user = $this->tokenStorage->getToken()->getUser() !== 'anon.') {
            $user = $this->tokenStorage->getToken()->getUser();
            $publicFile->setCreator($user);
        }

        $tmpFile->move($this->filesDir.DIRECTORY_SEPARATOR.$prefix, $hashName);
    }
}
