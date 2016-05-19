<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Entity\Resource\Video;

use Doctrine\ORM\Mapping as ORM;
use Claroline\CoreBundle\Entity\File;

/**
 * @ORM\Entity
 * @ORM\Table(name="claro_video_subtitle")
 */
class SubTitles extends AbstractResource
{
    /**
     * @ORM\Column(name="hash_name", unique=true)
     */
    protected $hashName;

    /**
     * @ORM\Column(name="name", unique=true)
     */
    protected $name;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Claroline\CoreBundle\Entity\Resource\File"
     *     cascade={"persist"}
     * )
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    protected $video;

    /**
     * Returns the name of the file actually stored in the file directory (as
     * opposed to the file original name, which is kept in the entity name
     * attribute).
     *
     * @return string
     */
    public function getHashName()
    {
        return $this->hashName;
    }

    /**
     * Sets the name of the physical file that will be stored in the file directory.
     * To prevent file name issues (e.g. with special characters), the original
     * file should be renamed with a standard unique identifier.
     *
     * @param string $hashName
     */
    public function setHashName($hashName)
    {
        $this->hashName = $hashName;
    }

    public function setVideo(File $file)
    {
        $this->video = $file;
    }

    public function getVideo(File $file)
    {
        return $this->video;
    }
}
