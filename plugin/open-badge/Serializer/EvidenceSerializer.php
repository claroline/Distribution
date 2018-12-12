<?php

namespace Claroline\OpenBadgeBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\OpenBadgeBundle\Entity\Evidence;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Routing\RouterInterface;

/**
 * @DI\Service("claroline.serializer.open_badge.evidence")
 * @DI\Tag("claroline.serializer")
 */
class EvidenceSerializer
{
    use SerializerTrait;

    /**
     * @DI\InjectParams({
     *     "router" = @DI\Inject("router")
     * })
     *
     * @param Router $router
     */
    public function __construct(RouterInterface $router)
    {
        $this->router = $router;
    }

    /**
     * Serializes a Assertion entity.
     *
     * @param Assertion $assertion
     * @param array     $options
     *
     * @return array
     */
    public function serialize(Evidence $evidence, array $options = [])
    {
        $data = [
          'id' => $evidence->getUuid(),
          'narrative' => $evidence->getNarrative(),
          'name' => $evidence->getName(),
        ];

        if (in_array(Options::ENFORCE_OPEN_BADGE_JSON, $options)) {
            $data['id'] = $this->router->generate('apiv2_open_badge__evidence', ['evidence' => $evidence->getUuid()], UrlGeneratorInterface::ABSOLUTE_URL);
            $data['type'] = 'Evidence';
        }

        return $data;
    }

    /**
     * Serializes a Evidence entity.
     *
     * @param array    $data
     * @param Evidence $evidence
     * @param array    $options
     *
     * @return array
     */
    public function deserialize(array $data, Evidence $evidence = null, array $options = [])
    {
        $this->sipe('narrative', 'setNarrative', $data, $evidence);
        $this->sipe('name', 'setName', $data, $evidence);
    }

    public function getClass()
    {
        return Evidence::class;
    }
}
