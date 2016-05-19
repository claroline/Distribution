<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\VideoPlayerBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Claroline\CoreBundle\Entity\Resource\File;
use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use JMS\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass="Claroline\VideoPlayerBundle\Repository\TrackRepository")
 * @ORM\Table(name="claro_video_track")
 */
class Track extends AbstractResource
{
    /**
     * @ORM\Column(name="hash_name", unique=true)
     * @Groups({"api_video"})
     */
    protected $hashName;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Claroline\CoreBundle\Entity\Resource\File"
     * )
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    protected $video;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Claroline\CoreBundle\Entity\Resource\File"
     * )
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    protected $trackFile;

    /**
     * @ORM\Column(name="lang", nullable=true)
     * @Groups({"api_video"})
     */
    protected $lang = 'en';

    /**
     * @ORM\Column(name="kind", nullable=false)
     * @Groups({"api_video"})
     */
    protected $kind = 'subtitles';

    /**
     * @ORM\Column(name="is_default", nullable=false)
     * @Groups({"api_video"})
     */
    protected $isDefault = false;

    public function getHashName()
    {
        return $this->hashName;
    }

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

    public function setLang($lang)
    {
        $this->lang = $lang;
    }

    public function getLang()
    {
        return $this->lang;
    }

    public function setKind($kind)
    {
        $this->kind = $kind;
    }

    public function getKind()
    {
        return $this->kind;
    }

    public function setIsDefault($isDefault)
    {
        $this->isDefault = $isDefault;
    }

    public function isDefault()
    {
        return $this->isDefault;
    }

    public function setTrackFile(File $trackFile)
    {
        $this->trackFile = $trackFile;
    }

    public function getTrackFile()
    {
        return $this->trackFile;
    }
}
