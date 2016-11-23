<?php

namespace UJM\ExoBundle\Manager;

use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Library\Options\Validation;
use UJM\ExoBundle\Manager\Attempt\PaperManager;
use UJM\ExoBundle\Serializer\ExerciseSerializer;
use UJM\ExoBundle\Library\Validator\ValidationException;
use UJM\ExoBundle\Validator\JsonSchema\ExerciseValidator;

/**
 * @DI\Service("ujm_exo.manager.exercise")
 */
class ExerciseManager
{
    /**
     * @var ObjectManager
     */
    private $om;

    /**
     * @var ExerciseValidator
     */
    private $validator;

    /**
     * @var ExerciseSerializer
     */
    private $serializer;

    /**
     * @var PaperManager
     */
    private $paperManager;

    /**
     * ExerciseManager constructor.
     * 
     * @DI\InjectParams({
     *     "om"           = @DI\Inject("claroline.persistence.object_manager"),
     *     "validator"    = @DI\Inject("ujm_exo.validator.exercise"),
     *     "serializer"   = @DI\Inject("ujm_exo.serializer.exercise"),
     *     "paperManager"   = @DI\Inject("ujm_exo.manager.paper")
     * })
     *
     * @param ObjectManager      $om
     * @param ExerciseValidator  $validator
     * @param ExerciseSerializer $serializer
     * @param PaperManager $paperManager
     */
    public function __construct(
        ObjectManager $om,
        ExerciseValidator $validator,
        ExerciseSerializer $serializer,
        PaperManager $paperManager)
    {
        $this->om = $om;
        $this->validator = $validator;
        $this->serializer = $serializer;
        $this->paperManager = $paperManager;
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
     * The exercise needs to be unpublished or have no paper to be safely removed.
     *
     * @param Exercise $exercise
     *
     * @return bool
     */
    public function isDeletable(Exercise $exercise)
    {
        return !$exercise->getResourceNode()->isPublished()
            || 0 === $this->paperManager->countExercisePapers($exercise);
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
            $this->paperManager->deleteAll($exercise);
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
            throw new \LogicException(
                "Exercise {$exercise->getId()} is already unpublished"
            );
        }

        $exercise->getResourceNode()->setPublished(false);
        $this->om->flush();
    }
}
