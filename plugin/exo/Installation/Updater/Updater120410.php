<?php

namespace UJM\ExoBundle\Installation\Updater;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\InstallationBundle\Updater\Updater;
use UJM\ExoBundle\Entity\Attempt\Paper;
use UJM\ExoBundle\Library\Options\ExerciseType;
use UJM\ExoBundle\Manager\Attempt\PaperManager;

class Updater120410 extends Updater
{
    private $container;

    // Define load batch size, and flush size
    const BATCH_SIZE = 1000;
    const FLUSH_SIZE = 250;

    public function __construct($container)
    {
        $this->container = $container;
    }

    public function postUpdate()
    {
        $this->migratePapers();
    }

    private function migratePapers()
    {
        $this->log('Start migrating paper to update score info...');

        /** @var ObjectManager $om */
        $om = $this->container->get('claroline.persistence.object_manager');
        $total = $this->container->get('ujm_exo.api.finder.paper')->find([], null, 0, -1, true);

        // retrieve all papers
        $papers = [];
        $i = 0;

        for ($batch = 0; $batch < ceil($total / self::BATCH_SIZE); ++$batch) {
            $papers = $this->container->get('ujm_exo.api.finder.paper')->find([], null, $batch, self::BATCH_SIZE);
            $this->log('Batch '.$batch.'/'.ceil($total / self::BATCH_SIZE).': size - '.self::BATCH_SIZE);
            foreach ($papers as $paper) {
                ++$i;
                $this->log("Migrating $i/$total...");

                $this->migrateStructure($paper);
                $this->dumpTotal($paper);

                if (0 === $i % self::FLUSH_SIZE) {
                    $om->flush();
                    $this->log('flush');
                }
            }

            foreach ($papers as $paper) {
                $om->detach($paper);
            }
        }

        $om->flush();
        $this->log('flush');
    }

    /**
     * Appends new score info in the json structure.
     *
     * @param Paper $paper
     */
    private function migrateStructure(Paper $paper)
    {
        /** @var ObjectManager $om */
        $om = $this->container->get('claroline.persistence.object_manager');

        $this->log('Update paper score parameters...');

        $structure = $paper->getStructure(true);
        if (!empty($structure)) {
            if (ExerciseType::SURVEY === $structure['parameters']['type']) {
                // Remove correction and score parameters
                $structure['parameters']['hasExpectedAnswers'] = false;
                $structure['score'] = ['type' => 'none'];

                if (!empty($structure['steps'])) {
                    foreach ($structure['steps'] as &$step) {
                        if (!empty($step['items'])) {
                            foreach ($step['items'] as &$item) {
                                $item['score'] = ['type' => 'none'];
                                $item['hasExpectedAnswers'] = false;
                            }
                        }
                    }
                }
            } else {
                $structure['parameters']['hasExpectedAnswers'] = true;

                if (isset($structure['parameters']) && !empty($structure['parameters']['totalScoreOn'])) {
                    $structure['score'] = ['type' => 'sum', 'total' => $structure['parameters']['totalScoreOn']];
                } else {
                    $structure['score'] = ['type' => 'sum'];
                }

                if (!empty($structure['steps'])) {
                    foreach ($structure['steps'] as &$step) {
                        if (!empty($step['items'])) {
                            foreach ($step['items'] as &$item) {
                                $item['hasExpectedAnswers'] = true;
                            }
                        }
                    }
                }
            }

            $paper->setStructure(json_encode($structure));
            $om->persist($paper);
        }
    }

    /**
     * Stores the total score of the paper in DB.
     *
     * @param Paper $paper
     */
    private function dumpTotal(Paper $paper)
    {
        /** @var PaperManager $paperManager */
        $paperManager = $this->container->get('ujm_exo.manager.paper');

        /** @var ObjectManager $om */
        $om = $this->container->get('claroline.persistence.object_manager');

        if (empty($paper->getTotal())) {
            $this->log('Calculate and store paper total...');

            $paper->setTotal($paperManager->calculateTotal($paper));
            $om->persist($paper);
        }
    }
}
