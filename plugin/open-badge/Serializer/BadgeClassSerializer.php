<?php

namespace Claroline\OpenBadgeBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\OpenBadgeBundle\Entity\BadgeClass;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Routing\RouterInterface;

/**
 * @DI\Service()
 * @DI\Tag("claroline.serializer")
 */
class BadgeClassSerializer
{
    use SerializerTrait;

    /**
     * Crud constructor.
     *
     * @DI\InjectParams({
     *     "router" = @DI\Inject("router"),
     * })
     *
     * @param Router $router
     */
    public function __construct(RouterInterface $router)
    {
        $this->router = $router;
    }

    /**
     * Serializes a Group entity.
     *
     * @param Group $group
     * @param array $options
     *
     * @return array
     */
    public function serialize(BadgeClass $badge, array $options = [])
    {
        return [
            'id' => $this->router->generate('apiv2_badge-class_get', ['id' => $badge->getId()]),
            'name' => $badge->getName(),
            'description' => $badge->getDescription(),
            'criteria' => $badge->getCriteria(),
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
    public function deserialize($data, BadgeClass $badge = null, array $options = [])
    {
        $this->sipe('name', 'setName', $data, $badge);
        $this->sipe('description', 'setDescription', $data, $badge);
        $this->sipe('criteria', 'setCriteria', $data, $badge);

        return $badge;
    }

    public function getClass()
    {
        return BadgeClass::class;
    }
}
