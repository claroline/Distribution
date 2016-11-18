<?php

namespace UJM\ExoBundle\Manager;

use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Step;
use UJM\ExoBundle\Library\Mode\CorrectionMode;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Library\Options\Validation;
use UJM\ExoBundle\Serializer\ExerciseSerializer;
use UJM\ExoBundle\Library\Validator\ValidationException;
use UJM\ExoBundle\Transfer\Json\Validator;
use UJM\ExoBundle\Validator\JsonSchema\ExerciseValidator;

/**
 * @DI\Service("ujm.exo.exercise_manager")
 */
class ExerciseManager
{
    /**
     * @var ObjectManager
     */
    private $om;

    /**
     * @deprecated use $validator instead
     *
     * @var Validator
     */
    private $oldValidator;

    /**
     * @var ExerciseValidator
     */
    private $validator;

    /**
     * @var ExerciseSerializer
     */
    private $serializer;

    /**
     * @deprecated
     *
     * @var StepManager
     */
    private $stepManager;

    /**
     * @DI\InjectParams({
     *     "om"           = @DI\Inject("claroline.persistence.object_manager"),
     *     "validator"    = @DI\Inject("ujm_exo.validator.exercise"),
     *     "oldValidator" = @DI\Inject("ujm.exo.json_validator"),
     *     "serializer"   = @DI\Inject("ujm_exo.serializer.exercise"),
     *     "stepManager"  = @DI\Inject("ujm.exo.step_manager")
     * })
     *
     * @param ObjectManager      $om
     * @param ExerciseValidator  $validator
     * @param Validator          $oldValidator
     * @param ExerciseSerializer $serializer
     * @param StepManager        $stepManager
     */
    public function __construct(
        ObjectManager $om,
        ExerciseValidator $validator,
        Validator $oldValidator,
        ExerciseSerializer $serializer,
        StepManager $stepManager)
    {
        $this->om = $om;
        $this->validator = $validator;
        $this->oldValidator = $oldValidator;
        $this->serializer = $serializer;
        $this->stepManager = $stepManager;
    }

    /**
     * Validates and creates a new Exercise from raw data.
     *
     * @param \stdClass $data
     *
     * @return Exercise
     *
     * @throws ValidationException
     */
    public function create(\stdClass $data)
    {
        return $this->update(new Exercise(), $data);
    }

    /**
     * Validates and updates an Exercise entity with raw data.
     *
     * @param Exercise  $exercise
     * @param \stdClass $data
     *
     * @return Exercise
     *
     * @throws ValidationException
     */
    public function update(Exercise $exercise, \stdClass $data)
    {
        // Validate received data
        $errors = $this->validator->validate($data, [Validation::REQUIRE_SOLUTIONS]);
        if (count($errors) > 0) {
            throw new ValidationException('Exercise is not valid', $errors);
        }

        // Update Exercise with new data
        $this->serializer->deserialize($data, $exercise);

        // Save to DB
        $this->om->persist($exercise);
        $this->om->flush();

        return $exercise;
    }

    /**
     * Exports an Exercise.
     *
     * @param Exercise $exercise
     * @param array    $options
     *
     * @return \stdClass
     */
    public function export(Exercise $exercise, array $options = [])
    {
        return $this->serializer->serialize($exercise, $options);
    }

    /**
     * Creates a copy of an Exercise.
     *
     * @param Exercise $exercise
     *
     * @return Exercise
     */
    public function copy(Exercise $exercise)
    {
        $exerciseData = $this->serializer->serialize($exercise, [Transfer::INCLUDE_SOLUTIONS]);

        // Remove UUID to force the generation of a new one
        $exerciseData->id = '';

        return $this->create($exerciseData);
    }

    /**
     * Checks if an Exercise can be deleted.
     * The exercise needs to have no paper to be safely removed.
     *
     * @param Exercise $exercise
     *
     * @return bool
     */
    public function isDeletable(Exercise $exercise)
    {
        $nbPapers = $this->om->getRepository('UJMExoBundle:Paper')->countExercisePapers($exercise);
        if (0 !== $nbPapers) {
            return false;
        }

        return true;
    }

