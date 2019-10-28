<?php
/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Date: 1/17/17
 */

namespace Claroline\CoreBundle\Manager;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\BundleRecorder\Log\LoggableTrait;
use Claroline\CoreBundle\Entity\Icon\IconItem;
use Claroline\CoreBundle\Entity\Icon\IconSet;
use Claroline\CoreBundle\Entity\Icon\IconSetTypeEnum;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CoreBundle\Library\Icon\ResourceIconItemFilenameList;
use Claroline\CoreBundle\Library\Icon\ResourceIconSetIconItemList;
use Claroline\CoreBundle\Library\Utilities\FileSystem;
use Claroline\CoreBundle\Library\Utilities\ThumbnailCreator;
use Claroline\CoreBundle\Repository\Icon\IconItemRepository;
use Claroline\CoreBundle\Repository\Icon\IconSetRepository;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class IconSetManager
{
    use LoggableTrait;

    /** @var ObjectManager */
    private $om;
    /** @var IconSetRepository */
    private $iconSetRepo;
    /** @var IconItemRepository */
    private $iconItemRepo;
    /** @var string */
    private $iconSetsDir;
    /** @var string */
    private $iconSetsWebDir;
    /** @var string */
    private $webDir;
    /** @var FileSystem */
    private $fs;
    /** @var ThumbnailCreator */
    private $thumbnailCreator;

    /**
     * @param $webDir
     * @param $iconSetsWebDir
     * @param $iconSetsDir
     * @param ObjectManager    $om
     * @param ThumbnailCreator $thumbnailCreator
     */
    public function __construct(
        $webDir,
        $iconSetsWebDir,
        $iconSetsDir,
        ObjectManager $om,
        ThumbnailCreator $thumbnailCreator,
        PlatformConfigurationHandler $ch
    ) {
        $this->fs = new FileSystem();
        $this->thumbnailCreator = $thumbnailCreator;
        $this->om = $om;
        $this->iconSetRepo = $om->getRepository('ClarolineCoreBundle:Icon\IconSet');
        $this->iconItemRepo = $om->getRepository('ClarolineCoreBundle:Icon\IconItem');
        $this->webDir = $webDir;
        $this->iconSetsWebDir = $iconSetsWebDir;
        $this->iconSetsDir = $iconSetsDir;
        $this->ch = $ch;
    }

    /**
     * @param $iconSetType
     *
     * @return array
     */
    public function listIconSetNamesByType($iconSetType)
    {
        $iconSets = $this->listIconSetsByType($iconSetType);
        $iconSetNames = [];
        foreach ($iconSets as $iconSet) {
            $iconSetNames[$iconSet->getCname()] = $iconSet->getName();
        }

        return $iconSetNames;
    }

    /**
     * @param $iconSetType
     *
     * @return array|\Claroline\CoreBundle\Entity\Icon\IconSet[]
     */
    public function listIconSetsByType($iconSetType)
    {
        return $this->iconSetRepo->findBy(['type' => $iconSetType]);
    }

    /**
     * @return bool
     */
    public function isIconSetsDirWritable()
    {
        return $this->fs->isWritable($this->iconSetsDir);
    }

    /**
     * @param IconSet|null $iconSet
     * @param bool|true    $includeDefault
     *
     * @return ResourceIconSetIconItemList
     */
    public function getIconSetIconsByType(IconSet $iconSet = null, $includeDefault = true)
    {
        $iconSetIconsList = new ResourceIconSetIconItemList();
        if (null !== $iconSet) {
            $iconSetIcons = $iconSet->getIcons()->toArray();
            $iconSetIconsList->addSetIcons($iconSetIcons);
        }
        if ($includeDefault) {
            $defaultSetIcons = $this->iconItemRepo->findIconsForResourceIconSetByMimeTypes(
                null,
                $iconSetIconsList->getSetIcons()->getMimeTypes()
            );
            $iconSetIconsList->addDefaultIcons($defaultSetIcons);
        }

        return $iconSetIconsList;
    }

    /**
     * @param $id
     *
     * @return IconSet
     */
    public function getIconSetById($id)
    {
        if (null === $id) {
            return null;
        }

        return $this->iconSetRepo->findOneById($id);
    }

    /**
     * @param $cname
     *
     * @return IconSet | null
     */
    public function getIconSetByCName($cname)
    {
        return $this->iconSetRepo->findOneByCname($cname);
    }

    /**
     * @return IconSet
     */
    public function getDefaultResourceIconSet()
    {
        return $this->iconSetRepo->findOneBy(['cname' => 'claroline', 'default' => true]);
    }

    /**
     * @param null $iconSetId
     *
     * @return ResourceIconItemFilenameList
     */
    public function getResourceIconSetIconNamesForMimeTypes($iconSetId = null)
    {
        if (null !== $iconSetId) {
            $icons = $this->iconItemRepo->findByIconSet($iconSetId);
        } else {
            $icons = $this->iconItemRepo->findIconsForResourceIconSetByMimeTypes();
        }

        return new ResourceIconItemFilenameList($icons);
    }

    /**
     * Many mimeTypes have the same icon. Group these mime types together under the same filename.
     *
     * @param IconSet $iconSet
     * @param $mimeType
     *
     * @return array|\Claroline\CoreBundle\Entity\Icon\IconItem[]
     */
    public function getIconItemsByIconSetAndMimeType(IconSet $iconSet, $mimeType)
    {
        return $this->iconItemRepo->findBy(['iconSet' => $iconSet, 'mimeType' => $mimeType]);
    }

    /**
     * @param IconSet $iconSet
     * @param $iconNamesForType
     *
     * @return IconSet
     */
    public function createNewResourceIconSet(IconSet $iconSet, $iconNamesForType)
    {
        // Persist new Set
        $this->om->persist($iconSet);
        $this->om->flush();
        // Create icon set's folder
        $this->createIconSetDirForCname($iconSet->getCname());
        $this->extractResourceIconSetZipAndReturnNewIconItems($iconSet, $iconNamesForType);
        $this->om->flush();

        return $iconSet;
    }

    /**
     * @param IconSet $iconSet
     * @param $iconNamesForType
     *
     * @return IconSet
     */
    public function updateResourceIconSet(IconSet $iconSet, $iconNamesForType)
    {
        $this->extractResourceIconSetZipAndReturnNewIconItems($iconSet, $iconNamesForType);
        $this->om->persist($iconSet);
        $this->om->flush();

        return $iconSet;
    }

    /**
     * @deprecated
     */
    public function getActiveResourceIconSet()
    {
        return $this->iconSetRepo->findOneByName($this->ch->getParameter('display.resource_icon_set'));
    }

    public function setActiveResourceIconSetByCname($cname, $force = false)
    {
        // Get active Icon Set
        $activeSet = $this->getActiveResourceIconSet();
        if (!$force && $activeSet->getCname() === $cname) {
            return true;
        }
        $newActiveSet = $this->getIconSetByCName($cname);
        if (empty($newActiveSet)) {
            return true;
        }
        $activeSet->setActive(false);
        $newActiveSet->setActive(true);
        $this->om->persist($activeSet);
        $this->om->persist($newActiveSet);
        $this->om->flush();

        return true;
    }

    /**
     * @param IconSet $iconSet
     */
    public function deleteIconSet(IconSet $iconSet)
    {
        if ($iconSet->isActive() || $iconSet->isDefault()) {
            throw new BadRequestHttpException('error_cannot_delete_active_default_icon_set');
        }
        $cname = $iconSet->getCname();
        $this->om->remove($iconSet);
        $this->om->flush();
        $this->deleteIconSetDirForCname($cname);
    }

    public function deleteResourceIconSetIconByFilename(IconSet $iconSet, $filename)
    {
        if ($iconSet->isDefault()) {
            throw new BadRequestHttpException('error_cannot_delete_default_icon_set_icon');
        }
        $iconNamesForTypes = $this->getResourceIconSetIconNamesForMimeTypes($iconSet->getId());
        // For all the rest icons, remove them from set and restore defaults if iconset is active
        $newIconRelativeUrl = null;
        $iconItemFilename = $iconNamesForTypes->getItemByKey($filename);
        if (empty($iconItemFilename)) {
            return $newIconRelativeUrl;
        }

        $mimeTypes = $iconItemFilename->getMimeTypes();
        if (empty($mimeTypes)) {
            return $newIconRelativeUrl;
        }
        //Delete icons from icon set in database
        foreach ($mimeTypes as $mimeType) {
            $icon = $iconNamesForTypes->getIconByMimeType($mimeType);
            $this->om->remove($icon);
        }
        $this->om->flush();
        // Remove both icon and shortcut icon from icon set folder
        $this->fs->remove($this->getAbsolutePathForResourceIcon($iconItemFilename->getRelativeUrl()));
        // Default icon relative path
        $defaultIcons = $this->iconItemRepo
            ->findIconsForResourceIconSetByMimeTypes(null, null, [$mimeTypes[0]], false);

        if (!empty($defaultIcons)) {
            $newIconRelativeUrl = $defaultIcons[0]->getRelativeUrl();
        }

        return $newIconRelativeUrl;
    }

    public function uploadNewResourceIconSetIconByFilename(IconSet $iconSet, UploadedFile $newFile, $filename)
    {
        if ($iconSet->isDefault()) {
            throw new BadRequestHttpException('error_cannot_update_default_icon_set_icon');
        }
        $iconSetDir = $this->iconSetsWebDir.DIRECTORY_SEPARATOR.$iconSet->getCname();
        // Upload file and create shortcut
        $newIconFilename = $filename.'.'.$newFile->getClientOriginalExtension();
        $newFile->move(
            $iconSetDir,
            $newIconFilename
        );
        $newIconPath = $iconSetDir.DIRECTORY_SEPARATOR.$newIconFilename;
        $iconItemFilenameList = $this->getResourceIconSetIconNamesForMimeTypes($iconSet->getId());

        // Test if icon already exists in set
        $iconItemFilename = $iconItemFilenameList->getItemByKey($filename);
        $alreadyInSet = true;
        if (empty($iconItemFilename)) {
            // If icon doesn't exist in set, get it by default set
            $iconItemFilenameList = $this->getResourceIconSetIconNamesForMimeTypes();
            $iconItemFilename = $iconItemFilenameList->getItemByKey($filename);
            $alreadyInSet = false;
            if (empty($iconItemFilename)) {
                return null;
            }
        }
        foreach ($iconItemFilename->getMimeTypes() as $type) {
            // If icon don't exist, create it, otherwise update it's url in case of extension change
            $icon = $iconItemFilenameList->getIconByMimeType($type);
            if (!$alreadyInSet) {
                $this->createIconItemForResourceIconSet(
                    $iconSet,
                    $this->getRelativePathForResourceIcon($newIconPath)
                );
            } else {
                $this->updateIconItemForResourceIconSet(
                    $iconSet,
                    $this->getRelativePathForResourceIcon($newIconPath),
                    $icon
                );
            }
        }
        $this->om->flush();

        return $this->getRelativePathForResourceIcon($newIconPath);
    }

    public function deleteAllResourceIconItemsForMimeType($mimeType)
    {
        $this->iconItemRepo->deleteAllByMimeType($mimeType);
    }

    /**
     * @param $cname
     */
    private function createIconSetDirForCname($cname)
    {
        $cnameDir = $this->iconSetsDir.DIRECTORY_SEPARATOR.$cname;
        if ($this->fs->exists($cnameDir)) {
            $this->fs->rmdir($cnameDir, true);
        }
        $this->fs->mkdir($cnameDir, 0775);
    }

    /**
     * @param $cname
     */
    private function deleteIconSetDirForCname($cname)
    {
        $cnameDir = $this->iconSetsDir.DIRECTORY_SEPARATOR.$cname;
        if ($this->fs->exists($cnameDir)) {
            $this->fs->rmdir($cnameDir, true);
        }
    }

    /**
     * Extracts icons from provided zipfile into iconSet directory.
     *
     * @param IconSet $iconSet
     * @param $iconSetIconItemList
     *
     * @return array
     */
    private function extractResourceIconSetZipAndReturnNewIconItems(
        IconSet $iconSet,
        ResourceIconSetIconItemList $iconSetIconItemList
    ) {
        $ds = DIRECTORY_SEPARATOR;
        $zipFile = $iconSet->getIconsZipfile();
        $cname = $iconSet->getCname();
        $iconSetDir = $this->iconSetsWebDir.$ds.$cname;
        if (!empty($zipFile)) {
            $zipArchive = new \ZipArchive();
            if (true === $zipArchive->open($zipFile)) {
                //List filenames and extract all files without subfolders
                for ($i = 0; $i < $zipArchive->numFiles; ++$i) {
                    $file = $zipArchive->getNameIndex($i);
                    $fileinfo = pathinfo($file);
                    $filename = $fileinfo['filename'];
                    //If file associated with one of mimeTypes then extract it. Otherwise don't
                    $alreadyInSet = $iconSetIconItemList->isInSetIcons($filename);
                    $iconItemFilenameList = $alreadyInSet ?
                        $iconSetIconItemList->getSetIcons() :
                        $iconSetIconItemList->getDefaultIcons();
                    $iconNameTypes = $iconItemFilenameList->getItemByKey($filename);
                    if (!empty($iconNameTypes)) {
                        $iconPath = $iconSetDir.$ds.$fileinfo['basename'];
                        $this->fs->remove($iconSetDir.DIRECTORY_SEPARATOR.$fileinfo['basename']);
                        $zipArchive->extractTo($iconSetDir, [$file]);

                        foreach ($iconNameTypes->getMimeTypes() as $type) {
                            // If icon don't exist, create it, otherwise update it's url in case of extension change
                            $icon = $iconItemFilenameList->getIconByMimeType($type);
                            if (!$alreadyInSet) {
                                $this->createIconItemForResourceIconSet(
                                    $iconSet,
                                    $this->getRelativePathForResourceIcon($iconPath)
                                );
                            } else {
                                $this->updateIconItemForResourceIconSet(
                                    $iconSet,
                                    $this->getRelativePathForResourceIcon($iconPath),
                                    $icon
                                );
                            }
                        }
                    }
                }
                $zipArchive->close();
            }
        }
    }

    /**
     * @param $absolutePath
     *
     * @return mixed
     */
    private function getRelativePathForResourceIcon($absolutePath)
    {
        if (empty($absolutePath)) {
            return null;
        }
        $pathInfo = pathinfo($absolutePath);

        return $this->fs->makePathRelative($pathInfo['dirname'], $this->webDir).$pathInfo['basename'];
    }

    private function getAbsolutePathForResourceIcon($relativePath)
    {
        if (empty($relativePath)) {
            return null;
        }

        return $this->webDir.DIRECTORY_SEPARATOR.$relativePath;
    }

    /**
     * @param IconSet $iconSet
     * @param $iconPath
     *
     * @return array
     */
    private function createIconItemForResourceIconSet(IconSet $iconSet, $iconPath)
    {
        $iconItem = new IconItem(
            $iconSet,
            $iconPath,
            null,
            null,
            null
        );

        $this->om->persist($iconItem);
    }

    /**
     * @param IconSet $iconSet
     * @param $iconPath
     * @param IconItem $icon
     */
    private function updateIconItemForResourceIconSet(
        IconSet $iconSet,
        $iconPath,
        IconItem $icon
    ) {
        $icon->setRelativeUrl($iconPath);
        $this->om->persist($icon);
    }

    private function extractResourceStampIconFromZip(\ZipArchive $zip, $iconSetDir)
    {
        for ($i = 0; $i < $zip->numFiles; ++$i) {
            $file = $zip->getNameIndex($i);
            $fileinfo = pathinfo($file);
            $filename = $fileinfo['filename'];
            if ('shortcut' === $filename) {
                $zip->extractTo($iconSetDir, [$file]);

                return $this->getRelativePathForResourceIcon($iconSetDir.DIRECTORY_SEPARATOR.$fileinfo['basename']);
            }
        }

        return null;
    }

    public function addDefaultIconSets()
    {
        $defaultDir = __DIR__.'/../Resources/public/images/resources/defaults';
        $iterator = new \DirectoryIterator($defaultDir);

        foreach ($iterator as $archive) {
            if ($archive->isFile()) {
                $name = pathinfo($archive->getFilename(), PATHINFO_FILENAME);

                //_claroline always first item because they are the default icon set
                if ('_claroline' === $name) {
                    $name = 'claroline';
                }

                if ($this->iconSetRepo->findOneByName($name)) {
                    $iconSet = $this->iconSetRepo->findOneByName($name);
                    $new = false;
                } else {
                    $iconSet = new IconSet();
                    $iconSet->setType(IconSetTypeEnum::RESOURCE_ICON_SET);
                    $iconSet->setName($name);
                    $new = true;
                }

                if ('claroline' === $name) {
                    $iconSet->setDefault(true);
                }

                $iconSet->setIconsZipfile($archive->getPathname());
                $this->om->persist($iconSet);
                $this->om->flush();
                $iconNamesForTypes = $this->getIconSetIconsByType($iconSet);
                if ($new) {
                    $this->log('Adding new icon set: '.$name);
                    $this->createNewResourceIconSet($iconSet, $iconNamesForTypes);
                } else {
                    $this->log('Updating icon set: '.$name);
                    $this->updateResourceIconSet($iconSet, $iconNamesForTypes);
                }
            }
        }
    }

    public function setLogger(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }
}
