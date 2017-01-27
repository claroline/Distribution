<?php

namespace UJM\ExoBundle\Installation\Updater;

use Claroline\BundleRecorder\Log\LoggableTrait;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Doctrine\DBAL\Connection;
use UJM\ExoBundle\Entity\Attempt\Answer;
use UJM\ExoBundle\Entity\Attempt\Paper;
use UJM\ExoBundle\Entity\Question\Question;
use UJM\ExoBundle\Entity\Step;
use UJM\ExoBundle\Library\Options\ExerciseType;
use UJM\ExoBundle\Library\Options\Recurrence;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Serializer\ExerciseSerializer;
use UJM\ExoBundle\Serializer\Question\QuestionSerializer;
use UJM\ExoBundle\Serializer\StepSerializer;

class Updater090000
{
    use LoggableTrait;

    /**
     * @var Connection
     */
    private $connection;

    /**
     * @var ObjectManager
     */
    private $om;

    /**
     * @var ExerciseSerializer
     */
    private $exerciseSerializer;

    /**
     * @var StepSerializer
     */
    private $stepSerializer;

    /**
     * @var QuestionSerializer
     */
    private $questionSerializer;

    /**
     * Updater080000 constructor.
     *
     * @param Connection         $connection
     * @param ObjectManager      $om
     * @param ExerciseSerializer $exerciseSerializer
     * @param StepSerializer     $stepSerializer
     * @param QuestionSerializer $questionSerializer
     */
    public function __construct(
        Connection $connection,
        ObjectManager $om,
        ExerciseSerializer $exerciseSerializer,
        StepSerializer $stepSerializer,
        QuestionSerializer $questionSerializer)
    {
        $this->connection = $connection;
        $this->om = $om;
        $this->exerciseSerializer = $exerciseSerializer;
        $this->stepSerializer = $stepSerializer;
        $this->questionSerializer = $questionSerializer;
    }

    public function postUpdate()
    {
        $this->updateExerciseTypes();
        $this->updateAnswerData();
        $this->cleanOldPairQuestions();
        $this->updatePapers();
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

        $this->log('Enable feedback for formative Exercises...');
        $this->connection
            ->prepare('UPDATE ujm_exercise SET show_feedback = true WHERE `type` = "formative"')
            ->execute();

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
        $this->log('Update answers data...');

        // Answer parts
        $choiceSth = $this->connection->prepare('SELECT id, uuid FROM ujm_choice');
        $choiceSth->execute();
        $choices = $choiceSth->fetchAll();

        $labelSth = $this->connection->prepare('SELECT id, uuid FROM ujm_label');
        $labelSth->execute();
        $labels = $labelSth->fetchAll();

        $proposalSth = $this->connection->prepare('SELECT id, uuid FROM ujm_proposal');
        $proposalSth->execute();
        $proposals = $proposalSth->fetchAll();

        $holeSth = $this->connection->prepare('SELECT id, uuid FROM ujm_hole');
        $holeSth->execute();
        $holes = $holeSth->fetchAll();

        // Load answers
        $sth = $this->connection->prepare('
            SELECT q.mime_type, a.id AS answerId, a.response AS data
            FROM ujm_response AS a
            LEFT JOIN ujm_question AS q ON (a.question_id = q.uuid)
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

                    // Filter empty elements and convert ids into uuids
                    $newData = array_map(function ($choice) use ($choices) {
                        return $this->getAnswerPartUuid($choice, $choices);
                    }, array_filter($answerData, function ($part) {
                        return !empty($part);
                    }));

                    break;

                case 'application/x.match+json':
                case 'application/x.set+json':
                    if ('application/x.set+json' === $answer['mime_type']) {
                        $propNames = ['itemId', 'setId'];
                    } else {
                        $propNames = ['firstId', 'secondId'];
                    }

                    // Get each association
                    $answerData = explode(';', $answer['data']);

                    // Filter empty elements
                    $answerData = array_filter($answerData, function ($part) {
                        return !empty($part);
                    });

                    $newData = array_map(function ($association) use ($propNames, $labels, $proposals) {
                        $associationData = explode(',', $association);

                        $data = new \stdClass();

                        // Convert ids into uuids
                        $data->{$propNames[0]} = $this->getAnswerPartUuid($associationData[0], $proposals);
                        $data->{$propNames[1]} = $this->getAnswerPartUuid($associationData[1], $labels);

                        return $data;
                    }, $answerData);

                    break;

                case 'application/x.pair+json':
                    // Get each pair
                    $answerData = explode(';', $answer['data']);

                    // Filter empty elements
                    $answerData = array_filter($answerData, function ($part) {
                        return !empty($part);
                    });

                    $newData = array_map(function ($pair) use ($labels, $proposals) {
                        $pairData = explode(',', $pair);

                        // Convert ids into uuids
                        return [
                            $this->getAnswerPartUuid($pairData[0], $proposals),
                            $this->getAnswerPartUuid($pairData[1], $labels),
                        ];
                    }, $answerData);

                    break;

                case 'application/x.cloze+json':
                    // Replace hole ids by uuids
                    $answerData = json_decode($answer['data'], true);

                    $newData = [];
                    foreach ($answerData as $holeId => $answerText) {
                        if (!empty($answerText)) {
                            $hole = new \stdClass();
                            $hole->holeId = $this->getAnswerPartUuid($holeId, $holes);
                            $hole->answerText = $answerText;

                            $newData[] = $hole;
                        }
                    }

                    break;

                case 'application/x.graphic':
                    // Get each area
                    $answerData = explode(';', $answer['data']);

                    // Filter empty elements
                    $answerData = array_filter($answerData, function ($part) {
                        return !empty($part);
                    });

                    $newData = array_map(function ($coords) {
                        $coordsData = explode(',', $coords);

                        return [
                            $coordsData[0],
                            $coordsData[1],
                        ];
                    }, $answerData);
                    break;

                default:
                    break;
            }

            // Update answer data
            if (!empty($newData)) {
                $sth = $this->connection->prepare('
                    UPDATE ujm_response SET `response` = :data WHERE id = :id 
                ');
                $sth->execute([
                    'id' => $answer['answerId'],
                    'data' => json_encode($newData),
                ]);
            }
        }

        $this->log('done !');
    }

