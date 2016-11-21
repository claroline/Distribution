<?php

namespace UJM\ExoBundle\Installation\Updater;

use Claroline\BundleRecorder\Log\LoggableTrait;
use Doctrine\DBAL\Driver\Connection;
use Symfony\Component\DependencyInjection\ContainerInterface;
use UJM\ExoBundle\Library\Question\QuestionType;

class Updater080000
{
    use LoggableTrait;

    /**
     * @var Connection
     */
    private $connection;

    public function __construct(ContainerInterface $container)
    {
        $this->connection = $container->get('doctrine.dbal.default_connection');
    }

    public function postUpdate()
    {
        $this->addMimeTypeToQuestions();
        $this->updateAnswerData();
    }

    /**
     * Sets questions mime type.
     */
    private function addMimeTypeToQuestions()
    {
        $this->log('Add mime-type to Questions...');

        $types = [
            'InteractionQCM' => QuestionType::CHOICE,
            'InteractionGraphic' => QuestionType::GRAPHIC,
            'InteractionHole' => QuestionType::CLOZE,
        ];

        $sth = $this->connection->prepare('UPDATE ujm_question SET mime_type = :mimeType WHERE type = :type');
        foreach ($types as $type => $mimeType) {
            $sth->execute([
                ':mimeType' => $mimeType,
                ':type' => $type,
            ]);
        }

        // Update old open questions
        $sth = $this->connection->prepare('
            UPDATE ujm_question AS q 
            LEFT JOIN ujm_interaction_open AS o ON (o.question_id = q.id) 
            LEFT JOIN ujm_type_open_question AS t ON (o.typeopenquestion_id = t.id) 
            SET q.mime_type= :mimeType 
            WHERE q.type="InteractionOpen" 
              AND t.value IN (:typeOpen) 
        ');

        // Update words questions (InteractionOpen + type = oneWord | short)
        $sth->execute([
            ':mimeType' => QuestionType::WORDS,
            ':typeOpen' => '"oneWord", "short"'
        ]);

        // Update open questions (InteractionOpen + type = long)
        $sth->execute([
            ':mimeType' => QuestionType::OPEN,
            ':typeOpen' => '"long"'
        ]);

        // Update old match questions
        $matchTypes = [
            'To bind' => QuestionType::MATCH,
            'To pair' => QuestionType::PAIR,
            'To drag' => QuestionType::SET,
        ];

        $sth = $this->connection->prepare('
            UPDATE ujm_question AS q 
            LEFT JOIN ujm_interaction_matching AS m ON (m.question_id = q.id) 
            LEFT JOIN ujm_type_matching AS t ON (m.type_matching_id = t.id) 
            SET q.mime_type= :mimeType 
            WHERE q.type="InteractionMatching" 
              AND t.value = :typeMatch 
        ');

        foreach ($matchTypes as $matchType => $mimeType) {
            $sth->execute([
                ':mimeType' => $mimeType,
                ':typeMatch' => $matchType
            ]);
        }

        $this->log('done !');
    }

    /**
     * The answer data system uses custom encoding rules to converts answer data into string (to be stored in DB).
     *
     * The current methods updates existing data to just use the result of json_encode
     * on API data to in DB. This avoid to add custom logic for all question types.
     *
     * Example for choice answer storage:
     *  - old format : "1;2;3;4"
     *  - new format : "[1,2,3,4]"
     */
    private function updateAnswerData()
    {

    }
}
