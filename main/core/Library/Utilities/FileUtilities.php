<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Library\Utilities;

use Claroline\CoreBundle\Entity\File\PublicFile;
use Claroline\CoreBundle\Entity\File\PublicFileUse;
use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * @DI\Service("claroline.utilities.file")
 */
class FileUtilities
{
    const MAX_FILES = 1000;

    private $claroUtils;
    private $fileSystem;
    private $om;
    private $publicFilesDir;
    private $tokenStorage;

    /**
     * @DI\InjectParams({
     *     "claroUtils"    = @DI\Inject("claroline.utilities.misc"),
     *     "publicFileDir" = @DI\Inject("%claroline.param.public_files_directory%"),
     *     "fileSystem"    = @DI\Inject("filesystem"),
     *     "om"            = @DI\Inject("claroline.persistence.object_manager"),
     *     "tokenStorage"  = @DI\Inject("security.token_storage")
     * })
     */
    public function __construct(
        ClaroUtilities $claroUtils,
        $publicFileDir,
        Filesystem $fileSystem,
        ObjectManager $om,
        TokenStorageInterface $tokenStorage
    ) {
        $this->claroUtils = $claroUtils;
        $this->fileSystem = $fileSystem;
        $this->om = $om;
        $this->publicFilesDir = $publicFileDir;
        $this->tokenStorage = $tokenStorage;
    }

    public function createFile(File $tmpFile, $objectClass = null, $objectGuid = null, $objectName = null)
    {
        $user = $this->tokenStorage->getToken()->getUser();
        $fileName = $tmpFile->getFilename();
        $directoryName = $this->getActiveDirectoryName();
        $size = filesize($tmpFile);
        $mimeType = $tmpFile->getMimeType();
        $extension = pathinfo($fileName, PATHINFO_EXTENSION);
        $hashName = $directoryName.DIRECTORY_SEPARATOR.$this->claroUtils->generateGuid().'.'.$extension;

        $this->om->startFlushSuite();
        $publicFile = new PublicFile();
        $publicFile->setDirectoryName($directoryName);
        $publicFile->setFilename($fileName);
        $publicFile->setSize($size);
        $publicFile->setMimeType($mimeType);
        $publicFile->setCreationDate(new \DateTime());
        $publicFile->setHashName($hashName);

        if ($user !== 'anon.') {
            $publicFile->setCreator($user);
        }
        $tmpFile->move($this->publicFilesDir.DIRECTORY_SEPARATOR, $hashName);
        $this->om->persist($publicFile);
        $this->createFileUse($publicFile, $objectClass, $objectGuid, $objectName);
        $this->om->endFlushSuite();

        return $publicFile;
    }

    public function createFileUse(PublicFile $publicFile, $class = null, $guid = null, $name = null)
    {
        $publicFileUse = null;

        if (!is_null($class) && !is_null($guid)) {
            $publicFileUse = new PublicFileUse();
            $publicFileUse->setPublicFile($publicFile);
            $publicFileUse->setObjectClass($class);
            $publicFileUse->setObjectGuid($guid);
            $publicFileUse->setObjectName($name);
            $this->om->persist($publicFileUse);
            $this->om->flush();
        }

        return $publicFileUse;
    }

    public function deletePublicFile(PublicFile $publicFile)
    {
        $uploadedFile = $this->publicFilesDir.DIRECTORY_SEPARATOR.$publicFile->getHashName();
        $this->om->remove($publicFile);
        $this->om->flush();
        @unlink($uploadedFile);
    }

    public function getActiveDirectoryName()
    {
        $finder = new Finder();
        $finder->directories()->in($this->publicFilesDir)->name('/^[a-zA-Z]{20}$/');
        $finder->sortByName();

        if ($finder->count() === 0) {
            $activeDirectoryName = $this->generateNextDirectoryName();
        } else {
            $i = 0;

            foreach ($finder as $dir) {
                ++$i;
                if ($i === $finder->count()) {
                    $subFinder = new Finder();
                    $subFinder->in($dir->getRealPath());
                    $dirName = $dir->getFilename();

                    if ($subFinder->count() >= self::MAX_FILES) {
                        $activeDirectoryName = $this->generateNextDirectoryName($dirName);
                    } else {
                        $activeDirectoryName = $dirName;
                    }
                }
            }
        }

        return $activeDirectoryName;
    }

    private function generateNextDirectoryName($name = null)
    {
        if (is_null($name)) {
            $next = 'AAAAAAAAAAAAAAAAAAAA';
        } else if (strtoupper($name) === 'ZZZZZZZZZZZZZZZZZZZZ') {
            $next = $name;
        } else {
            $next = ++$name;
        }
        $newDir = $this->publicFilesDir.DIRECTORY_SEPARATOR.$next;

        if (!$this->fileSystem->exists($newDir)) {
            $this->fileSystem->mkdir($newDir);
        }

        return $next;
    }
}