    private function getAnswerPartUuid($id, $parts)
    {
        $uuid = null;
        foreach ($parts as $part) {
            if ($part['id'] === $id) {
                $uuid = $part['uuid'];
                break;
            }
        }

        return $uuid;
    }

    private function cleanOldPairQuestions()
    {
        $this->log('Removes old pair questions data...');

        // Delete old questions
        $sth = $this->connection->prepare('
            SET FOREIGN_KEY_CHECKS = false;
            
            DELETE m FROM ujm_interaction_matching AS m
            JOIN ujm_question AS q ON (m.question_id = q.id)
            WHERE q.mime_type = "application/x.pair+json";
            
            SET FOREIGN_KEY_CHECKS = true;
        ');
        $sth->execute();

        // Delete old labels
        $sth = $this->connection->prepare('
            SET FOREIGN_KEY_CHECKS = false;
            
            DELETE l FROM ujm_label AS l
            LEFT JOIN ujm_interaction_matching AS m ON (l.interaction_matching_id = m.id)
            WHERE m.id IS NULL;
            
            SET FOREIGN_KEY_CHECKS = true;
        ');
        $sth->execute();

        // Delete old proposals
        $sth = $this->connection->prepare('
            SET FOREIGN_KEY_CHECKS = false;
            
            DELETE l FROM ujm_proposal AS p
            LEFT JOIN ujm_interaction_matching AS m ON (p.interaction_matching_id = m.id)
            WHERE m.id IS NULL;
            
            SET FOREIGN_KEY_CHECKS = true;
        ');
        $sth->execute();

        // Delete old labels/proposals association
        $sth = $this->connection->prepare('
            SET FOREIGN_KEY_CHECKS = false;
            
            DELETE l FROM ujm_proposal_label AS pl
            LEFT JOIN ujm_proposal AS p ON (pl.proposal_id = p.id)
            LEFT JOIN ujm_label AS l ON (pl.label_id = l.id)
            WHERE p.id IS NULL 
               OR l.id IS NULL;
                
            SET FOREIGN_KEY_CHECKS = true;
        ');
        $sth->execute();

        $this->log('done !');
    }

    /**
     * Updates papers data.
     *
     * - Dump the full exercise definition in `structure`
     * - Move hints to answers
     */
    private function updatePapers()
    {
        $this->log('Update Papers structures and hints...');

        $oldHints = $this->fetchHints();

        $questions = $this->om->getRepository('UJMExoBundle:Question\Question')->findAll();
        $decodedQuestions = [];

        $papers = $this->om->getRepository('UJMExoBundle:Attempt\Paper')->findAll();

        $this->om->startFlushSuite();

        /** @var Paper $paper */
        foreach ($papers as $i => $paper) {
            // Update structure
            $this->updatePaperStructure($paper, $questions, $decodedQuestions);

            // Update hints
            $this->updatePaperHints($paper, $oldHints);

            $this->om->persist($paper);

            if ($i % 200 === 0) {
                $this->om->forceFlush();
            }
        }

        $this->om->endFlushSuite();

        $this->log('done !');
    }

    private function updatePaperStructure(Paper $paper, array $questions, array $decodedQuestions)
    {
        $quizDef = $this->exerciseSerializer->serialize($paper->getExercise(), [Transfer::INCLUDE_SOLUTIONS]);

        // Replace steps and questions by the one from paper
        $stepsToKeep = [];
        $questionIds = explode(';', $paper->getStructure());
        foreach ($questionIds as $index => $questionId) {
            if (empty($questionId)) {
                unset($questionIds[$index]);
                continue;
            }

            $question = $this->pullQuestion($questionId, $questions, $decodedQuestions);
            if ($question) {
                // Find in which step this question is
                foreach ($quizDef->steps as $step) {
                    foreach ($step->items as $item) {
                        if ($question->id === $item->id) {
                            // Current question is part of the step
                            if (empty($stepsToKeep[$step->id])) {
                                // First time we get this step => stack the definition and reset items
                                $stepsToKeep[$step->id] = clone $step;
                                $stepsToKeep[$step->id]->items = [];
                            }

                            $stepsToKeep[$step->id]->items[] = $question;

                            unset($questionIds[$index]); // This will permits to retrieve orphan questions

                            break 2;
                        }
                    }
                }
            }
        }

        // Override quiz def with only the picked steps for the attempt
        $quizDef->steps = array_values($stepsToKeep);

        if (!empty($questionIds)) {
            // There are questions that are no longer linked to the exercise
            // Create a default step and add all
            $stepForOrphans = $this->stepSerializer->serialize(new Step(), [Transfer::INCLUDE_SOLUTIONS]);

            foreach ($questionIds as $questionId) {
                /** @var Question $question */
                $question = $this->pullQuestion($questionId, $questions, $decodedQuestions);
                if ($question) {
                    $stepForOrphans->items[] = $question;
                }
            }

            $quizDef->steps[] = $stepForOrphans;
        }

        if (Recurrence::ONCE === $quizDef->parameters->randomPick || Recurrence::ONCE === $quizDef->parameters->randomOrder) {
            // We invalidate papers for exercise that are configured to reuse old attempts structure to generate new ones
            // The generator assumes the old data still are in the exercise
            // As we don't know if this is true for migrated data, we invalidate it to avoid possible bugs
            $paper->setInvalidated(true);
        }

        $paper->setStructure(json_encode($quizDef));
    }

    /**
     * Retrieves a question, serializes it and moves it in the decoded list (for later use)
     * before returning the serialized version of the found question.
     *
     * @param $questionId
     * @param array $questions
     * @param array $decodedQuestions
     *
     * @return \stdClass|null
     */
    private function pullQuestion($questionId, array $questions, array $decodedQuestions = [])
    {
        if (empty($decodedQuestions[$questionId])) {
            foreach ($questions as $index => $question) {
                if ($question->getId() === (int) $questionId) {
                    $decodedQuestions[$questionId] = $this->questionSerializer->serialize($question, [Transfer::INCLUDE_SOLUTIONS]);
                    unset($questions[$index]);
                    break;
                }
            }
        }

        return !empty($decodedQuestions[$questionId]) ? $decodedQuestions[$questionId] : null;
    }

    private function updatePaperHints(Paper $paper, array $oldHints = [])
    {
        $hints = $this->pullHint($paper->getId(), $oldHints);
        foreach ($hints as $hint) {
            $answer = $paper->getAnswer($hint);
            if (empty($answer)) {
                $answer = new Answer();
                $answer->setIp('127.0.0.1'); // localhost IP. this is not a deal because it's only used to block answer submission
                $answer->setScore(0); // Score is 0 because the old notation system do not allow negative scores
                $answer->setQuestionId($hint['question_id']);

                $paper->addAnswer($answer);
            }

            $answer->addUsedHint($hint['hint_id']);
        }
    }

    private function fetchHints()
    {
        $sth = $this->connection->prepare('
            SELECT lhp.paper_id, h.uuid AS hint_id, q.uuid AS question_id
            FROM ujm_link_hint_paper AS lhp
            LEFT JOIN ujm_hint AS h ON (lhp.hint_id = h.id AND h.id IS NOT NULL)
            LEFT JOIN ujm_question AS q ON (h.question_id = q.id AND q.id IS NOT NULL)
        ');

        $sth->execute();

        return $sth->fetchAll();
    }

    private function pullHint($paperId, array $hints = [])
    {
        $paperHints = [];

        foreach ($hints as $index => $hint) {
            if ($paperId === $hint['paper_id']) {
                $paperHints = $hint;
                unset($hints[$index]);
            }
        }

        return $paperHints;
    }
}
