<?php

namespace Claroline\CoreBundle\Library\Installation\Updater;

use Claroline\AppBundle\API\Options;
use Claroline\InstallationBundle\Updater\Updater;
use Symfony\Component\DependencyInjection\ContainerInterface;

class Updater120101 extends Updater
{
    protected $logger;
    private $container;

    public function __construct(ContainerInterface $container, $logger = null)
    {
        $this->container = $container;
        $this->logger = $logger;
    }

    public function postUpdate()
    {
        $this->saveConfigAsJson();
    }

    public function saveConfigAsJson()
    {
        $data = $this->container->get('claroline.serializer.legacy_parameters')->serialize([Options::SERIALIZE_MINIMAL]);
        $data = json_encode($data, JSON_PRETTY_PRINT);
        $path = $this->container->getParameter('claroline.param.platform_options');

        if (!file_exists($path)) {
            $this->log('Saving config as json file');
            file_put_contents($path, $data);
        }
    }
}
