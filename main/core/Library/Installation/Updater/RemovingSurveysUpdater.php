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
class RemovingSurveysUpdater extends Updater
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
    }

    public function postUpdate()
    {
        $this->removeSurveysResources();
        $this->removeSurveyType();
        $this->removeSurveysTables();
    }

    public function removeSurveysResources()
    {
        $type = $this->om->getRepository(ResourceType::class)->findOneByName('claroline_survey');
        $nodes = $this->om->getRepository(ResourceNode::class)->findBy(['resourceType' => $type]);
        $manager = $this->container->get('claroline.manager.resource_manager');
        $total = count($nodes);
        $this->log('Ready to remove '.$total.' surveys');
        $i = 0;

        foreach ($nodes as $node) {
            ++$i;
            $this->log('Removing survey '.$i.'/'.$total);
            $manager->delete($node);
        }

        $this->om->flush();
    }

    public function removeSurveyType()
    {
        $type = $this->om->getRepository(ResourceType::class)->findOneByName('claroline_survey');
        if ($type) {
            $this->log('Removing type claroline_survey');
            $this->om->remove($type);
            $this->om->flush();
        }
    }

    public function removeSurveysTables()
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
      ];

        foreach ($tables as $table) {
            $this->deleteTable($table);
        }
    }

    public function deleteTable($table)
    {
        try {
            $this->log('DROP '.$table);
            $sql = '
              SET FOREIGN_KEY_CHECKS=0;
              DROP TABLE '.$table.';
              SET FOREIGN_KEY_CHECKS=1;
          ';

            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
        } catch (\Exception $e) {
            $this->log('Couldnt drop '.$table.' '.$e->getMessage());
        }
    }
}
