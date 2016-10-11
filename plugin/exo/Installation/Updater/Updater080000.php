<?php

namespace UJM\ExoBundle\Installation\Updater;

use Claroline\BundleRecorder\Log\LoggableTrait;
use Symfony\Component\DependencyInjection\ContainerInterface;
use UJM\ExoBundle\Library\Question\QuestionType;

class Updater080000
{
    use LoggableTrait;

    private $connection;

    public function __construct(ContainerInterface $container)
    {
        $this->connection = $container->get('doctrine.dbal.default_connection');
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
        $tables = [
            'ujm_exercise',
            'ujm_step',
            'ujm_question',
        ];

        foreach ($tables as $table) {
            $this->log("Adding UUID in table '{$table}...");

            $query = 'UPDATE '.$table.' SET uuid = (SELECT UUID()) WHERE uuid IS NULL OR uuid = ""';
            $this->connection->query($query);
        }
    }
}
