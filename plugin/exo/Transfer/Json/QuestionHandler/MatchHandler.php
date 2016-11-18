<?php

namespace UJM\ExoBundle\Transfer\Json\QuestionHandler;

use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerInterface;
use UJM\ExoBundle\Entity\InteractionMatching;
use UJM\ExoBundle\Entity\Label;
use UJM\ExoBundle\Entity\Proposal;
use UJM\ExoBundle\Entity\Question;
use UJM\ExoBundle\Entity\Attempt\Answer;
use UJM\ExoBundle\Transfer\Json\QuestionHandlerInterface;

/**
 * @DI\Service("ujm.exo.match_handler")
 * @DI\Tag("ujm.exo.question_handler")
 */
class MatchHandler implements QuestionHandlerInterface
{
    private $om;
    private $container;

    /**
     * @DI\InjectParams({
     *     "om"              = @DI\Inject("claroline.persistence.object_manager"),
     *     "container"       = @DI\Inject("service_container")
     * })
     *
     * @param ObjectManager      $om
     * @param ContainerInterface $container
     */
    public function __construct(ObjectManager $om, ContainerInterface $container)
    {
        $this->om = $om;
        $this->container = $container;
    }

    /**
     * {@inheritdoc}
     */
    public function getQuestionMimeType()
    {
        return 'application/x.match+json';
    }

    /**
     * {@inheritdoc}
     */
    public function getInteractionType()
    {
        return InteractionMatching::TYPE;
    }

    /**
     * {@inheritdoc}
     */
    public function getJsonSchemaUri()
    {
        return 'http://json-quiz.github.io/json-quiz/schemas/question/match/schema.json';
    }

    /**
     * {@inheritdoc}
     */
    public function validateAfterSchema(\stdClass $questionData)
    {
        $errors = [];

        if (!isset($questionData->solutions)) {
            return $errors;
        }

        // check solution ids are consistent with proposals ids
        $proposalsIds = array_map(function ($proposal) {
            return $proposal->id;
        }, $questionData->firstSet);

        $labelsIds = array_map(function ($label) {
            return $label->id;
        }, $questionData->secondSet);

        foreach ($questionData->solutions as $index => $solution) {
            if (!in_array($solution->firstId, $proposalsIds)) {
                $errors[] = [
                    'path' => "solutions[{$index}]",
                    'message' => "id {$solution->firstId} doesn't match any proposal id",
                ];
            }

            if (!in_array($solution->secondId, $labelsIds)) {
                $errors[] = [
                    'path' => "solutions[{$index}]",
                    'message' => "id {$solution->secondId} doesn't match any label id",
                ];
            }
        }

        // check there is a positive score solution
        $maxScore = -1;

        foreach ($questionData->solutions as $solution) {
            if ($solution->score > $maxScore) {
                $maxScore = $solution->score;
            }
        }

        if ($maxScore <= 0) {
            $errors[] = [
                'path' => 'solutions',
                'message' => 'there is no solution with a positive score',
            ];
        }

        return $errors;
    }

    /**
     * {@inheritdoc}
     */
    public function convertInteractionDetails(Question $question, \stdClass $exportData, $withSolution = true, $forPaperList = false)
    {
        $repo = $this->om->getRepository('UJMExoBundle:InteractionMatching');
        $match = $repo->findOneBy(['question' => $question]);
        $exportData->random = $match->getShuffle();
        // shuffle proposals and labels or sort them
        if ($exportData->random && !$forPaperList) {
            $match->shuffleProposals();
            $match->shuffleLabels();
        } else {
            $match->sortProposals();
            $match->sortLabels();
        }

        $proposals = $match->getProposals()->toArray();
        $exportData->toBind = $match->getTypeMatching()->getCode() === 1 ? true : false;
        $exportData->typeMatch = $match->getTypeMatching()->getCode();
        $exportData->firstSet = array_map(function (Proposal $proposal) {
            $firstSetData = new \stdClass();
            $firstSetData->id = (string) $proposal->getId();
            $firstSetData->type = 'text/plain';
            $firstSetData->data = $proposal->getValue();

            return $firstSetData;
        }, $proposals);

        $labels = $match->getLabels()->toArray();
        $exportData->secondSet = array_map(function (Label $label) {
            $secondSetData = new \stdClass();
            $secondSetData->id = (string) $label->getId();
            $secondSetData->type = 'text/plain';
            $secondSetData->data = $label->getValue();

            return $secondSetData;
        }, $labels);

        if ($withSolution) {
            $exportData->solutions = [];
            foreach ($proposals as $proposal) {
                $associatedLabels = $proposal->getAssociatedLabel();
                foreach ($associatedLabels as $label) {
                    $solution = new \stdClass();
                    $solution->firstId = (string) $proposal->getId();
                    $solution->secondId = (string) $label->getId();
                    $solution->score = $label->getScoreRightResponse();
                    if ($label->getFeedback()) {
                        $solution->feedback = $label->getFeedback();
                    }
                    array_push($exportData->solutions, $solution);
                }
            }
        }

        return $exportData;
    }

