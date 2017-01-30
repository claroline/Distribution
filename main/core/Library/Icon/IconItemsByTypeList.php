<?php

/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Date: 1/25/17
 */

namespace Claroline\CoreBundle\Library\Icon;

use Claroline\CoreBundle\Entity\Icon\IconItem;

class IconItemsByTypeList
{
    /**
     * Icons refering to resource types.
     *
     * @var array
     */
    private $resourceIcons = [];

    /**
     * Icons refering to file types.
     *
     * @var array
     */
    private $fileIcons = [];

    /**
     * Icons all icons regardless their reference to resource of files.
     *
     * @var array
     */
    private $allIcons = [];

    /**
     * Array of all mimeTypes present in the list.
     *
     * @var array
     */
    private $mimeTypes = [];

    /**
     * Array of all shortcut icons in the list by original mimeType.
     */
    private $shortcuts = [];

    /**
     * Array of all icons in the list by original mimeType.
     */
    private $icons = [];

    public function __construct($icons = null)
    {
        $this->addIcons($icons);
    }

    public function addIcons($icons)
    {
        if (!empty($icons)) {
            foreach ($icons as $icon) {
                $this->addIcon($icon);
            }
        }
    }

    public function addIcon(IconItem $icon)
    {
        $mimeType = $icon->getMimeType();
        if ($icon->getIsShortcut()) {
            //Check if icon is shortcut, if so put it in shortcuts array
            $this->shortcuts[$mimeType] = $icon;
        } else {
            //Otherwise put it in resourceIcons or fileIcons array and also in allIcons array
            $this->mimeTypes[] = $mimeType;
            $this->icons[$mimeType] = $icon;
            // Check if is resource icon
            if (strpos($mimeType, 'custom/') !== false) {
                // For every resoruce, give option for a different icon
                $filename = str_replace('custom/', '', $mimeType);
                $this->resourceIcons[$filename] = $this->allIcons[$filename] = new IconItemForList(
                    $filename,
                    $icon->getRelativeUrl(),
                    [$mimeType]
                );
            } else {
                // For all filetypes represented by the same icon, give only one option
                $filename = pathinfo($icon->getRelativeUrl(), PATHINFO_FILENAME);
                if (array_key_exists($filename, $this->fileIcons)) {
                    $this->fileIcons[$filename]->addMimeType($mimeType);
                } else {
                    $this->fileIcons[$filename] = $this->allIcons[$filename] = new IconItemForList(
                        $filename,
                        $icon->getRelativeUrl(),
                        [$mimeType]
                    );
                }
            }
        }
    }

    /**
     * @return array
     */
    public function getResourceIcons()
    {
        return $this->resourceIcons;
    }

    /**
     * @return array
     */
    public function getFileIcons()
    {
        return $this->fileIcons;
    }

    /**
     * @return array
     */
    public function getAllIcons()
    {
        return $this->allIcons;
    }

    /**
     * @return array
     */
    public function getMimeTypes()
    {
        return $this->mimeTypes;
    }

    /**
     * @return mixed
     */
    public function getShortcuts()
    {
        return $this->shortcuts;
    }

    public function isEmpty()
    {
        return empty($this->allIcons);
    }

    public function isInList($key)
    {
        return array_key_exists($key, $this->allIcons);
    }

    public function isInResourceIcons($key)
    {
        return array_key_exists($key, $this->resourceIcons);
    }

    public function isInFileIcons($key)
    {
        return array_key_exists($key, $this->fileIcons);
    }

    public function getItemByKey($key)
    {
        if ($this->isInList($key)) {
            return $this->allIcons[$key];
        }

        return null;
    }

    /**
     * @param $mimeType
     *
     * @return IconItem | null
     */
    public function getShortcutByMimeType($mimeType)
    {
        return array_key_exists($mimeType, $this->shortcuts) ? $this->shortcuts[$mimeType] : null;
    }

    /**
     * @param $mimeType
     *
     * @return IconItem | null
     */
    public function getIconByMimeType($mimeType)
    {
        return array_key_exists($mimeType, $this->icons) ? $this->icons[$mimeType] : null;
    }

    public function prependShortcutIcon(IconItem $icon)
    {
        array_unshift($this->resourceIcons, $icon);
    }
}
