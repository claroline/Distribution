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

use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * @DI\Service("claroline.manager.web_resource_manager")
 */
class WebResourceManager
{
    private $om;
    private $container;
    private $webResourceResourcesPath;

    /**
     * Constructor.
     *
     * @DI\InjectParams({
     *     "om"                  = @DI\Inject("claroline.persistence.object_manager"),
     *     "container"           = @DI\Inject("service_container"),
     * })
     */
    public function __construct(
        ObjectManager $om,
        ContainerInterface $container
    ) {
        $this->om = $om;
        $this->container = $container;
        $this->webResourceResourcesPath = $this->container->getParameter('claroline.param.uploads_directory').'/webresource/';
        $this->filePath = $this->container->getParameter('claroline.param.files_directory').DIRECTORY_SEPARATOR;
    }

    /**
     * Checks if a UploadedFile is a zip and contains index.html file.
     *
     * @param \Symfony\Component\HttpFoundation\File\UploadedFile $file
     *
     * @return bool
     */
    private function isZip(UploadedFile $file)
    {
        $isZip = false;
        if ($file->getClientMimeType() === 'application/zip' || $this->getZip()->open($file) === true) {
            // Correct Zip type => check if html root file exists
            $rootFile = $this->guessRootFile($file);

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
     * @param string $hash The hash name of the resource
     */
    private function unzip($hash)
    {
        if (!file_exists($this->zipPath.$hash)) {
            mkdir($this->zipPath.$hash, 0777, true);
        }
        $this->getZip()->open($this->filesPath.$hash);
        $this->getZip()->extractTo($this->zipPath.$hash);
        $this->getZip()->close();
    }
    
    /**
     * Unzip a given ZIP file into the web resources directory.
     *
     * @param UploadedFile $file
     * @param $hashName name of the destination directory
     */
    private function unzipWebResourceArchive(\SplFileInfo $file, $hashName)
    {
        $zip = new \ZipArchive();
        $zip->open($file);
        $destinationDir = $this->webResourceResourcesPath.$hashName;
        if (!file_exists($destinationDir)) {
            mkdir($destinationDir, 0777, true);
        }
        $zip->extractTo($destinationDir);
        $zip->close();
    }
  }
