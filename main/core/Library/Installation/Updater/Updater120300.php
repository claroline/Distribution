<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Library\Installation\Updater;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Organization\Organization;
use Claroline\InstallationBundle\Updater\Updater;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Translation\TranslatorInterface;

class Updater120300 extends Updater
{
    const BATCH_SIZE = 500;

    protected $logger;

    /** @var ObjectManager */
    private $om;

    /** @var TranslatorInterface */
    private $translator;

    private $parameters;

    private $contentRepo;
    private $translationRepo;
    private $templateRepo;
    private $templateTypeRepo;

    public function __construct(ContainerInterface $container, $logger = null)
    {
        $this->logger = $logger;

        $this->om = $container->get('claroline.persistence.object_manager');
        $this->cryptoManager = $container->get('claroline.manager.cryptography_manager');
    }

    public function postUpdate()
    {
        $this->generateOrganizationKeys();
    }

    private function generateOrganizationKeys()
    {
        $organizations = $this->om->getRepository(Organization::class)->findAll();

        foreach ($organizations as $orga) {
            $this->log('Generate crypto for '.$orga->getName());
            $key = $this->cryptoManager->generatePair();
            $key->setOrganization($orga);
            $this->om->persist($key);
        }

        $this->log('Flushing');
        $this->om->flush();
    }
}
