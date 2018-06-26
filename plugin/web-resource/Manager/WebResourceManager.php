<?php


/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\WebResourceBundle\Manager;

use Claroline\CoreBundle\Entity\Resource\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use JMS\DiExtraBundle\Annotation as DI;
use Claroline\AppBundle\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Finder\Iterator\RecursiveDirectoryIterator;

/**
 * @DI\Service("claroline.manager.web_resource_manager")
 */
class WebResourceManager
{
    private $om;
    private $container;
    private $webResourceResourcesPath;

    /**
     * @var \ZipArchive
     */
    private $zip;

    /**
     * Path to directory where zip files are stored.
     *
     * @var string
     */
    private $zipPath;

    /**
     * Path to directory where uploaded files are stored.
     *
     * @var string
     */
    private $filesPath;

    private $defaultIndexFiles = [
        'web/SCO_0001/default.html',
        'web/SCO_0001/default.htm',
        'web/index.html',
        'web/index.htm',
        'index.html',
        'index.htm',
        'web/SCO_0001/Default.html',
        'web/SCO_0001/Default.htm',
        'web/Index.html',
        'web/Index.htm',
        'Index.html',
        'Index.htm',
    ];

    /**
     * Constructor.
     *
     * @DI\InjectParams({
     *     "om"                  = @DI\Inject("claroline.persistence.object_manager"),
     *     "container"           = @DI\Inject("service_container")
     * })
     */
    public function __construct(
        ObjectManager $om,
        ContainerInterface $container
    ) {
        $this->om = $om;
        $this->container = $container;
        $this->filesPath = $this->container->getParameter('claroline.param.files_directory').DIRECTORY_SEPARATOR;
    }

    /**
     * Get ZipArchive object.
     *
     * @return \ZipArchive
     */
    public function getZip()
    {
        if (!$this->zip instanceof \ZipArchive) {
            $this->zip = new \ZipArchive();
        }

        return $this->zip;
    }

    /**
     * Get all HTML files from a zip archive.
     *
     * @param string $directory
     *
     * @return array
     */
    public function getHTMLFiles($directory)
    {
        $dir = new RecursiveDirectoryIterator($directory, RecursiveDirectoryIterator::SKIP_DOTS | RecursiveDirectoryIterator::NEW_CURRENT_AND_KEY);
        $files = new \RecursiveIteratorIterator($dir);

        $allowedExtensions = ['htm', 'html'];

        $list = [];
        foreach ($files as $file) {
            if (in_array($file->getExtension(), $allowedExtensions)) {
                // HTML File found
                $relativePath = str_replace($directory, '', $file->getPathname());
                $list[] = ltrim($relativePath, '\\/');
            }
        }

        return $list;
    }

    /**
     * Try to retrieve root file of the WebResource from the zip archive.
     *
     * @param Workspace $workspace
     * @param UploadedFile $file
     *
     * @return string
     *
     * @throws \Exception
     */
    public function guessRootFile(UploadedFile $file, Workspace $workspace)
    {
        $ds = DIRECTORY_SEPARATOR;
        $zipPath = $this->container->getParameter('claroline.param.uploads_directory').$ds.'webresource'.$ds.$workspace->getUuid().$ds;

        if (!$this->getZip()->open($file)) {
            throw new \Exception('Can not open archive file.');
        }

        // Try to locate usual default HTML files to avoid unzip archive and scan directory tree
        foreach ($this->defaultIndexFiles as $html) {
            if (is_numeric($this->getZip()->locateName($html))) {
                return $html;
            }
        }

        // No default index file found => scan archive
        // Extract content into tmp dir
        $tmpDir = $zipPath.'tmp/';
        if (!$tmpDir) {
            mkdir($zipPath.'tmp/', 0777, true);
        }
        $this->getZip()->extractTo($tmpDir);
        $this->getZip()->close();

        // Search for root file
        $htmlFiles = $this->getHTMLFiles($tmpDir);

        // Remove tmp data
        $this->unzipDelete($tmpDir);

        // Only one file
        if (count($htmlFiles) === 1) {
            return array_shift($htmlFiles);
        }

        return;
    }

