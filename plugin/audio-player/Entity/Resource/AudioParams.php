<?php

namespace Claroline\AudioPlayerBundle\Entity\Resource;

use Claroline\AppBundle\Entity\Identifier\Uuid;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="claro_audio_params")
 */
class AudioParams
{
    use Uuid;

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\CoreBundle\Entity\Resource\ResourceNode")
     * @ORM\JoinColumn(name="node_id", nullable=false, onDelete="CASCADE")
     */
    protected $node;

    /**
     * @ORM\Column(name="comments_allowed", type="boolean")
     */
    private $commentsAllowed = false;

    /**
     * @ORM\Column(name="rate_control", type="boolean")
     */
    private $rateControl = false;

    public function __construct()
    {
        $this->refreshUuid();
    }

    public function getId()
    {
        return $this->id;
    }

    public function getNode()
    {
        return $this->node;
    }

    public function setNode(ResourceNode $node)
    {
        $this->node = $node;
    }

    public function isCommentsAllowed()
    {
        return $this->commentsAllowed;
    }

    public function setCommentsAllowed($commentsAllowed)
    {
        $this->commentsAllowed = $commentsAllowed;
    }

    public function getRateControl()
    {
        return $this->rateControl;
    }

    public function setRateControl($rateControl)
    {
        $this->rateControl = $rateControl;
    }
}
