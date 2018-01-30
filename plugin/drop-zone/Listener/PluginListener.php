<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\DropZoneBundle\Listener;

use Claroline\CoreBundle\Event\CopyResourceEvent;
use Claroline\CoreBundle\Event\CreateFormResourceEvent;
use Claroline\CoreBundle\Event\CreateResourceEvent;
use Claroline\CoreBundle\Event\DeleteResourceEvent;
use Claroline\CoreBundle\Event\OpenResourceEvent;
use Claroline\CoreBundle\Event\PluginOptionsEvent;
use Claroline\CoreBundle\Form\ResourceNameType;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\DropZoneBundle\Entity\Dropzone;
use Claroline\DropZoneBundle\Manager\DropzoneManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Bundle\TwigBundle\TwigEngine;
use Symfony\Component\Form\FormFactory;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\HttpKernelInterface;

/**
 * @DI\Service
 */
class PluginListener
{
    /** @var HttpKernelInterface */
    private $httpKernel;
    /** @var Request */
    private $request;

    /**
     * PluginListener constructor.
     *
     * @DI\InjectParams({
     *     "httpKernel"            = @DI\Inject("http_kernel"),
     *     "requestStack"          = @DI\Inject("request_stack")
     * })
     *
     * @param HttpKernelInterface $httpKernel
     * @param RequestStack $requestStack
     */
    public function __construct(
        HttpKernelInterface $httpKernel,
        RequestStack $requestStack
    ) {
        $this->httpKernel = $httpKernel;
        $this->request = $requestStack->getCurrentRequest();
    }

    /**
     * @DI\Observe("plugin_options_dropzonebundle")
     *
     * @param PluginOptionsEvent $event
     */
    public function onPluginOptionsOpen(PluginOptionsEvent $event)
    {
        $params = [];
        $params['_controller'] = 'ClarolineDropZoneBundle:Plugin:configure';
        $subRequest = $this->request->duplicate([], null, $params);
        $response = $this->httpKernel->handle($subRequest, HttpKernelInterface::SUB_REQUEST);

        $event->setResponse($response);
        $event->stopPropagation();
    }
}
