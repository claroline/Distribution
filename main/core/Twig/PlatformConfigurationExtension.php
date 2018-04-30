<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Twig;

use Claroline\CoreBundle\API\Serializer\Platform\ClientSerializer;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use JMS\DiExtraBundle\Annotation as DI;
use Twig_Extension;

/**
 * Exposes Platform configuration to Twig templates.
 *
 * @DI\Service
 * @DI\Tag("twig.extension")
 */
class PlatformConfigurationExtension extends Twig_Extension
{
    /** @var PlatformConfigurationHandler */
    private $handler;

    /** @var ClientSerializer */
    private $serializer;

    /**
     * PlatformConfigurationExtension constructor.
     *
     * @DI\InjectParams({
     *     "handler"    = @DI\Inject("claroline.config.platform_config_handler"),
     *     "serializer" = @DI\Inject("claroline.serializer.platform_client")
     * })
     *
     * @param PlatformConfigurationHandler $handler
     * @param ClientSerializer           $serializer
     */
    public function __construct(
        PlatformConfigurationHandler $handler,
        ClientSerializer $serializer
    ) {
        $this->handler = $handler;
        $this->serializer = $serializer;
    }

    public function getName()
    {
        return 'claro_platform_configuration';
    }

    public function getFunctions()
    {
        return [
            'platform_config' => new \Twig_Function_Method($this, 'getPlatformConfig'),
        ];
    }

    public function getPlatformConfig()
    {
        return $this->serializer->serialize();
    }

    /**
     * Exposes platform configuration as a Twig global.
     *
     * @deprecated
     * This is deprecated in Twig last versions.
     * Also we don't need access to all configuration
     *
     * @return array
     */
    public function getGlobals()
    {
        return ['config' => $this->handler];
    }
}