    /**
     * Create and add a new Step to an Exercise.
     *
     * @deprecated not used anymore in the new update system
     *
     * @param Exercise $exercise
     *
     * @return Step
     */
    public function addStep(Exercise $exercise)
    {
        $step = new Step();
        $step->setOrder($exercise->getSteps()->count() + 1);

        // Link the Step to the Exercise
        $exercise->addStep($step);

        $this->om->persist($step);
        $this->om->flush();

        return $step;
    }

    /**
     * Publishes an exercise.
     *
     * @param Exercise $exercise
     * @param bool     $throwException Throw an exception if the Exercise is already published
     *
     * @throws \LogicException if the exercise is already published
     */
    public function publish(Exercise $exercise, $throwException = true)
    {
        if ($throwException && $exercise->getResourceNode()->isPublished()) {
            throw new \LogicException("Exercise {$exercise->getId()} is already published");
        }

        if (!$exercise->wasPublishedOnce()) {
            $this->deletePapers($exercise);
            $exercise->setPublishedOnce(true);
        }

        $exercise->getResourceNode()->setPublished(true);
        $this->om->flush();
    }

    /**
     * Unpublishes an exercise.
     *
     * @param Exercise $exercise
     * @param bool     $throwException Throw an exception if the Exercise is not published
     *
     * @throws \LogicException if the exercise is not published
     */
    public function unpublish(Exercise $exercise, $throwException = true)
    {
        if ($throwException && !$exercise->getResourceNode()->isPublished()) {
            throw new \LogicException("Exercise {$exercise->getId()} is already unpublished");
        }

        $exercise->getResourceNode()->setPublished(false);
        $this->om->flush();
    }

    /**
     * Deletes all the papers associated with an exercise.
     *
     * @todo optimize request number using repository method(s)
     *
     * @param Exercise $exercise
     *
     * @throws \Exception if the exercise has been published at least once
     */
    public function deletePapers(Exercise $exercise)
    {
        if ($exercise->wasPublishedOnce()) {
            throw new \Exception(
                "Cannot delete exercise {$exercise->getId()} papers as it has been published at least once"
            );
        }

        $paperRepo = $this->om->getRepository('UJMExoBundle:Paper');
        $linkHintPaperRepo = $this->om->getRepository('UJMExoBundle:LinkHintPaper');
        $responseRepo = $this->om->getRepository('UJMExoBundle:Response');
        $papers = $paperRepo->findByExercise($exercise);

        foreach ($papers as $paper) {
            $links = $linkHintPaperRepo->findByPaper($paper);

            foreach ($links as $link) {
                $this->om->remove($link);
            }

            $responses = $responseRepo->findByPaper($paper);

            foreach ($responses as $response) {
                $this->om->remove($response);
            }

            $this->om->remove($paper);
        }

        $this->om->flush();
    }

    /**
     * Exports an exercise in a JSON-encodable format.
     *
     * @deprecated use export() instead
     *
     * @param Exercise $exercise
     * @param bool     $withSolutions
     *
     * @return array
     */
    public function exportExercise(Exercise $exercise, $withSolutions = true)
    {
        if ($exercise->getType() === $exercise::TYPE_FORMATIVE) {
            $withSolutions = true;
        }

        return [
            'id' => $exercise->getId(),
            'meta' => $this->exportMetadata($exercise),
            'steps' => $this->exportSteps($exercise, $withSolutions),
        ];
    }

