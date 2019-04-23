<?php

namespace Claroline\AudioPlayerBundle\Entity\Quiz\ItemType;

use Claroline\AudioPlayerBundle\Entity\Quiz\Misc\Section;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\ItemType\AbstractItem;

/**
 * A Waveform question.
 *
 * @ORM\Entity
 * @ORM\Table(name="claro_audio_player_interaction_waveform")
 */
class WaveformQuestion extends AbstractItem
{
    /**
     * @ORM\Column(name="url", type="string")
     */
    private $url;

    /**
     * @ORM\OneToMany(
     *     targetEntity="Claroline\AudioPlayerBundle\Entity\Quiz\Misc\Section",
     *     mappedBy="waveform"
     * )
     */
    protected $sections;

    /**
     * WaveformQuestion constructor.
     */
    public function __construct()
    {
        $this->sections = new ArrayCollection();
    }

    public function getUrl()
    {
        return $this->url;
    }

    public function setUrl($url)
    {
        $this->url = $url;
    }

    public function getSections()
    {
        return $this->sections;
    }

    public function addSection(Section $section)
    {
        if (!$this->sections->contains($section)) {
            $this->sections->add($section);
        }

        return $this;
    }

    public function removeSection(Section $section)
    {
        if ($this->sections->contains($section)) {
            $this->sections->removeElement($section);
        }

        return $this;
    }

    public function emptySections()
    {
        $this->sections->clear();
    }
}
