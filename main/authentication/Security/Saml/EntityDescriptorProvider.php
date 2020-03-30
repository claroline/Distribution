<?php

/*
 * This file is part of the LightSAML-Core package.
 *
 * (c) Milos Tomic <tmilos@lightsaml.com>
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace Claroline\AuthenticationBundle\Security\Saml;

use LightSaml\Credential\X509Certificate;
use LightSaml\Credential\X509Credential;
use LightSaml\Model\Metadata\AssertionConsumerService;
use LightSaml\Model\Metadata\EntityDescriptor;
use LightSaml\Model\Metadata\IdpSsoDescriptor;
use LightSaml\Model\Metadata\KeyDescriptor;
use LightSaml\Model\Metadata\RoleDescriptor;
use LightSaml\Model\Metadata\SingleLogoutService;
use LightSaml\Model\Metadata\SingleSignOnService;
use LightSaml\Model\Metadata\SpSsoDescriptor;
use LightSaml\Provider\EntityDescriptor\EntityDescriptorProviderInterface;
use LightSaml\SamlConstants;
use LightSaml\Store\Credential\CredentialStoreInterface;
use Symfony\Component\Routing\RouterInterface;

/**
 * Customize entity descriptor.
 *
 * This is basically a big c/c from default SimpleEntityDescriptorBuilder.
 * I don't know if this is the correct way to do it, but I can not find another way to change
 * some SP descriptor values (NameId, SingleLogout, ...).
 */
class EntityDescriptorProvider implements EntityDescriptorProviderInterface
{
    /** @var string */
    protected $entityId;

    /** @var string */
    protected $acsUrl;

    /** @var string[] */
    protected $acsBindings = [];

    /** @var string */
    protected $ssoUrl;

    /** @var string[] */
    protected $ssoBindings = [];

    /** @var string */
    protected $logoutUrl;

    /** @var string[] */
    protected $logoutBindings = [];

    /** @var string[]|null */
    protected $use;

    /** @var X509Certificate */
    protected $ownCertificate;

    /** @var EntityDescriptor */
    private $entityDescriptor;

    public function __construct($entityId, RouterInterface $router, $acsRouteName, CredentialStoreInterface $ownCredentialStore)
    {
        $this->entityId = $entityId;
        $this->use = [KeyDescriptor::USE_ENCRYPTION, KeyDescriptor::USE_SIGNING];

        /** @var X509Credential[] $arrOwnCredentials */
        $arrOwnCredentials = $ownCredentialStore->getByEntityId($entityId);
        $this->ownCertificate = $arrOwnCredentials[0]->getCertificate();

        $this->acsUrl = $acsRouteName ? $router->generate($acsRouteName, [], RouterInterface::ABSOLUTE_URL) : null;
        $this->acsBindings = [SamlConstants::BINDING_SAML2_HTTP_POST];

        $this->logoutUrl = $router->generate('claro_security_logout', [], RouterInterface::ABSOLUTE_URL);
        $this->logoutBindings = [SamlConstants::BINDING_SAML2_HTTP_POST];

        // we don't use Claroline as IDP for know so there is no SSO declared
        //$this->ssoUrl = $ssoRouteName ? $router->generate($ssoRouteName, [], RouterInterface::ABSOLUTE_URL) : null;
        $this->ssoBindings = [SamlConstants::BINDING_SAML2_HTTP_POST, SamlConstants::BINDING_SAML2_HTTP_REDIRECT];
    }

    /**
     * @return EntityDescriptor
     */
    public function get()
    {
        if (null === $this->entityDescriptor) {
            $this->entityDescriptor = $this->getEntityDescriptor();
            if (false === $this->entityDescriptor instanceof EntityDescriptor) {
                throw new \LogicException('Expected EntityDescriptor');
            }
        }

        return $this->entityDescriptor;
    }

    /**
     * @return EntityDescriptor
     */
    protected function getEntityDescriptor()
    {
        $entityDescriptor = new EntityDescriptor();
        $entityDescriptor->setEntityID($this->entityId);

        $spSsoDescriptor = $this->getSpSsoDescriptor();
        if ($spSsoDescriptor) {
            $entityDescriptor->addItem($spSsoDescriptor);
        }

        $idpSsoDescriptor = $this->getIdpSsoDescriptor();
        if ($idpSsoDescriptor) {
            $entityDescriptor->addItem($idpSsoDescriptor);
        }

        return $entityDescriptor;
    }

    /**
     * @return SpSsoDescriptor|null
     */
    protected function getSpSsoDescriptor()
    {
        if (null === $this->acsUrl) {
            return null;
        }

        $spSso = new SpSsoDescriptor();

        foreach ($this->acsBindings as $index => $binding) {
            $acs = new AssertionConsumerService();
            $acs->setIndex($index)->setLocation($this->acsUrl)->setBinding($binding);
            $spSso->addAssertionConsumerService($acs);
        }

        $spSso->setWantAssertionsSigned(true);
        $spSso->addNameIDFormat(SamlConstants::NAME_ID_FORMAT_EMAIL);

        if ($this->logoutUrl) {
            foreach ($this->logoutBindings as $binding) {
                $spSso->addSingleLogoutService(new SingleLogoutService($this->logoutUrl, $binding));
            }
        }

        $this->addKeyDescriptors($spSso);

        return $spSso;
    }

    /**
     * @return IdpSsoDescriptor
     */
    protected function getIdpSsoDescriptor()
    {
        if (null === $this->ssoUrl) {
            return null;
        }

        $idpSso = new IdpSsoDescriptor();

        foreach ($this->ssoBindings as $binding) {
            $sso = new SingleSignOnService();
            $sso
                ->setLocation($this->ssoUrl)
                ->setBinding($binding);
            $idpSso->addSingleSignOnService($sso);
        }

        $this->addKeyDescriptors($idpSso);

        return $idpSso;
    }

    /**
     * @param RoleDescriptor $descriptor
     */
    protected function addKeyDescriptors(RoleDescriptor $descriptor)
    {
        if ($this->use) {
            foreach ($this->use as $use) {
                $kd = new KeyDescriptor();
                $kd->setUse($use);
                $kd->setCertificate($this->ownCertificate);

                $descriptor->addKeyDescriptor($kd);
            }
        } else {
            $kd = new KeyDescriptor();
            $kd->setCertificate($this->ownCertificate);

            $descriptor->addKeyDescriptor($kd);
        }
    }
}
