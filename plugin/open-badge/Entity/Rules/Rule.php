<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\OpenBadgeBundle\Entity\Rules;

use Claroline\CoreBundle\Entity\Model\UuidTrait;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="claro__open_badge_rule")
 */
class Rule
{
    const RULE_RESOURCE_PASSED = 'resource_passed';
    const RULE_RESOURCE_SCORE_ABOVE = 'resource_score_above';
    const RULE_RESOURCE_COMPLETED_ABOVE = 'resource_completed_above';
    const RULE_WORKSPACE_PASSED = 'workspace_passed';
    const RULE_WORKSPACE_SCORE_ABOVE = 'workspace_score_above';
    const RULE_WORKSPACE_COMPLETED_ABOVE = 'workspace_completed_above';
    const RULE_RESOURCE_PARTICIPATED = 'resource_participated';
    const RULE_IN_GROUP_OR_ROLE = 'user_in_group_or_role';
    const RULE_PROFILE_COMPLETED = 'profile_completed';

    use UuidTrait;

    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var string
     *
     * @ORM\Column(type="string", nullable=false)
     */
    protected $action;

    /**
     * @ORM\Column(type="json_array")
     *
     * @var array
     */
    private $data = [];

    private $enabled = true;

    public function setAction($action)
    {
        $this->action = $action;
    }

    public function getAction()
    {
        return $this->action;
    }

    public function getId()
    {
        return $this->id;
    }

    public function setData(array $data = [])
    {
        $this->data = $data;
    }

    public function getData()
    {
        return $this->data;
    }
}
