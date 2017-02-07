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

use Claroline\CoreBundle\Entity\Icon\IconItem;
use Claroline\CoreBundle\Entity\Icon\IconSet;
use Claroline\CoreBundle\Entity\Icon\IconSetTypeEnum;
use Claroline\CoreBundle\Entity\Resource\ResourceIcon;
use Claroline\CoreBundle\Library\Icon\ResourceIconItemFilenameList;
use Claroline\CoreBundle\Library\Icon\ResourceIconSetIconItemList;
use Claroline\CoreBundle\Library\Utilities\FileSystem;
use Claroline\CoreBundle\Library\Utilities\ThumbnailCreator;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Repository\Icon\IconItemRepository;
use Claroline\CoreBundle\Repository\Icon\IconSetRepository;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

/**
 * @DI\Service("claroline.manager.icon_set_manager")
 */
class IconSetManager
{
    /** @var string */
    private $rootDir;
    /** @var ObjectManager */
    private $om;
    /** @var IconSetRepository */
    private $iconSetRepo;
    /** @var IconItemRepository */
    private $iconItemRepo;
    /** @var string */
    private $iconSetsDir;
    /** @var FileSystem */
    private $fs;
    /** @var ThumbnailCreator */
    private $thumbnailCreator;

    /**
     * @DI\InjectParams({
     *     "rootDir"            = @DI\Inject("%kernel.root_dir%"),
     *     "om"                 = @DI\Inject("claroline.persistence.object_manager"),
     *     "thumbnailCreator"   = @DI\Inject("claroline.utilities.thumbnail_creator")
     * })
     *
     * @param $rootDir
     * @param ObjectManager    $om
     * @param ThumbnailCreator $thumbnailCreator
     */
    public function __construct(
        $rootDir,
        ObjectManager $om,
        ThumbnailCreator $thumbnailCreator
    ) {
        $this->fs = new FileSystem();
        $this->rootDir = $rootDir;
        $this->thumbnailCreator = $thumbnailCreator;
        $this->om = $om;
        $this->iconSetRepo = $om->getRepository('ClarolineCoreBundle:Icon\IconSet');
        $this->iconItemRepo = $om->getRepository('ClarolineCoreBundle:Icon\IconItem');
        $this->iconSetsDir = $rootDir.'/../web/icon_sets';
        $this->createIconSetsDirIfNotExists();
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
        if ($iconSet !== null) {
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
        if ($id === null) {
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
        if ($iconSetId !== null) {
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
     * @param ResourceIcon $icon
     * @param ResourceIcon $shortcutIcon
     */
    public function addOrUpdateIconItemToDefaultResourceIconSet(ResourceIcon $icon, ResourceIcon $shortcutIcon)
    {
        $resourceIconSet = $this->getDefaultResourceIconSet();
        $existingIcons = $this->getIconItemsByIconSetAndMimeType($resourceIconSet, $icon->getMimeType());
        if (empty($existingIcons) || count($existingIcons) < 1) {
            $this->createIconItemWithShortcutForResourceIconSet(
                $resourceIconSet,
                $icon->getRelativeUrl(),
                $shortcutIcon->getRelativeUrl(),
                $icon,
                $shortcutIcon
            );
        } else {
            foreach ($existingIcons as $existingIcon) {
                if ($existingIcon->getIsShortcut()) {
                    $existingIcon->setRelativeUrl($shortcutIcon->getRelativeUrl());
                    $existingIcon->setResourceIcon($shortcutIcon);
                } else {
                    $existingIcon->setRelativeUrl($icon->getRelativeUrl());
                    $existingIcon->setResourceIcon($icon);
                }
                $this->om->persist($existingIcon);
            }
            // Update resource icons for all other existing icon sets
            $this->iconItemRepo->updateResourceIconForAllSets($icon);
            $this->iconItemRepo->updateResourceIconForAllSets($shortcutIcon);
        }
    }

    public function getActiveResourceIconSet()
    {
        return $this->iconSetRepo->findOneBy(['active' => true, 'type' => IconSetTypeEnum::RESOURCE_ICON_SET]);
    }

    public function getResourceIconSetStampIcon(IconSet $iconSet = null)
    {
        if ($iconSet === null) {
            $iconSet = new IconSet();
        }
        if (!empty($iconSet->getResourceStampIcon())) {
            $iconRelativeUrl = $iconSet->getResourceStampIcon();
        } else {
            $iconRelativeUrl = $this->thumbnailCreator->getDefaultStampRelativeUrl();
        }

        return new IconItem($iconSet, $iconRelativeUrl, 'shortcut', 'shortcut');
    }

    public function setActiveResourceIconSetByCname($cname)
    {
        // Get active Icon Set
        $activeSet = $this->getActiveResourceIconSet();
        if ($activeSet->getCname() === $cname) {
            return true;
        }
        $newActiveSet = $this->getIconSetByCName($cname);
        if (empty($newActiveSet)) {
            return true;
        }

        // Set all ResourceIcons to default set's icons (this way we make sure that even if some icons
        // don't exist in this set they will be replaced by default icons and not by last active theme's icons)
        if (!$newActiveSet->isDefault() || !$newActiveSet->getCname() === 'claroline') {
            $this->iconItemRepo->updateResourceIconsByIconSetIcons($this->getDefaultResourceIconSet());
        }
        // Then update with new set icons
        $this->iconItemRepo->updateResourceIconsByIconSetIcons($newActiveSet);
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
        $iconSetDir = $this->iconSetsDir.DIRECTORY_SEPARATOR.$iconSet->getCname();
        $iconNamesForTypes = $this->getResourceIconSetIconNamesForMimeTypes($iconSet->getId());
        // On shortcut stamp remove, then delete it from icon set and regenerate shortcut thumbnails for all the
        // icons on the set using default icon
        if ($filename === 'shortcut') {
            $this->fs->remove($this->getAbsolutePathForResourceIcon($iconSet->getResourceStampIcon()));
            $iconSet->setResourceStampIcon(null);
            $this->regenerateShortcutForIcons($iconNamesForTypes, $iconSetDir, null);

            return $this->thumbnailCreator->getDefaultStampRelativeUrl();
        }
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
            $shortcutIcon = $iconNamesForTypes->getShortcutByMimeType($mimeType);
            $this->om->remove($icon);
            $this->om->remove($shortcutIcon);
        }
        $this->om->flush();
        //If iconset is active icon set, restore resource icons to default values
        if ($iconSet->isActive()) {
            // Restore default icons for these mimetypes
            $this->iconItemRepo->updateResourceIconsByIconSetIcons(null, $mimeTypes);
        }
        // Remove both icon and shortcut icon from icon set folder
        $this->fs->remove([
            $this->getAbsolutePathForResourceIcon($iconItemFilename->getRelativeUrl()),
            $this->getAbsolutePathForResourceIcon(
                $this->getShortcutIconPathFromIconItemPath($iconItemFilename->getRelativeUrl())
            ),
        ]);
        // Default icon relative path
        $defaultIcon = $this->iconItemRepo
            ->findIconsForResourceIconSetByMimeTypes(null, null, [$mimeTypes[0]], false)[0];
        if (!empty($defaultIcon)) {
            $newIconRelativeUrl = $defaultIcon->getRelativeUrl();
        }

        return $newIconRelativeUrl;
    }

    public function uploadNewResourceIconSetIconByFilename(IconSet $iconSet, UploadedFile $newFile, $filename)
    {
        if ($iconSet->isDefault()) {
            throw new BadRequestHttpException('error_cannot_update_default_icon_set_icon');
        }
        $iconSetDir = $this->iconSetsDir.DIRECTORY_SEPARATOR.$iconSet->getCname();
        // Upload file and create shortcut
        $newIconFilename = $filename.'.'.$newFile->getClientOriginalExtension();
        $newFile->move(
            $iconSetDir,
            $newIconFilename
        );
        $newIconPath = $iconSetDir.DIRECTORY_SEPARATOR.$newIconFilename;
        $iconItemFilenameList = $this->getResourceIconSetIconNamesForMimeTypes($iconSet->getId());
        // If submitted icon is stamp icon, then set new stamp icon to icon set and regenerate all thumbnails
        if ($filename === 'shortcut') {
            $relativeStampIcon = $this->getRelativePathForResourceIcon($newIconPath);
            $iconSet->setResourceStampIcon($relativeStampIcon);
            $this->om->persist($iconSet);
            $this->regenerateShortcutForIcons($iconItemFilenameList, $iconSetDir, $relativeStampIcon);
            $this->om->flush();

            return $relativeStampIcon;
        }
        $newShortcutIconPath = $this->thumbnailCreator->shortcutThumbnail(
            $newIconPath,
            null,
            $this->getAbsolutePathForResourceIcon($iconSet->getResourceStampIcon()),
            $iconSetDir,
            $this->getShortcutIconFilenameFromIconItemFilename($newIconFilename)
        );
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
            $shortcutIcon = $iconItemFilenameList->getShortcutByMimeType($type);
            if (!$alreadyInSet) {
                $resourceIcon = $icon->getResourceIcon();
                $shortcutResourceIcon = $shortcutIcon->getResourceIcon();
                $this->createIconItemWithShortcutForResourceIconSet(
                    $iconSet,
                    $this->getRelativePathForResourceIcon($newIconPath),
                    $this->getRelativePathForResourceIcon($newShortcutIconPath),
                    $resourceIcon,
                    $shortcutResourceIcon
                );
            } else {
                $this->updateIconItemWithShortcutForResourceIconSet(
                    $iconSet,
                    $this->getRelativePathForResourceIcon($newIconPath),
                    $this->getRelativePathForResourceIcon($newShortcutIconPath),
                    $icon,
                    $shortcutIcon
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

    private function createIconSetsDirIfNotExists()
    {
        if (!$this->fs->exists($this->iconSetsDir)) {
            $this->fs->mkdir($this->iconSetsDir, 0775);
        }
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
    private function extractResourceIconSetZipAndReturnNewIconItems(IconSet $iconSet, ResourceIconSetIconItemList $iconSetIconItemList)
    {
        $ds = DIRECTORY_SEPARATOR;
        $zipFile = $iconSet->getIconsZipfile();
        $cname = $iconSet->getCname();
        $iconSetDir = $this->iconSetsDir.$ds.$cname;
        if (!empty($zipFile)) {
            $zipArchive = new \ZipArchive();
            if ($zipArchive->open($zipFile) === true) {
                //Test to see if a resource stamp icon is present in zip file
                $resourceStamp = $this->extractResourceStampIconFromZip($zipArchive, $iconSetDir);
                if (!empty($resourceStamp)) {
                    $iconSet->setResourceStampIcon($resourceStamp);
                    $this->om->persist($iconSet);
                    if (!$iconSetIconItemList->getSetIcons()->isEmpty()) {
                        $this->regenerateShortcutForIcons(
                            $iconSetIconItemList->getSetIcons(),
                            $iconSetDir,
                            $resourceStamp
                        );
                    }
                }
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
                        $shortcutIconName = $this->getShortcutIconFilenameFromIconItemFilename($fileinfo['basename']);
                        $shortcutIconPath = $this->thumbnailCreator->shortcutThumbnail(
                            $iconPath,
                            null,
                            $this->getAbsolutePathForResourceIcon($iconSet->getResourceStampIcon()),
                            $iconSetDir,
                            $shortcutIconName
                        );

                        foreach ($iconNameTypes->getMimeTypes() as $type) {
                            // If icon don't exist, create it, otherwise update it's url in case of extension change
                            $icon = $iconItemFilenameList->getIconByMimeType($type);
                            $shortcutIcon = $iconItemFilenameList->getShortcutByMimeType($type);
                            if (!$alreadyInSet) {
                                $resourceIcon = $icon->getResourceIcon();
                                $shortcutResourceIcon = $shortcutIcon->getResourceIcon();
                                $this->createIconItemWithShortcutForResourceIconSet(
                                    $iconSet,
                                    $this->getRelativePathForResourceIcon($iconPath),
                                    $this->getRelativePathForResourceIcon($shortcutIconPath),
                                    $resourceIcon,
                                    $shortcutResourceIcon
                                );
                            } else {
                                $this->updateIconItemWithShortcutForResourceIconSet(
                                    $iconSet,
                                    $this->getRelativePathForResourceIcon($iconPath),
                                    $this->getRelativePathForResourceIcon($shortcutIconPath),
                                    $icon,
                                    $shortcutIcon
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

        return str_replace($this->iconSetsDir, 'icon_sets', $absolutePath);
    }

    private function getAbsolutePathForResourceIcon($relativePath)
    {
        if (empty($relativePath)) {
            return null;
        }

        return str_replace('icon_sets', $this->iconSetsDir, $relativePath);
    }

    private function getShortcutIconPathFromIconItemPath($iconItemPath)
    {
        $fileinfo = pathinfo($iconItemPath);
        $ds = DIRECTORY_SEPARATOR;
        $dirPath = !empty($fileinfo['dirname']) ? $fileinfo['dirname'].$ds : '';

        return $dirPath.$fileinfo['filename'].'_shortcut_icon.'.$fileinfo['extension'];
    }

    private function getShortcutIconFilenameFromIconItemFilename($iconItemFilename)
    {
        $fileinfo = pathinfo($iconItemFilename);

        return $fileinfo['filename'].'_shortcut_icon';
    }

    /**
     * @param IconSet $iconSet
     * @param $iconPath
     * @param $shortcutIconPath
     * @param ResourceIcon $icon
     * @param ResourceIcon $shortcutIcon
     *
     * @return array
     */
    private function createIconItemWithShortcutForResourceIconSet(
        IconSet $iconSet,
        $iconPath,
        $shortcutIconPath,
        ResourceIcon $icon,
        ResourceIcon $shortcutIcon
    ) {
        $iconItem = new IconItem(
            $iconSet,
            $iconPath,
            null,
            $icon->getMimeType(),
            null,
            false,
            $icon
        );
        $shortcutIconItem = new IconItem(
            $iconSet,
            $shortcutIconPath,
            null,
            $shortcutIcon->getMimeType(),
            null,
            true,
            $shortcutIcon
        );
        $this->om->persist($iconItem);
        $this->om->persist($shortcutIconItem);
        if ($iconSet->isActive() && !$iconSet->isDefault()) {
            $icon->setRelativeUrl($iconPath);
            $shortcutIcon->setRelativeUrl($shortcutIconPath);
            $this->om->persist($icon);
            $this->om->persist($shortcutIcon);
        }
    }

    /**
     * @param IconSet $iconSet
     * @param $iconPath
     * @param $shortcutIconPath
     * @param IconItem $icon
     * @param IconItem $shortcutIcon
     */
    private function updateIconItemWithShortcutForResourceIconSet(
        IconSet $iconSet,
        $iconPath,
        $shortcutIconPath,
        IconItem $icon,
        IconItem $shortcutIcon
    ) {
        $icon->setRelativeUrl($iconPath);
        $shortcutIcon->setRelativeUrl($shortcutIconPath);
        $this->om->persist($icon);
        $this->om->persist($shortcutIcon);
        if ($iconSet->isActive()) {
            $resourceIcon = $icon->getResourceIcon();
            $resourceShortcutIcon = $shortcutIcon->getResourceIcon();
            $resourceIcon->setRelativeUrl($iconPath);
            $resourceShortcutIcon->setRelativeUrl($shortcutIconPath);
            $this->om->persist($resourceIcon);
            $this->om->persist($resourceShortcutIcon);
        }
    }

    private function extractResourceStampIconFromZip(\ZipArchive $zip, $iconSetDir)
    {
        for ($i = 0; $i < $zip->numFiles; ++$i) {
            $file = $zip->getNameIndex($i);
            $fileinfo = pathinfo($file);
            $filename = $fileinfo['filename'];
            if ($filename === 'shortcut') {
                $zip->extractTo($iconSetDir, [$file]);

                return $this->getRelativePathForResourceIcon($iconSetDir.DIRECTORY_SEPARATOR.$fileinfo['basename']);
            }
        }

        return null;
    }

    private function regenerateShortcutForIcons(ResourceIconItemFilenameList $icons, $iconSetDir, $resourceStampIcon)
    {
        foreach ($icons->getAllIcons() as $listIcon) {
            $iconPath = $listIcon->getRelativeUrl();
            $fileinfo = pathinfo($iconPath);
            $shortcutIconName = $this->getShortcutIconFilenameFromIconItemFilename($fileinfo['basename']);
            $this->thumbnailCreator->shortcutThumbnail(
                $iconSetDir.DIRECTORY_SEPARATOR.$fileinfo['basename'],
                null,
                $this->getAbsolutePathForResourceIcon($resourceStampIcon),
                $iconSetDir,
                $shortcutIconName
            );
        }
    }
}
