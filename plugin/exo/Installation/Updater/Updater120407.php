<?php

namespace UJM\ExoBundle\Installation\Updater;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\InstallationBundle\Updater\Updater;
use UJM\ExoBundle\Entity\Attempt\Paper;
use UJM\ExoBundle\Manager\Attempt\PaperManager;

class Updater120407 extends Updater
{
    private $container;

    public function __construct($container)
    {
        $this->container = $container;
    }

    public function postUpdate()
    {
        $this->dumpPapersTotal();
    }

    private function dumpPapersTotal()
    {
        $this->log('Calculate and store paper total...');

        /** @var ObjectManager $om */
        $om = $this->container->get('claroline.persistence.object_manager');

        /** @var PaperManager $paperManager */
        $paperManager = $this->container->get('ujm_exo.manager.paper');

        $papers = $om
            ->createQuery('
                SELECT p 
                FROM UJM\ExoBundle\Entity\Attempt\Paper AS p 
                WHERE p.total IS NULL 
                   OR p.total = 0
            ')
            ->getResult();

        $i = 0;
        $total = count($papers);

        /** @var Paper $paper */
        foreach ($papers as $paper) {
            ++$i;
            $this->log("Calculating $i/$total...");

            $paper->setTotal($paperManager->calculateTotal($paper));
            $om->persist($paper);

            if (0 === $i % 100) {
                $om->flush();
                $this->log('flush');
            }
        }

        $om->flush();
        $this->log('flush');
    }
}
