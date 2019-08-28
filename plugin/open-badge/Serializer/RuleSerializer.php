<?php

namespace Claroline\OpenBadgeBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Group;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\OpenBadgeBundle\Entity\Rules\Rule;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.open_badge.rule")
 */
class RuleSerializer
{
    use SerializerTrait;

    /**
     * @DI\InjectParams({
     *     "om" = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param Router $router
     */
    public function __construct(ObjectManager $om)
    {
        $this->om = $om;
    }

    public function serialize(Rule $rule, array $options = [])
    {
        return [
            'data' => $rule->getData(),
            'type' => $rule->getAction(),
            'id' => $rule->getUuid(),
        ];
    }

    /**
     * Deserializes data into a Group entity.
     *
     * @param \stdClass $data
     * @param Group     $group
     * @param array     $options
     *
     * @return Group
     */
    public function deserialize($data, Rule $rule = null, array $options = [])
    {
        $rule->setData($data['data']);
        $rule->setAction($data['type']);

        if (isset($data['data']['workspace'])) {
            $rule->setWorkspace($this->om->getObject($data['data']['workspace'], Workspace::class));
        }

        if (isset($data['data']['resource'])) {
            $rule->setResourceNode($this->om->getObject($data['data']['resource'], ResourceNode::class));
        }

        switch ($data['type']) {
            case Rule::RESOURCE_PASSED:
                $rule->setResourceNode($this->om->getObject($data['data'], ResourceNode::class));
                break;
            case Rule::RESOURCE_PARTICIPATED:
                $rule->setResourceNode($this->om->getObject($data['data'], ResourceNode::class));
                break;
            case Rule::WORKSPACE_PASSED:
                $rule->setWorkspace($this->om->getObject($data['data'], Workspace::class));
                break;
            case Rule::IN_GROUP:
                $rule->setGroup($this->om->getObject($data['data'], Group::class));
                break;
            case Rule::IN_ROLE:
                $rule->setRole($this->om->getObject($data['data'], Role::class));
                break;
        }

        return $rule;
    }
}