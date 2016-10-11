<?php

namespace UJM\ExoBundle\Installation\Updater;

use Claroline\BundleRecorder\Log\LoggableTrait;
use Symfony\Component\DependencyInjection\ContainerInterface;
use UJM\ExoBundle\Library\Question\QuestionType;

class Updater070100
{
    use LoggableTrait;

    private $connection;

    private $om;

    private $ut;

    public function __construct(ContainerInterface $container)
    {
        $this->connection = $container->get('doctrine.dbal.default_connection');
        $this->om = $container->get('claroline.persistence.object_manager');
        $this->ut = $container->get('claroline.utilities.misc');
    }

    public function postUpdate()
    {
        $this->addMimeTypeToQuestions();
        $this->initializeUuid();
    }

    /**
     * Sets questions mime type.
     */
    private function addMimeTypeToQuestions()
    {
        $this->log('Add mime-type to Questions...');

        // Update choice questions
        $query = 'UPDATE ujm_question SET mime_type= "'.QuestionType::CHOICE.'" WHERE type="InteractionQCM"';
        $this->connection->query($query);

        // Update graphic questions
        $query = 'UPDATE ujm_question SET mime_type= "'.QuestionType::GRAPHIC.'" WHERE type="InteractionGraphic"';
        $this->connection->query($query);

        // Update cloze questions
        $query = 'UPDATE ujm_question SET mime_type= "'.QuestionType::CLOZE.'" WHERE type="InteractionHole"';
        $this->connection->query($query);

        // Update words questions (InteractionOpen + type = oneWord | short)
        $query = 'UPDATE ujm_question AS q ';
        $query .= 'LEFT JOIN ujm_interaction_open AS o ON (o.question_id = q.id) ';
        $query .= 'LEFT JOIN ujm_type_open_question AS t ON (o.typeopenquestion_id = t.id) ';
        $query .= 'SET q.mime_type= "'.QuestionType::WORDS.'" ';
        $query .= 'WHERE q.type="InteractionOpen" ';
        $query .= '  AND t.value != "long" ';
        $this->connection->query($query);

        // Update open questions (InteractionOpen + type = long)
        $query = 'UPDATE ujm_question AS q ';
        $query .= 'LEFT JOIN ujm_interaction_open AS o ON (o.question_id = q.id) ';
        $query .= 'LEFT JOIN ujm_type_open_question AS t ON (o.typeopenquestion_id = t.id) ';
        $query .= 'SET q.mime_type= "'.QuestionType::OPEN.'" ';
        $query .= 'WHERE q.type="InteractionOpen" ';
        $query .= '  AND t.value = "long" ';
        $this->connection->query($query);

        // Update match questions
        $query = 'UPDATE ujm_question SET mime_type= "'.QuestionType::MATCH.'" WHERE type="InteractionMatch"';
        $this->connection->query($query);

        $this->log('done !');
    }

    private function initializeUuid()
    {
        $classes = [
            'UJM\ExoBundle\Entity\Question',
        ];

        foreach ($classes as $class) {
            $this->setUuidForClass($class);
        }
    }

    public function setUuidForClass($class)
    {
        $entities = $this->om->getRepository($class)->findAll();
        $totalObjects = count($entities);
        $i = 0;
        $this->log("Adding UUID for {$totalObjects} {$class}...");

        foreach ($entities as $entity) {
            if (!$entity->getUuid()) {
                $entity->setUuid($this->ut->generateGuid());
                $this->om->persist($entity);
            }
            ++$i;

            if ($i % 300 === 0) {
                $this->log("Flushing [{$i}/{$totalObjects}]");
                $this->om->flush();
            }
        }

        $this->om->flush();
        $this->log("UUID added for {$totalObjects} {$class} !");
        $this->log('Clearing object manager...');
        $this->om->clear();
        $this->log('done !');
    }
}