    /**
     * Try to retrieve root file of the WebResource from the unzipped directory.
     *
     * @param string $hash
     *
     * @return string
     */
    public function guessRootFileFromUnzipped($hash)
    {
        // Grab all HTML files from Archive
        $htmlFiles = $this->getHTMLFiles($hash);

        // Only one file
        if (count($htmlFiles) === 1) {
            return array_shift($htmlFiles);
        }

        // Check usual default root files
        foreach ($this->defaultIndexFiles as $file) {
            if (in_array($file, $htmlFiles)) {
                return $file;
            }
        }

        // Unable to find an unique HTML file
        return;
    }


    /**
     * Deletes web resource unzipped files.
     *
     * @param string $dir The path to the directory to delete
     */
    public function unzipDelete($dir)
    {
        foreach (glob($dir.'/*') as $file) {
            if (is_dir($file)) {
                $this->unzipDelete($file);
            } else {
                unlink($file);
            }
        }

        rmdir($dir);
    }


    /**
     * Checks if a UploadedFile is a zip and contains index.html file.
     *
     * @param \Symfony\Component\HttpFoundation\File\UploadedFile $file
     *
     * @return bool
     */
    public function isZip(UploadedFile $file, $workspace)
    {
        $isZip = false;
        if ($file->getClientMimeType() === 'application/zip' || $this->getZip()->open($file) === true) {
            // Correct Zip type => check if html root file exists
            $rootFile = $this->guessRootFile($file, $workspace);

            if (!empty($rootFile)) {
                $isZip = true;
            }
        }

        return $isZip;
    }

    /**
     * Unzips files in web directory.
     *
     * Use first $this->getZip()->open($file) or $this->isZip($file)
     *
     * @param Workspace $workspace
     *
     * @param string $hash The hash name of the resource
     */
    public function unzip($hash,  Workspace $workspace)
    {
        $ds = DIRECTORY_SEPARATOR;
        $zipPath = $this->container->getParameter('claroline.param.uploads_directory').$ds.'webresource'.$ds.$workspace->getUuid().$ds;
        if (!file_exists($zipPath.$hash)) {
            mkdir($zipPath.$hash, 0777, true);
        }
        $this->getZip()->open($this->filesPath.$hash);
        $this->getZip()->extractTo($zipPath.$hash);
        $this->getZip()->close();
    }

    /**
     * Unzip a given ZIP file into the web resources directory.
     *
     * @param UploadedFile $file
     * @param $hashName name of the destination directory
     */
    public function unzipWebResourceArchive(\SplFileInfo $file, $hashName, $workspace)
    {
        $ds = DIRECTORY_SEPARATOR;
        $webResourceResourcesPath = $this->container->getParameter('claroline.param.uploads_directory').$ds.'webresource'.$ds.$workspace->getUuid().$ds;
        $zip = new \ZipArchive();
        $zip->open($file);
        $destinationDir = $webResourceResourcesPath.$hashName;
        if (!file_exists($destinationDir)) {
            mkdir($destinationDir, 0777, true);
        }
        $zip->extractTo($destinationDir);
        $zip->close();
    }
    /**
     * Returns a new hash for a file.
     *
     * @param mixed mixed The extension of the file or an Claroline\CoreBundle\Entity\Resource\File
     *
     * @return string
     */
    private function getHash($mixed)
    {
        if ($mixed instanceof File) {
            $mixed = pathinfo($mixed->getHashName(), PATHINFO_EXTENSION);
        }

        return $this->container->get('claroline.utilities.misc')->generateGuid().'.'.$mixed;
    }

    public function create(UploadedFile $tmpFile, Workspace $workspace)
    {
        $file = new File();
        $fileName = $tmpFile->getClientOriginalName();
        $hash = $this->getHash(pathinfo($fileName, PATHINFO_EXTENSION));
        $size = filesize($tmpFile);
        $file->setSize($size);
        $file->setName($fileName);
        $file->setHashName($hash);
        $file->setMimeType('custom/claroline_web_resource');
        $tmpFile->move($this->filesPath, $hash);
        $this->unzip($hash, $workspace);

        return [
          'hashName' => $hash,
          'size' => $size
        ];
    }
  }
