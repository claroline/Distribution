<?php

namespace Claroline\SamlBundle\Listener\Platform;

use Claroline\CoreBundle\Event\GenericDataEvent;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use LightSaml\Model\Metadata\EntityDescriptor;
use LightSaml\SymfonyBridgeBundle\Bridge\Container\BuildContainer;

class SamlSsoListener
{
    /** @var PlatformConfigurationHandler */
    private $config;

    /** @var BuildContainer */
    private $idpContainer;

    /**
     * OauthSsoListener constructor.
     *
     * @param PlatformConfigurationHandler $config
     * @param BuildContainer               $idpContainer
     */
    public function __construct(
        PlatformConfigurationHandler $config,
        BuildContainer $idpContainer
    ) {
        $this->config = $config;
        $this->idpContainer = $idpContainer;
    }

    /**
     * @param GenericDataEvent $event
     */
    public function onConfig(GenericDataEvent $event)
    {
        if ($this->config->getParameter('saml.active')) {
            $parties = $this->idpContainer->getPartyContainer()->getIdpEntityDescriptorStore()->all();

            $event->setResponse([
                'sso' => array_map(function (EntityDescriptor $descriptor) {
                    return [
                        'service' => 'saml',
                        'label' => $descriptor->getEntityID(),
                        'primary' => false,
                    ];
                }, $parties),
            ]);
        }
    }
}
