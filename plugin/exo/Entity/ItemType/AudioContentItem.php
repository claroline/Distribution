<?php

namespace UJM\ExoBundle\Entity\ItemType;

use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\Content\Audio;

/**
 * An Audio Content item.
 *
 * @ORM\Entity
 * @ORM\Table(name="ujm_item_audio_content")
 */
class AudioContentItem extends AbstractItem
{
    /**
     * The audio of the content item.
     *
     * @ORM\ManyToOne(
     *     targetEntity="UJM\ExoBundle\Entity\Content\Audio",
     *     cascade={"persist"}
     * )
     *
     * @var Audio
     */
    private $audio;

    /**
     * Gets audio.
     *
     * @return Audio
     */
    public function getAudio()
    {
        return $this->audio;
    }

    /**
     * Sets audio.
     *
     * @param Audio $audio
     */
    public function setAudio(Audio $audio)
    {
        $this->audio = $audio;
    }
}
