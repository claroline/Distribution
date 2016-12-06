<?php

namespace UJM\ExoBundle\Library\Attempt;

use Claroline\CoreBundle\Entity\User;
use UJM\ExoBundle\Entity\Attempt\Paper;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Step;
use UJM\ExoBundle\Entity\StepQuestion;
use UJM\ExoBundle\Library\Options\Recurrence;

/**
 * PaperGenerator creates new paper instances for attempts to exercises.
 * It takes into account the exercise and steps configuration to create the correct attempt structure.
 */
class PaperGenerator
{
    /**
     * Creates a paper for a new attempt.
     *
     * @param Exercise $exercise      - the exercise tried
     * @param User     $user          - the user who wants to pass the exercise
     * @param Paper    $previousPaper - the previous paper if one exists
     *
     * @return Paper
     */
    public static function create(Exercise $exercise, User $user = null, Paper $previousPaper = null)
    {
        // Create the new Paper entity
        $paper = new Paper();
        $paper->setExercise($exercise);
        $paper->setUser($user);
        $paper->setAnonymized($exercise->getAnonymizeAttempts());

        // Get the number of the new Paper
        $paperNum = (null === $previousPaper) ? 1 : $previousPaper->getNumber() + 1;
        $paper->setNumber($paperNum);

        // Generate the structure of the new paper
        $structure = static::generateStructure($exercise, $previousPaper);
        $paper->setStructure(json_encode($structure));

        return $paper;
    }

    /**
     * Generates the structure of the attempt based on Exercise and Steps parameters.
     *
     * @param Exercise $exercise
     * @param Paper    $previousPaper
     *
     * @return array
     */
    private static function generateStructure(Exercise $exercise, Paper $previousPaper = null)
    {
        // The structure of the previous paper if any
        $previousStructure = [];
        if (!empty($previousPaper)) {
            $previousStructure = json_decode($previousPaper->getStructure());
        }

        // Generate the list of Steps for the Paper
        if (!empty($previousPaper) && Recurrence::ONCE === $exercise->getRandomPick()) {
            // Get picked steps from the last user Paper
            $pickedSteps = static::repickSteps($exercise, $previousStructure);
        } else {
            // Pick a new set of steps
            $pickedSteps = static::pick(
                $exercise->getSteps()->toArray(),
                $exercise->getPick()
            );
        }

        // Recalculate order of the steps based on the configuration
        // if we don't want to keep the one from the previous paper
        if (empty($previousPaper) || Recurrence::ONCE !== $exercise->getRandomOrder()) {
            if (Recurrence::NEVER === $exercise->getRandomOrder()) {
                // Make sure the steps are in the original order
                usort($pickedSteps, function (Step $a, Step $b) {
                    if ($a->getOrder() === $b->getOrder()) {
                        return 0;
                    }

                    return ($a->getOrder() < $b->getOrder()) ? -1 : 1;
                });
            } elseif (Recurrence::ALWAYS === $exercise->getRandomOrder()) {
                // Shuffle steps
                shuffle($pickedSteps);
            }
        }

        // Pick questions for each steps and generate structure
        $structure = array_map(function (Step $pickedStep) use ($previousPaper, $previousStructure) {
            $stepData = new \stdClass();
            $stepData->id = $pickedStep->getUuid();

            if (!empty($previousPaper) && Recurrence::ONCE === $pickedStep->getRandomPick()) {
                // Order the step collection based on the configuration
                // Reload question entities
                $pickedQuestions = static::repickQuestions($pickedStep, $previousStructure);
            } else {
                // Pick a new set of questions
                $pickedQuestions = static::pick(
                    $pickedStep->getStepQuestions()->toArray(),
                    $pickedStep->getPick()
                );
            }

            // Recalculate order of the questions based on the configuration
            // if we don't want to keep the one from the previous paper
            if (empty($previousPaper) || Recurrence::ONCE !== $pickedStep->getRandomOrder()) {
                if (Recurrence::NEVER === $pickedStep->getRandomOrder()) {
                    // Make sure the questions are in the original order
                    usort($pickedQuestions, function (StepQuestion $a, StepQuestion $b) {
                        if ($a->getOrder() === $b->getOrder()) {
                            return 0;
                        }

                        return ($a->getOrder() < $b->getOrder()) ? -1 : 1;
                    });
                } elseif (Recurrence::ALWAYS === $pickedStep->getRandomOrder()) {
                    // Shuffle questions
                    shuffle($pickedQuestions);
                }
            }

            // Grabs only questions UUIDs
            $stepData->items = array_map(function (StepQuestion $stepQuestion) {
                return $stepQuestion->getQuestion()->getUuid();
            }, $pickedQuestions);

            return $stepData;
        }, $pickedSteps);

        return $structure;
    }

    /**
     * Gets a subset of steps in the exercise based on a previously generated paper structure.
     *
     * @param Exercise $exercise
     * @param array    $previousStructure
     *
     * @return Step[]
     */
    private static function repickSteps(Exercise $exercise, array $previousStructure = [])
    {
        $pickedSteps = [];
        foreach ($previousStructure as $previousStep) {
            // Checks that all steps still exist in the exercise
            $stepEntity = $exercise->getStep($previousStep->id);
            if (null !== $stepEntity) {
                $pickedSteps[] = $stepEntity;
            }
        }

        return $pickedSteps;
    }

    /**
     * Gets a subset of questions in the step based on a previously generated paper structure.
     *
     * @param Step  $step
     * @param array $previousStructure
     *
     * @return StepQuestion[]
     */
    private static function repickQuestions(Step $step, array $previousStructure = [])
    {
        // Find the step in the previous structure and get the list of associated questions
        $previousQuestions = [];
        foreach ($previousStructure as $previousStep) {
            if ($step->getUuid() === $previousStep->id) {
                $previousQuestions = $previousStep->items;
                break;
            }
        }

        // Get StepQuestions entity and filter the one that no longer exist
        $pickedQuestions = [];
        foreach ($previousQuestions as $questionId) {
            foreach ($step->getStepQuestions() as $stepQuestion) {
                if ($stepQuestion->getQuestion()->getUuid() === $questionId) {
                    $pickedQuestions[] = $stepQuestion;
                    break;
                }
            }
        }

        return $pickedQuestions;
    }

    /**
     * Picks a subset of items in an array.
     *
     * @param array $collection - the original collection
     * @param int   $count      - the number of items to pick in the collection (if 0, the whole collection is returned)
     *
     * @return array - the truncated collection
     */
    private static function pick(array $collection, $count = 0)
    {
        if (count($collection) < $count) {
            throw new \LogicException("Cannot pick more elements ({$count}) than there are in the collection.");
        }

        $picked = [];
        if (0 !== $count) {
            $randomSelect = array_rand($collection, $count);
            foreach ($randomSelect as $randomIndex) {
                $picked[] = $collection[$randomIndex];
            }
        } else {
            $picked = $collection;
        }

        return $picked;
    }
}
