<?php

namespace UJM\ExoBundle\Serializer;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Step;
use UJM\ExoBundle\Library\Mode\CorrectionMode;
use UJM\ExoBundle\Library\Mode\MarkMode;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;

/**
 * Serializer for step data.
 *
 * @DI\Service("ujm_exo.serializer.exercise")
 */
class ExerciseSerializer implements SerializerInterface
{
    /**
     * @var StepSerializer
     */
    private $stepSerializer;

    /**
     * ExerciseSerializer constructor.
     *
     * @param StepSerializer $stepSerializer
     *
     * @DI\InjectParams({
     *     "stepSerializer" = @DI\Inject("ujm_exo.serializer.step")
     * })
     */
    public function __construct(StepSerializer $stepSerializer)
    {
        $this->stepSerializer = $stepSerializer;
    }

    /**
     * Converts an Exercise into a JSON-encodable structure.
     *
     * @param Exercise $exercise
     * @param array    $options
     *
     * @return \stdClass
     */
    public function serialize($exercise, array $options = [])
    {
        $node = $exercise->getResourceNode();

        $exerciseData = new \stdClass();
        $exerciseData->id = $exercise->getUuid();
        $exerciseData->title = $node->getName();

        if (!empty($exercise->getDescription())) {
            $exerciseData->description = $exercise->getDescription();
        }

        $exerciseData->meta = $this->serializeMetadata($exercise);

        if (empty($options['minimal']) || !$options['minimal']) {
            $exerciseData->parameters = $this->serializeParameters($exercise);
            $exerciseData->steps = $this->serializeSteps($exercise, $options);
        }

        return $exerciseData;
    }

    /**
     * Converts raw data into an Exercise entity.
     *
     * @param \stdClass $data
     * @param Exercise  $exercise
     * @param array     $options
     *
     * @return Exercise
     */
    public function deserialize($data, $exercise = null, array $options = [])
    {
        if (empty($exercise)) {
            $exercise = new Exercise();
        }

        $exercise->setUuid($data->id);

        // Update ResourceNode
        $node = $exercise->getResourceNode();
        if (!empty($node)) {
            $node->setName($data->title);
        }

        if (isset($data->description)) {
            $exercise->setDescription($data->description);
        }

        if (!empty($data->parameters)) {
            $this->deserializeParameters($exercise, $data->parameters);
        }

        if (!empty($data->steps)) {
            $this->deserializeSteps($exercise, $data->steps, $options);
        }

        return $exercise;
    }

    /**
     * Serializes Exercise metadata.
     *
     * @param Exercise $exercise
     *
     * @return \stdClass
     */
    private function serializeMetadata(Exercise $exercise)
    {
        $metadata = new \stdClass();

        $node = $exercise->getResourceNode();

        $creator = $node->getCreator();
        if ($creator) {
            $author = new \stdClass();
            $author->name = sprintf('%s %s', $creator->getFirstName(), $creator->getLastName());

            $metadata->authors = [$author];
        }

        $metadata->created = $node->getCreationDate()->format('Y-m-d\TH:i:s');
        $metadata->updated = $node->getModificationDate()->format('Y-m-d\TH:i:s');
        $metadata->published = $node->isPublished();
        $metadata->publishedOnce = $exercise->wasPublishedOnce();

        return $metadata;
    }

    /**
     * Serializes Exercise parameters.
     *
     * @param Exercise $exercise
     *
     * @return \stdClass
     */
    private function serializeParameters(Exercise $exercise)
    {
        $parameters = new \stdClass();

        switch ($exercise->getType()) {
            case Exercise::TYPE_EVALUATIVE:
                $parameters->type = 'evaluative';
                break;
            case Exercise::TYPE_FORMATIVE:
                $parameters->type = 'formative';
                break;
            case Exercise::TYPE_SUMMATIVE:
                $parameters->type = 'summative';
                break;
        }

        $parameters->random = $exercise->getShuffle();
        $parameters->pick = $exercise->getPickSteps();
        $parameters->draw = $exercise->getKeepSteps() ? 'once' : 'attempt';
        $parameters->maxAttempts = $exercise->getMaxAttempts();
        $parameters->interruptible = $exercise->getDispButtonInterrupt();
        $parameters->showMetadata = $exercise->isMetadataVisible();
        $parameters->showStatistics = $exercise->hasStatistics();
        $parameters->showFullCorrection = !$exercise->isMinimalCorrection();
        $parameters->anonymous = $exercise->getAnonymous();
        $parameters->duration = $exercise->getDuration();

        switch ($exercise->getMarkMode()) {
            case MarkMode::AFTER_END:
                $parameters->showScoreAt = 'validation';
                break;
            case MarkMode::WITH_CORRECTION:
                $parameters->showScoreAt = 'correction';
                break;
            case MarkMode::NEVER:
                $parameters->showScoreAt = 'never';
                break;
        }

        switch ($exercise->getCorrectionMode()) {
            case CorrectionMode::AFTER_END:
                $parameters->showCorrectionAt = 'validation';
                break;
            case CorrectionMode::AFTER_LAST_ATTEMPT:
                $parameters->showCorrectionAt = 'lastAttempt';
                break;
            case CorrectionMode::AFTER_DATE:
                $parameters->showCorrectionAt = 'date';
                break;
            case CorrectionMode::NEVER:
                $parameters->showCorrectionAt = 'never';
                break;
        }

        $correctionDate = $exercise->getDateCorrection();
        $parameters->correctionDate = !empty($correctionDate) ? $correctionDate->format('Y-m-d\TH:i:s') : null;

        return $parameters;
    }

