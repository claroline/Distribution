<?php

namespace UJM\ExoBundle\Installation\Updater;

use Claroline\BundleRecorder\Log\LoggableTrait;
use Doctrine\DBAL\Connection;
use UJM\ExoBundle\Library\Options\ExerciseType;

class Updater080000
{
    use LoggableTrait;

    /**
     * @var Connection
     */
    private $connection;

    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    public function postUpdate()
    {
        $this->updateExerciseTypes();
        $this->updateAnswerData();
    }

    private function updateExerciseTypes()
    {
        $this->log('Update Exercise types...');

        $types = [
            '1' => ExerciseType::SUMMATIVE,
            '2' => ExerciseType::EVALUATIVE,
            '3' => ExerciseType::FORMATIVE,
        ];

        $sth = $this->connection->prepare('UPDATE ujm_exercise SET `type` = :newType WHERE `type` = :oldType');
        foreach ($types as $oldType => $newType) {
            $sth->execute([
                ':oldType' => $oldType,
                ':newType' => $newType,
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
        // Load answers
        $sth = $this->connection->prepare('
            SELECT q.mime_type, a.id AS answerId, a.response AS data
            FROM ujm_response AS a
            LEFT JOIN ujm_question AS q ON (a.question_id = q.id)
            WHERE a.response IS NOT NULL 
              AND a.response != ""
              AND q.mime_type != "application/x.open+json"
              AND q.mime_type != "application/x.words+json"
        ');

        $sth->execute();
        $answers = $sth->fetchAll();
        foreach ($answers as $answer) {
            $newData = null;

            // Calculate new data string (it's the json_encode of the data structure transferred in the API)
            switch ($answer['mime_type']) {
                case 'application/x.choice+json':
                    $answerData = explode(';', $answer['data']);

                    // Filter empty elements
                    $newData = array_filter($answerData, function ($part) {
                        return !empty($part);
                    });

                    break;

                case 'application/x.match+json':
                case 'application/x.set+json':
                    if ('application/x.set+json' === $answer['mime_type']) {
                        $propNames = ['setId', 'itemId'];
                    } else {
                        $propNames = ['firstId', 'secondId'];
                    }

                    // Get each association
                    $answerData = explode(';', $answer['data']);

                    // Filter empty elements
                    $answerData = array_filter($answerData, function ($part) {
                        return !empty($part);
                    });

                    $newData = array_map(function ($association) use ($propNames) {
                        $associationData = explode(',', $association);

                        $data = new \stdClass();
                        $data->{$propNames[0]} = $associationData[0];
                        $data->{$propNames[1]} = $associationData[1];

                        return $data;
                    }, $answerData);

                    break;

                default:
                    break;
            }

            // Update answer data
            if (!empty($newData)) {
                $sth = $this->connection->prepare('
                    UPDATE ujm_response SET response = :data WHERE id = :id 
                ');
                $sth->execute([
                    'id' => $answer['answerId'],
                    'data' => json_encode($newData),
                ]);
            }
        }
    }
}
