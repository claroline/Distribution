<?php

namespace Claroline\CoreBundle\API\Serializer;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\API\Utils\ArrayUtils;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * Serializes platform parameters.
 *
 * @DI\Service("claroline.serializer.parameters")
 */
class ParametersSerializer
{
    /** @var SerializerProvider */
    private $serializer;

    /** @var FinderProvider */
    private $finder;

    /**
     * ParametersSerializer constructor.
     *
     * @DI\InjectParams({
     *     "serializer" = @DI\Inject("claroline.api.serializer"),
     *     "finder"     = @DI\Inject("claroline.api.finder")
     * })
     *
     * @param PlatformConfigurationHandler $config
     * @param SerializerProvider           $serializer
     * @param FinderProvider               $finder
     */
    public function __construct(
        SerializerProvider $serializer,
        FinderProvider $finder
    ) {
        $this->serializer = $serializer;
        $this->finder = $finder;
        $this->arrayUtils = new ArrayUtils();
    }

    public function serialize(array $options = [])
    {
    }
}