    public function convertQuestionAnswers(Question $question, \stdClass $exportData)
    {
        $repo = $this->om->getRepository('UJMExoBundle:InteractionMatching');
        $match = $repo->findOneBy(['question' => $question]);

        $proposals = $match->getProposals()->toArray();
        $exportData->solutions = [];
        foreach ($proposals as $proposal) {
            $associatedLabels = $proposal->getAssociatedLabel();
            foreach ($associatedLabels as $label) {
                $solution = new \stdClass();
                $solution->firstId = (string) $proposal->getId();
                $solution->secondId = (string) $label->getId();
                $solution->score = $label->getScoreRightResponse();
                if ($label->getFeedback()) {
                    $solution->feedback = $label->getFeedback();
                }
                array_push($exportData->solutions, $solution);
            }
        }

        return $exportData;
    }

    /**
     * {@inheritdoc}
     */
    public function convertAnswerDetails(Answer $response)
    {
        $parts = explode(';', $response->getResponse());

        return array_filter($parts, function ($part) {
            return $part !== '';
        });
    }

    /**
     * {@inheritdoc}
     */
    public function generateStats(Question $question, array $answers)
    {
        $match = [];

        return $match;
    }

    /**
     * {@inheritdoc}
     */
    public function validateAnswerFormat(Question $question, $data)
    {
        if (!is_array($data)) {
            return ['Answer data must be an array, '.gettype($data).' given'];
        }

        if (0 === count($data)) {
            // no need to check anything
            return [];
        }

        $interaction = $this->om->getRepository('UJMExoBundle:InteractionMatching')->findOneByQuestion($question);

        $proposals = $interaction->getProposals()->toArray();

        $proposalIds = array_map(function ($proposal) {
            return (string) $proposal->getId();
        }, $proposals);

        $labels = $interaction->getLabels()->toArray();
        $labelsIds = array_map(function (Label $label) {
            return (string) $label->getId();
        }, $labels);

        $sourceIds = [];
        $targetIds = [];
        foreach ($data as $answer) {
            if ($answer !== '') {
                $set = explode(',', $answer);
                array_push($sourceIds, $set[0]);
                array_push($targetIds, $set[1]);
            }
        }

        foreach ($sourceIds as $id) {
            if (!is_string($id)) {
                return ['Answer array must contain only string identifiers'];
            }

            if (!in_array($id, $proposalIds)) {
                return ['Answer array identifiers must reference a question proposal id'];
            }
        }

        foreach ($targetIds as $id) {
            if (!is_string($id)) {
                return ['Answer array must contain only string identifiers'];
            }

            if (!in_array($id, $labelsIds)) {
                return ['Answer array identifiers must reference a question proposal associated label id'];
            }
        }

        return [];
    }

     /**
      * @todo handle global score option
      *
      * {@inheritdoc}
      */
     public function storeAnswerAndMark(Question $question, Answer $response, $data)
     {
         $interaction = $this->om->getRepository('UJMExoBundle:InteractionMatching')
                 ->findOneByQuestion($question);

         $labels = $interaction->getLabels();
         // at least one label must have a score
         $score = 0;
         $tabLabelGraduate = []; // store labels already considered in calculating the score
        foreach ($labels as $label) {
            // if first label
             if (count($tabLabelGraduate) === 0) {
                 $score += $label->getScoreRightResponse();
             } elseif (count($tabLabelGraduate) > 0) {
                 foreach ($tabLabelGraduate as $labelPast) { // nothing in the array
                   if ($labelPast !== $label) {
                       $score += $label->getScoreRightResponse();
                   }
                 }
             }

             // add the labels already considered
             array_push($tabLabelGraduate, $label);
        }
         if ($score === 0) {
             throw new \Exception('Global score not implemented yet');
         }

         $serviceMatching = $this->container->get('ujm.exo.matching_service');

         $tabsResponses = $serviceMatching->initTabResponseMatching($data, $interaction);
         $tabRightResponse = $tabsResponses[1];
         $tabResponseIndex = $tabsResponses[0];

         $mark = $serviceMatching->mark($interaction, 0, $tabRightResponse, $tabResponseIndex);

         if ($mark < 0) {
             $mark = 0;
         }

         $result = count($data) > 0 ? implode(';', $data) : '';
         $response->setResponse($result);
         $response->setMark($mark);
     }
}