    /**
     * Update the Exercise metadata.
     *
     * @deprecated use update() instead
     *
     * @param Exercise  $exercise
     * @param \stdClass $metadata
     *
     * @throws ValidationException
     */
    public function updateMetadata(Exercise $exercise, \stdClass $metadata)
    {
        $errors = $this->oldValidator->validateExerciseMetadata($metadata);

        if (count($errors) > 0) {
            throw new ValidationException('Exercise metadata are not valid', $errors);
        }

        // Update ResourceNode
        $node = $exercise->getResourceNode();
        $node->setName($metadata->title);

        // Update Exercise
        $exercise->setDescription($metadata->description);
        $exercise->setType($metadata->type);
        $exercise->setPickSteps($metadata->pick ? $metadata->pick : 0);
        $exercise->setShuffle($metadata->random);
        $exercise->setKeepSteps($metadata->keepSteps);
        $exercise->setMaxAttempts($metadata->maxAttempts);
        $exercise->setDispButtonInterrupt($metadata->dispButtonInterrupt);
        $exercise->setMetadataVisible($metadata->metadataVisible);
        $exercise->setMarkMode($metadata->markMode);
        $exercise->setCorrectionMode($metadata->correctionMode);
        $exercise->setAnonymous($metadata->anonymous);
        $exercise->setDuration($metadata->duration);
        $exercise->setStatistics($metadata->statistics ? true : false);
        $exercise->setMinimalCorrection($metadata->minimalCorrection ? true : false);

        $correctionDate = null;
        if (!empty($metadata->correctionDate) && CorrectionMode::AFTER_DATE === $metadata->correctionMode) {
            $correctionDate = \DateTime::createFromFormat('Y-m-d\TH:i:s', $metadata->correctionDate);
        }

        $exercise->setDateCorrection($correctionDate);

        // Save to DB
        $this->om->persist($exercise);
        $this->om->flush();
    }

    /**
     * Export metadata of the Exercise in a JSON-encodable format.
     *
     * @deprecated see export()
     *
     * @param Exercise $exercise
     *
     * @return array
     */
    private function exportMetadata(Exercise $exercise)
    {
        $node = $exercise->getResourceNode();
        $creator = $node->getCreator();
        $authorName = sprintf('%s %s', $creator->getFirstName(), $creator->getLastName());

        // Accessibility dates
        $startDate = $node->getAccessibleFrom() ? $node->getAccessibleFrom()->format('Y-m-d\TH:i:s') : null;
        $endDate = $node->getAccessibleUntil() ? $node->getAccessibleUntil()->format('Y-m-d\TH:i:s') : null;
        $correctionDate = $exercise->getDateCorrection() ? $exercise->getDateCorrection()->format('Y-m-d\TH:i:s') : null;

        return [
            'authors' => [
                ['name' => $authorName],
            ],
            'created' => $node->getCreationDate()->format('Y-m-d\TH:i:s'),
            'title' => $node->getName(),
            'description' => $exercise->getDescription(),
            'type' => $exercise->getType(),
            'pick' => $exercise->getPickSteps(),
            'random' => $exercise->getShuffle(),
            'keepSteps' => $exercise->getKeepSteps(),
            'maxAttempts' => $exercise->getMaxAttempts(),
            'dispButtonInterrupt' => $exercise->getDispButtonInterrupt(),
            'metadataVisible' => $exercise->isMetadataVisible(),
            'statistics' => $exercise->hasStatistics(),
            'anonymous' => $exercise->getAnonymous(),
            'duration' => $exercise->getDuration(),
            'markMode' => $exercise->getMarkMode(),
            'correctionMode' => $exercise->getCorrectionMode(),
            'correctionDate' => $correctionDate,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'published' => $node->isPublished(),
            'publishedOnce' => $exercise->wasPublishedOnce(),
            'minimalCorrection' => $exercise->isMinimalCorrection(),
        ];
    }

    /**
     * Export exercise with steps with questions.
     *
     * @deprecated see export()
     *
     * @param Exercise $exercise
     * @param bool     $withSolutions
     *
     * @return array
     */
    public function exportSteps(Exercise $exercise, $withSolutions = true)
    {
        $steps = $exercise->getSteps();

        $data = [];
        foreach ($steps as $step) {
            $data[] = $this->stepManager->exportStep($step, $withSolutions);
        }

        return $data;
    }
}
