<?php

namespace UJM\ExoBundle\Serializer\Question\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Misc\Label;
use UJM\ExoBundle\Entity\Misc\Proposal;
use UJM\ExoBundle\Entity\QuestionType\MatchQuestion;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;
use UJM\ExoBundle\Serializer\Content\ContentSerializer;

/**
 * @DI\Service("ujm_exo.serializer.question_match")
 */
class MatchQuestionSerializer implements SerializerInterface
{
    /**
     * @var ContentSerializer
     */
    private $contentSerializer;

    /**
     * MatchQuestionSerializer constructor.
     *
     * @DI\InjectParams({
     *      "contentSerializer" = @DI\Inject("ujm_exo.serializer.content")
     * })
     *
     * @param ContentSerializer $contentSerializer
     */
    public function __construct(ContentSerializer $contentSerializer)
    {
        $this->contentSerializer = $contentSerializer;
    }

    /**
     * Converts a Match question into a JSON-encodable structure.
     *
     * @param MatchQuestion $matchQuestion
     * @param array         $options
     *
     * @return \stdClass
     */
    public function serialize($matchQuestion, array $options = [])
    {
        $questionData = new \stdClass();

        $questionData->random = $matchQuestion->getShuffle();
        $questionData->penalty = $matchQuestion->getPenalty();

        $firstSet = array_map(function (Proposal $proposal) use ($options) {
            $itemData = $this->contentSerializer->serialize($proposal, $options);
            $itemData->id = $proposal->getUuid();

            return $itemData;
        }, $matchQuestion->getProposals()->toArray());

        $secondSet = array_map(function (Label $label) use ($options) {
            $itemData = $this->contentSerializer->serialize($label, $options);
            $itemData->id = $label->getUuid();

            return $itemData;
        }, $matchQuestion->getLabels()->toArray());

        if ($matchQuestion->getShuffle() && in_array(Transfer::SHUFFLE_ANSWERS, $options)) {
            shuffle($firstSet);
            shuffle($secondSet);
        }

        $questionData->firstSet = $firstSet;
        $questionData->secondSet = $secondSet;

        if (in_array(Transfer::INCLUDE_SOLUTIONS, $options)) {
            $questionData->solutions = $this->serializeSolutions($matchQuestion);
        }

        return $questionData;
    }

    private function serializeSolutions(MatchQuestion $matchQuestion)
    {
        $solutions = [];

        foreach ($matchQuestion->getProposals() as $proposal) {
            /** @var Label $label */
            foreach ($proposal->getExpectedLabels() as $label) {
                $solutionData = new \stdClass();
                $solutionData->firstId = $proposal->getUuid();
                $solutionData->secondId = $label->getUuid();
                $solutionData->score = $label->getScore();

                if ($label->getFeedback()) {
                    $solutionData->feedback = $label->getFeedback();
                }

                $solutions[] = $solutionData;
            }
        }

        return $solutions;
    }

    /**
     * Converts raw data into a Match question entity.
     *
     * @param \stdClass     $data
     * @param MatchQuestion $matchQuestion
     * @param array         $options
     *
     * @return MatchQuestion
     */
    public function deserialize($data, $matchQuestion = null, array $options = [])
    {
        if (empty($matchQuestion)) {
            $matchQuestion = new MatchQuestion();
        }

        if (!empty($data->penalty) || 0 === $data->penalty) {
            $matchQuestion->setPenalty($data->penalty);
        }

        if (isset($data->random)) {
            $matchQuestion->setShuffle($data->random);
        }

        // deserialize firstSets, secondSets and solutions
        // labels first since we gonna need them for proposals deserialisation
        $this->deserializeLabels($matchQuestion, $data->secondSet, $data->solutions);
        $this->deserializeProposals($matchQuestion, $data->firstSet, $data->solutions);

        return $matchQuestion;
    }

