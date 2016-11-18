<?php

namespace UJM\ExoBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * UJM\ExoBundle\Entity\LinkHintPaper.
 *
 * @ORM\Entity()
 * @ORM\Table(name="ujm_link_hint_paper")
 */
class LinkHintPaper
{
    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\Hint")
     */
    private $hint;

    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\Paper")
     */
    private $paper;

    public function __construct(Hint $hint, Paper $paper)
    {
        $this->hint = $hint;
        $this->paper = $paper;
    }

    public function setHint(Hint $hint)
    {
        $this->hint = $hint;
    }

    public function getHint()
    {
        return $this->hint;
    }

    public function setPaper(Paper $paper)
    {
        $this->paper = $paper;
    }

    public function getPaper()
    {
        return $this->paper;
    }
}
