<?php

namespace Claroline\AudioPlayerBundle\Entity\Quiz\Misc;

use Claroline\AudioPlayerBundle\Entity\Quiz\ItemType\WaveformQuestion;
use Claroline\CoreBundle\Entity\Model\UuidTrait;
use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Library\Model\FeedbackTrait;
use UJM\ExoBundle\Library\Model\ScoreTrait;

/**
 * @ORM\Entity
 * @ORM\Table(name="claro_audio_section")
 */
class Section
{
    /**
     * @var int
     *
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    use UuidTrait;

    use ScoreTrait;

    use FeedbackTrait;

    /**
     * @ORM\Column(name="section_start", type="integer", nullable=false)
     */
    private $start;

    /**
     * @ORM\Column(name="section_end", type="integer", nullable=false)
     */
    private $end;

    /**
     * @ORM\Column(name="start_tolerance", type="integer", nullable=false)
     */
    private $startTolerance = 0;

    /**
     * @ORM\Column(name="end_tolerance", type="integer", nullable=false)
     */
    private $endTolerance = 0;

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\AudioPlayerBundle\Entity\Quiz\ItemType\WaveformQuestion", inversedBy="areas")
     * @ORM\JoinColumn(name="interaction_graphic_id", referencedColumnName="id")
     */
    /**
     * @ORM\ManyToOne(targetEntity="Claroline\AudioPlayerBundle\Entity\Quiz\ItemType\WaveformQuestion")
     * @ORM\JoinColumn(name="waveform_id", onDelete="CASCADE")
     */
    private $waveform;

    public function __construct()
    {
        $this->refreshUuid();
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return int
     */
    public function getStart()
    {
        return $this->start;
    }

    /**
     * @param int $start
     */
    public function setStart($start)
    {
        $this->start = $start;
    }

    /**
     * @return int
     */
    public function getEnd()
    {
        return $this->end;
    }

    /**
     * @param int $end
     */
    public function setEnd($end)
    {
        $this->end = $end;
    }

    /**
     * @return int
     */
    public function getStartTolerance()
    {
        return $this->startTolerance;
    }

    /**
     * @param int $startTolerance
     */
    public function setStartTolerance($startTolerance)
    {
        $this->startTolerance = $startTolerance;
    }

    /**
     * @return int
     */
    public function getEndTolerance()
    {
        return $this->endTolerance;
    }

    /**
     * @param int $endTolerance
     */
    public function setEndTolerance($endTolerance)
    {
        $this->endTolerance = $endTolerance;
    }

    /**
     * @return WaveformQuestion
     */
    public function getWaveform()
    {
        return $this->waveform;
    }

    /**
     * @param WaveformQuestion $waveform
     */
    public function setWaveform(WaveformQuestion $waveform)
    {
        $this->waveform = $waveform;
    }
}
