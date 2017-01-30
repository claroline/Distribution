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
use Claroline\CoreBundle\Library\Icon\IconItemsByTypeList;
use Claroline\CoreBundle\Library\Icon\IconSetIconsList;
use Claroline\CoreBundle\Library\Utilities\FileSystem;
use Claroline\CoreBundle\Library\Utilities\ThumbnailCreator;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Repository\Icon\IconItemRepository;
use Claroline\CoreBundle\Repository\Icon\IconSetRepository;
use JMS\DiExtraBundle\Annotation as DI;
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
     * @return IconSetIconsList
     */
    public function getIconSetIconsByType(IconSet $iconSet = null, $includeDefault = true)
    {
        $iconSetIconsList = new IconSetIconsList();
        if ($iconSet !== null) {
            $iconSetIcons = $iconSet->getIcons()->toArray();
            $iconSetIconsList->addSetIcons($iconSetIcons);
        }
        if ($includeDefault) {
            $defaultSetIcons = $this->iconItemRepo->findIconsForDefaultResourceIconSet(
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
     * @return IconItemsByTypeList
     */
    public function getResourceIconSetIconNamesForMimeTypes($iconSetId = null)
    {
        if ($iconSetId !== null) {
            $icons = $this->iconItemRepo->findByIconSet($iconSetId);
        } else {
            $icons = $this->iconItemRepo->findIconsForDefaultResourceIconSet();
        }

        return new IconItemsByTypeList($icons);
    }

    /**
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
        $iconItems = $this->extractResourceIconSetZipAndReturnNewIconItems($iconSet, $iconNamesForType);
        $this->om->flush();
        $iconSet->setIcons($iconItems);

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
                $icon->getMimeType(),
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
     * @param $iconSetIconsList
     *
     * @return array
     */
    private function extractResourceIconSetZipAndReturnNewIconItems(IconSet $iconSet, IconSetIconsList $iconSetIconsList)
    {
        $ds = DIRECTORY_SEPARATOR;
        $zipFile = $iconSet->getIconsZipfile();
        $cname = $iconSet->getCname();
        $iconSetDir = $this->iconSetsDir.$ds.$cname;
        $iconItems = [];
        if (!empty($zipFile)) {
            $zipArchive = new \ZipArchive();
            if ($zipArchive->open($zipFile) === true) {
                //List filenames and extract all files without subfolders
                for ($i = 0; $i < $zipArchive->numFiles; ++$i) {
                    $file = $zipArchive->getNameIndex($i);
                    $fileinfo = pathinfo($file);
                    $filename = $fileinfo['filename'];
                    //If file associated with one of mimeTypes then extract it. Otherwise don't
                    $alreadyInSet = $iconSetIconsList->isInSetIcons($filename);
                    $iconNameTypes = $alreadyInSet ?
                        $iconSetIconsList->getFromSetIconsByKey($filename) :
                        $iconSetIconsList->getFromDefaultIconsByKey($filename);
                    if (!empty($iconNameTypes)) {
                        $iconPath = $iconSetDir.$ds.$fileinfo['basename'];
                        $shortcutIconName = $filename.'_shortcut_icon.'.$fileinfo['extension'];
                        $this->fs->remove($iconSetDir.DIRECTORY_SEPARATOR.$fileinfo['basename']);
                        $zipArchive->extractTo($iconSetDir, [$file]);
                        $shortcutIconPath = $this->thumbnailCreator->shortcutThumbnail(
                            $iconPath,
                            null,
                            null,
                            $iconSetDir,
                            $shortcutIconName
                        );
                        if (!$alreadyInSet) {
                            foreach ($iconNameTypes->getMimeTypes() as $type) {
                                $resourceIcon = $iconSetIconsList
                                    ->getDefaultIcons()
                                    ->getIconByMimeType($type)
                                    ->getResourceIcon();
                                $shortcutResourceIcon = $iconSetIconsList
                                    ->getDefaultIcons()
                                    ->getShortcutByMimeType($type)
                                    ->getResourceIcon();
                                $newIcons = $this->createIconItemWithShortcutForResourceIconSet(
                                    $iconSet,
                                    $type,
                                    $this->getRelativePathForResourceIcon($iconPath),
                                    $this->getRelativePathForResourceIcon($shortcutIconPath),
                                    $resourceIcon,
                                    $shortcutResourceIcon
                                );

                                $iconItems = array_merge($iconItems, $newIcons);
                            }
                        }
                    }
                }
                $zipArchive->close();
            }
        }

        return $iconItems;
    }

    /**
     * @param $absolutePath
     *
     * @return mixed
     */
    private function getRelativePathForResourceIcon($absolutePath)
    {
        return str_replace($this->iconSetsDir, 'icon_sets', $absolutePath);
    }

    /**
     * @param IconSet $iconSet
     * @param $mimeType
     * @param $iconPath
     * @param $shortcutIconPath
     *
     * @return array
     */
    private function createIconItemWithShortcutForResourceIconSet(
        IconSet $iconSet,
        $mimeType,
        $iconPath,
        $shortcutIconPath,
        ResourceIcon $icon,
        ResourceIcon $shortcutIcon
    ) {
        $iconItem = new IconItem(
            $iconSet,
            $iconPath,
            null,
            $mimeType,
            null,
            false,
            $icon
        );
        $this->om->persist($iconItem);
        $shortcutIconItem = new IconItem(
            $iconSet,
            $shortcutIconPath,
            null,
            $mimeType,
            null,
            true,
            $shortcutIcon
        );
        $this->om->persist($shortcutIconItem);

        return [$iconItem, $shortcutIconItem];
    }
}
