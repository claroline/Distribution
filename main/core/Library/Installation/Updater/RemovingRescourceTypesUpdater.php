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

use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Resource\ResourceType;
use Claroline\InstallationBundle\Updater\Updater;
use Symfony\Component\DependencyInjection\ContainerInterface;

//todo to execute in a future release
class RemovingRescourceTypesUpdater extends Updater
{
    private $container;
    private $om;
    private $adminToolRepo;

    public function __construct(ContainerInterface $container, $logger = null)
    {
        $this->logger = $logger;
        $this->container = $container;
        $this->om = $container->get('claroline.persistence.object_manager');
        $this->conn = $container->get('doctrine.dbal.default_connection');
        $this->databaseManager = $this->container->get('claroline.manager.database_manager');
        $this->databaseManager->setLogger($logger);
    }

    public function postUpdate()
    {
        $types = [
          'claroline_survey',
          'activity',
        ];
        $this->removeResources($types);
        //$this->removeTypes($types);
        //$this->removeTables();
    }

    public function removeResources(array $types)
    {
        foreach ($types as $type) {
            $this->log('Backup old nodes for type '.$type);
            $this->databaseManager->backupRows(ResourceNode::class, ['resourceType' => $type], 'claro_node_'.$type);
            /*
              $typeEntity = $this->om->getRepository(ResourceType::class)->findOneByName($type);
              $nodes = $this->om->getRepository(ResourceNode::class)->findBy(['resourceType' => $typeEntity]);
              $manager = $this->container->get('claroline.manager.resource_manager');
              $total = count($nodes);
              $this->log('Ready to remove '.$total.' '.$type);
              $i = 0;

              foreach ($nodes as $node) {
                  ++$i;
                  $this->log('Removing '.$type.' '.$i.'/'.$total);
                  $manager->delete($node, true);
              }

              $this->om->flush();*/
        }
    }

    public function removeTypes($types)
    {
        foreach ($types as $type) {
            $entity = $this->om->getRepository(ResourceType::class)->findOneByName($type);
            if ($entity) {
                $this->log('Removing type '.$type);
                $this->om->remove($entity);
                $this->om->flush();
            }
        }
    }

    public function removeTables()
    {
        $tables = [
          'claro_survey_multiple_choice_question_answer',
          'claro_survey_open_ended_question_answer',
          'claro_survey_question_answer',
          'claro_survey_simple_text_question_answer',
          'claro_survey_answer',
          'claro_survey_choice',
          'claro_survey_multiple_choice_question',
          'claro_survey_question',
          'claro_survey_question_model',
          'claro_survey_resource',
          'claro_survey_question_relation',
          'claro_activity_parameters',
          'claro_activity_rule',
          'claro_activity_rule_action',
          'claro_activity_evaluation',
          'claro_activity_past_evaluation',
      ];

        //  $this->databaseManager->dropTables($tables, true);
    }
}