    /**
     * Deserializes Exercise parameters.
     *
     * @param Exercise  $exercise
     * @param \stdClass $parameters
     */
    private function deserializeParameters(Exercise $exercise, \stdClass $parameters)
    {
        $exercise->setType($parameters->type);
        $exercise->setPickSteps($parameters->pick);
        $exercise->setShuffle($parameters->random);

        if ('once' === $parameters->draw) {
            $exercise->setKeepSteps(true);
        } else {
            $exercise->setKeepSteps(false);
        }

        $exercise->setMaxAttempts($parameters->maxAttempts);
        $exercise->setDispButtonInterrupt($parameters->interruptible);
        $exercise->setMetadataVisible($parameters->showMetadata);
        $exercise->setAnonymous($parameters->anonymous);
        $exercise->setDuration($parameters->duration);
        $exercise->setStatistics($parameters->showStatistics);
        $exercise->setMinimalCorrection(!$parameters->showFullCorrection);

        switch ($parameters->showScoreAt) {
            case 'validation':
                $exercise->setMarkMode(MarkMode::AFTER_END);
                break;
            case 'correction':
                $exercise->setMarkMode(MarkMode::WITH_CORRECTION);
                break;
            case 'never':
                $exercise->setMarkMode(MarkMode::NEVER);
                break;
        }

        $correctionDate = null;
        switch ($parameters->showCorrectionAt) {
            case 'validation':
                $exercise->setCorrectionMode(CorrectionMode::AFTER_END);
                break;
            case 'lastAttempt':
                $exercise->setCorrectionMode(CorrectionMode::AFTER_LAST_ATTEMPT);
                break;
            case 'date':
                $exercise->setCorrectionMode(CorrectionMode::AFTER_DATE);
                $correctionDate = \DateTime::createFromFormat('Y-m-d\TH:i:s', $parameters->correctionDate);
                break;
            case 'never':
                $exercise->setCorrectionMode(CorrectionMode::NEVER);
                break;
        }

        $exercise->setDateCorrection($correctionDate);
    }

    /**
     * Serializes Exercise steps.
     * Forwards the step serialization to StepSerializer.
     *
     * @param Exercise $exercise
     * @param array    $options
     *
     * @return array
     */
    private function serializeSteps(Exercise $exercise, array $options = [])
    {
        $steps = $exercise->getSteps()->toArray();

        return array_map(function (Step $step) use ($options) {
            return $this->stepSerializer->serialize($step, $options);
        }, $steps);
    }

    /**
     * Deserializes Exercise steps.
     * Forwards the step deserialization to StepSerializer.
     *
     * @param Exercise $exercise
     * @param array    $steps
     * @param array    $options
     */
    private function deserializeSteps(Exercise $exercise, array $steps = [], array $options = [])
    {
        $stepEntities = $exercise->getSteps()->toArray();

        foreach ($steps as $index => $stepData) {
            $existingStep = null;

            // Searches for an existing step entity.
            foreach ($stepEntities as $entityIndex => $entityStep) {
                /** @var Step $entityStep */
                if ($entityStep->getUuid() === $stepData->id) {
                    $existingStep = $entityStep;
                    unset($stepEntities[$entityIndex]);
                    break;
                }
            }

            $step = $this->stepSerializer->deserialize($stepData, $existingStep, $options);
            // Set order in Exercise
            $step->setOrder($index);

            if (empty($existingStep)) {
                // Creation of a new step (we need to link it to the Exercise)
                $exercise->addStep($step);
            }
        }

        // Remaining steps are no longer in the Exercise
        if (0 < count($stepEntities)) {
            foreach ($stepEntities as $stepToRemove) {
                $exercise->removeStep($stepToRemove);
            }
        }
    }
}