    /**
     * Deserializes Question labels.
     *
     * @param MatchQuestion $matchQuestion
     * @param array         $secondSets    ie labels
     * @param array         $solutions
     */
    private function deserializeLabels(MatchQuestion $matchQuestion, array $secondSets, array $solutions)
    {
        $secondSetEntities = $matchQuestion->getLabels()->toArray();

        foreach ($secondSets as $index => $secondSetData) {
            $label = null;
            // Searches for an existing Label entity.
            foreach ($secondSetEntities as $entityIndex => $entityLabel) {
                /** @var Label $entityLabel */
                if ($entityLabel->getUuid() === $secondSetData->id) {
                    $label = $entityLabel;
                    unset($secondSetEntities[$entityIndex]);
                    break;
                }
            }

            if (null === $label) {
                // Create a new Label
                $label = new Label();
                $label->setUuid($secondSetData->id);
            }

            $label->setOrder($index);

            // Deserialize firstSet content
            $label = $this->contentSerializer->deserialize($secondSetData, $label);

            // Set firstSet score and feedback
            $label->setScore(0);
            foreach ($solutions as $solution) {
                if ($solution->secondId === $secondSetData->id) {
                    $label->setScore($solution->score);
                    if (isset($solution->feedback)) {
                        $label->setFeedback($solution->feedback);
                    }

                    break;
                }
            }

            $matchQuestion->addLabel($label);
        }

        // Remaining labels are no longer in the Question
        foreach ($secondSetEntities as $labelToRemove) {
            $matchQuestion->removeLabel($labelToRemove);
        }
    }

    /**
     * Deserializes Question proposals.
     *
     * @param MatchQuestion $matchQuestion
     * @param array         $firstSets     ie proposals
     * @param array         $solutions
     */
    private function deserializeProposals(MatchQuestion $matchQuestion, array $firstSets, array $solutions)
    {
        $firstSetEntities = $matchQuestion->getProposals()->toArray();

        foreach ($firstSets as $index => $firstSetData) {
            $proposal = null;

            // Search for an existing Proposal entity.
            foreach ($firstSetEntities as $entityIndex => $entityProposal) {
                /* @var Label $entityProposal */
                if ($entityProposal->getUuid() === $firstSetData->id) {
                    $proposal = $entityProposal;

                    unset($firstSetEntities[$entityIndex]);
                    break;
                }
            }

            if (null === $proposal) {
                // Create a new Proposal
                $proposal = new Proposal();
                $proposal->setUuid($firstSetData->id);
            }

            $proposal->setOrder($index);

            // Deserialize proposal content
            $proposal = $this->contentSerializer->deserialize($firstSetData, $proposal);

            // get existing expected labels
            $expectedLabelsEntities = $proposal->getExpectedLabels()->toArray();

            // handle current solutions Set proposal and expected label (join table)
            foreach ($solutions as $solution) {
                if ($solution->firstId === $firstSetData->id) {
                    $expected = null;
                    /* @var Label $expectedEntity */
                    foreach ($expectedLabelsEntities as $index => $expectedEntity) {
                        // only check for secondId since firstId is checked before
                        if ($expectedEntity->getUuId() === $solution->secondId) {
                            $expected = $expectedEntity;
                            unset($expectedLabelsEntities[$index]);

                            break;
                        }
                    }

                    if (null === $expected) {
                        // find label
                        foreach ($matchQuestion->getLabels() as $label) {
                            // compare with uuid
                            if ($label->getUuid() === $solution->secondId) {
                                $expected = $label;
                                $proposal->addExpectedLabel($expected);
                                break;
                            }
                        }
                    }
                }
            }

            // Remaining expected labels are no longer in the solutions
            foreach ($expectedLabelsEntities as $expectedToRemove) {
                $proposal->removeExpectedLabel($expectedToRemove);
            }
            $matchQuestion->addProposal($proposal);
        }

        // Remaining proposals are no longer in the Question
        foreach ($firstSetEntities as $proposalToRemove) {
            $matchQuestion->removeProposal($proposalToRemove);
        }
    }
}
