<?php

namespace Claroline\CoreBundle\Router;

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Bundle\FrameworkBundle\Routing\Router;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Routing\RequestContext;

/**
 * @DI\Service("claroline.router", parent="router.default")
 */
class ClaroRouter extends Router
{
    public function __construct(
        ContainerInterface $container,
        $resource,
        array $options = [],
        RequestContext $context = null
    ) {
        $ch = $container->get('claroline.config.platform_config_handler');
        $domainName = $ch->getParameter('domain_name');
        $context = $context ?: new RequestContext();
        $sslEnabled = $ch->getParameter('ssl_enabled');
        $scheme = $sslEnabled ? 'https' : 'http';
        $context->setScheme($scheme);

        if ($domainName && trim($domainName) !== '') {
            $context->setHost($domainName);
        }

        parent::__construct($container, $resource,  $options,  $context);
    }
}
