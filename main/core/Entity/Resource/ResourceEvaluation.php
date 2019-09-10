<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Entity\Resource;

use Claroline\CoreBundle\Entity\AbstractEvaluation;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="claro_resource_evaluation")
 */
class ResourceEvaluation extends AbstractEvaluation
{
    /**
     * @ORM\ManyToOne(
     *     targetEntity="Claroline\CoreBundle\Entity\Resource\ResourceUserEvaluation",
     *     inversedBy="evaluations"
     * )
     * @ORM\JoinColumn(name="resource_user_evaluation", onDelete="CASCADE")
     *
     * @var ResourceUserEvaluation
     */
    private $resourceUserEvaluation;

    /**
     * @ORM\Column(type="text", name="evaluation_comment", nullable=true)
     *
     * @var string
     */
    private $comment;

    /**
     * @ORM\Column(name="more_data", type="json_array", nullable=true)
     *
     * @var array
     */
    private $data;

    /**
     * @return ResourceUserEvaluation
     */
    public function getResourceUserEvaluation()
    {
        return $this->resourceUserEvaluation;
    }

    /**
     * @param ResourceUserEvaluation $resourceUserEvaluation
     */
    public function setResourceUserEvaluation(ResourceUserEvaluation $resourceUserEvaluation)
    {
        $this->resourceUserEvaluation = $resourceUserEvaluation;
    }

    /**
     * @return string
     */
    public function getComment()
    {
        return $this->comment;
    }

    /**
     * @param string $comment
     */
    public function setComment($comment)
    {
        $this->comment = $comment;
    }

    public function getData()
    {
        return $this->data;
    }

    public function setData($data)
    {
        $this->data = $data;
    }
}
