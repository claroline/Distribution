<?php

namespace UJM\ExoBundle\Serializer\Question;

use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\AbstractInteraction;
use UJM\ExoBundle\Entity\Hint;
use UJM\ExoBundle\Entity\Question;
use UJM\ExoBundle\Entity\QuestionObject;
use UJM\ExoBundle\Entity\QuestionResource;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;
use UJM\ExoBundle\Repository\QuestionRepository;
use UJM\ExoBundle\Serializer\HintSerializer;
use UJM\ExoBundle\Serializer\ResourceContentSerializer;

/**
 * Serializer for question data.
 *
 * @DI\Service("ujm_exo.serializer.question")
 */
class QuestionSerializer implements SerializerInterface
{
    /**
     * @var ObjectManager
     */
    private $om;

    /**
     * @var QuestionSerializerCollector
     */
    private $serializerCollector;

    /**
     * @var HintSerializer
     */
    private $hintSerializer;

    /**
     * @var ResourceContentSerializer
     */
    private $resourceContentSerializer;

    /**
     * QuestionSerializer constructor.
     *
     * @param ObjectManager               $om
     * @param QuestionSerializerCollector $serializerCollector
     * @param HintSerializer              $hintSerializer
     * @param ResourceContentSerializer   $resourceContentSerializer
     *
     * @DI\InjectParams({
     *     "om"                        = @DI\Inject("claroline.persistence.object_manager"),
     *     "serializerCollector"       = @DI\Inject("ujm_exo.serializer.question_collector"),
     *     "hintSerializer"            = @DI\Inject("ujm_exo.serializer.hint"),
     *     "resourceContentSerializer" = @DI\Inject("ujm_exo.serializer.resource_content")
     * })
     */
    public function __construct(
        ObjectManager $om,
        QuestionSerializerCollector $serializerCollector,
        HintSerializer $hintSerializer,
        ResourceContentSerializer $resourceContentSerializer)
    {
        $this->om = $om;
        $this->serializerCollector = $serializerCollector;
        $this->hintSerializer = $hintSerializer;
        $this->resourceContentSerializer = $resourceContentSerializer;
    }

    /**
     * Converts a Question into a JSON-encodable structure.
     *
     * @param Question $question
     * @param array    $options
     *
     * @return \stdClass
     */
    public function serialize($question, array $options = [])
    {
        // Serialize specific data for the question type
        $questionData = $this->serializeQuestionType($question, $options);

        $questionData->meta = $this->serializeMetadata($question, $options);

        // Add generic question information
        $questionData->id = (string) $question->getId();
        $questionData->type = $question->getMimeType();
        $questionData->title = $question->getTitle();
        $questionData->description = $question->getDescription();
        $questionData->content = $question->getInvite();
        $questionData->info = $question->getSupplementary();
        $questionData->instruction = $question->getSpecification();

        // Serialize Hints
        if (0 !== $question->getHints()->count()) {
            $questionData->hints = $this->serializeHints($question, $options);
        }

        // Serialize Objects
        if (0 !== $question->getObjects()->count()) {
            $questionData->objects = $this->serializeObjects($question);
        }

        // Serialize Resources
        if (0 !== $question->getResources()->count()) {
            $questionData->resources = $this->serializeResources($question);
        }

        // Serialize feedback
        if (isset($options['includeSolutions']) && $options['includeSolutions'] && $question->getFeedback()) {
            $questionData->feedback = $question->getFeedback();
        }

        return $questionData;
    }

    /**
     * Converts raw data into a Question entity.
     *
     * @param \stdClass $data
     * @param array     $options
     *
     * @return Question
     */
    public function deserialize($data, array $options = [])
    {
        $question = !empty($options['entity']) ? $options['entity'] : new Question();

        $question->setMimeType($data->type);

        if (isset($data->title)) {
            $question->setTitle($data->title);
        }

        if (isset($data->description)) {
            $question->setDescription($data->description);
        }

        if (isset($data->content)) {
            $question->setInvite($data->content);
        }

        if (isset($data->info)) {
            $question->setSupplementary($data->info);
        }

        if (isset($data->instruction)) {
            $question->setSpecification($data->instruction);
        }

        if (!empty($data->hints)) {
            $this->deserializeHints($question, $data->hints);
        }

        if (!empty($data->objects)) {
            $this->deserializeObjects($question, $data->objects);
        }

        if (!empty($data->resources)) {
            $this->deserializeResources($question, $data->resources);
        }

        $this->deserializeQuestionType($question, $data, $options);

        return $question;
    }

    private function serializeQuestionType(Question $question, array $options = [])
    {
        /** @var SerializerInterface $typeSerializer */
        $typeSerializer = $this->serializerCollector->getHandlerForMimeType($question->getMimeType());

        /** @var AbstractInteraction $type */
        $type = $this->om->getRepository('UJMExoBundle:InteractionQCM')->findOneBy([
            'question' => $question,
        ]);

        return $typeSerializer->serialize($type, $options);
    }

    private function deserializeQuestionType(Question $question, \stdClass $data, array $options = [])
    {
        /** @var SerializerInterface $typeSerializer */
        $typeSerializer = $this->serializerCollector->getHandlerForMimeType($question->getMimeType());

        /** @var AbstractInteraction $type */
        $type = $this->om->getRepository('UJMExoBundle:InteractionQCM')->findOneBy([
            'question' => $question,
        ]);

        // Deserialize question type data
        $options['entity'] = $type;
        $type = $typeSerializer->deserialize($data, $options);
        $type->setQuestion($question);
    }

    /**
     * Serializes Question metadata.
     *
     * @param Question $question
     * @param array    $options
     *
     * @return \stdClass
     */
    private function serializeMetadata(Question $question, array $options = [])
    {
        $creator = $question->getUser();
        $author = new \stdClass();
        $author->name = sprintf('%s %s', $creator->getFirstName(), $creator->getLastName());

        $metadata = new \stdClass();
        $metadata->authors = [$author];
        $metadata->created = $question->getDateCreate()->format('Y-m-d\TH:i:s');
        $metadata->updated = $question->getDateModify()->format('Y-m-d\TH:i:s');

        if (isset($options['includeUsedBy']) && $options['includeUsedBy']) {
            // Includes the list of Exercises using this question
            /** @var QuestionRepository $questionRepo */
            $questionRepo = $this->om->getRepository('UJMExoBundle:Question');

            $metadata->usedBy = $questionRepo->findUsages($question);
        }

        return $metadata;
    }

    /**
     * Serializes Question hints.
     * Forwards the hint serialization to HintSerializer.
     *
     * @param Question $question
     * @param array    $options
     *
     * @return array
     */
    private function serializeHints(Question $question, array $options = [])
    {
        return array_map(function ($hint) use ($options) {
            return $this->hintSerializer->serialize($hint, $options);
        }, $question->getHints()->toArray());
    }

    /**
     * Deserializes Question hints.
     * Forwards the hint deserialization to HintSerializer.
     *
     * @param Question $question
     * @param array    $hints
     */
    private function deserializeHints(Question $question, array $hints = [])
    {
        $hintEntities = $question->getHints()->toArray();

        foreach ($hints as $hintData) {
            $existingHint = null;

            // Searches for an existing hint entity.
            foreach ($hintEntities as $entityIndex => $entityHint) {
                /** @var Hint $entityHint */
                if ((string) $entityHint->getId() === $hintData->id) {
                    $existingHint = $entityHint;
                    unset($hintEntities[$entityIndex]);
                    break;
                }
            }

            $entity = $this->hintSerializer->deserialize($hintData, !empty($existingHint) ? ['entity' => $existingHint] : []);

            if (empty($existingHint)) {
                // Creation of a new hint (we need to link it to the question)
                $question->addHint($entity);
            }
        }

        // Remaining hints are no longer in the Exercise
        if (0 < count($hintEntities)) {
            foreach ($hintEntities as $hintToRemove) {
                $question->removeHint($hintToRemove);
            }
        }
    }

    /**
     * Serializes Question objects.
     * Forwards the object serialization to ResourceContentSerializer.
     *
     * @param Question $question
     * @param array    $options
     *
     * @return array
     */
    private function serializeObjects(Question $question, array $options = [])
    {
        return array_map(function ($object) use ($options) {
            /* @var QuestionObject $object */
            return $this->resourceContentSerializer->serialize($object->getResourceNode(), $options);
        }, $question->getObjects()->toArray());
    }

    /**
     * Deserializes Question objects.
     *
     * @param Question $question
     * @param array    $objects
     */
    private function deserializeObjects(Question $question, array $objects = [])
    {
        $objectEntities = $question->getObjects()->toArray();

        foreach ($objects as $objectData) {
            $existingObject = null;

            // Searches for an existing object entity.
            foreach ($objectEntities as $entityIndex => $entityObject) {
                /** @var QuestionObject $entityObject */
                if ((string) $entityObject->getId() === $objectData->id) {
                    $existingObject = $entityObject;
                    unset($objectEntities[$entityIndex]);
                    break;
                }
            }

            // Link object to question
            if (empty($existingObject)) {
                $node = $this->resourceContentSerializer->deserialize($objectData, ['entity' => $existingObject]);
                if ($node) {
                    $question->addObject($node);
                }
            }
        }

        // Remaining objects are no longer in the Question
        if (0 < count($objectEntities)) {
            foreach ($objectEntities as $objectToRemove) {
                $question->removeObject($objectToRemove);
            }
        }
    }

    /**
     * Serializes Question resources.
     * Forwards the resource serialization to ResourceContentSerializer.
     *
     * @param Question $question
     * @param array    $options
     *
     * @return array
     */
    private function serializeResources(Question $question, array $options = [])
    {
        return array_map(function ($resource) use ($options) {
            /* @var QuestionResource $resource */
            return $this->resourceContentSerializer->serialize($resource->getResourceNode(), $options);
        }, $question->getResources()->toArray());
    }

    /**
     * Deserializes Question resources.
     *
     * @param Question $question
     * @param array    $resources
     */
    private function deserializeResources(Question $question, array $resources = [])
    {
        $resourceEntities = $question->getResources()->toArray();

        foreach ($resources as $resourceData) {
            $existingResource = null;

            // Searches for an existing resource entity.
            foreach ($resourceEntities as $entityIndex => $entityResource) {
                /** @var QuestionResource $entityResource */
                if ((string) $entityResource->getId() === $resourceData->id) {
                    $existingResource = $entityResource;
                    unset($resourceEntities[$entityIndex]);
                    break;
                }
            }

            // Link resource to question
            if (empty($existingResource)) {
                $node = $this->resourceContentSerializer->deserialize($resourceData, ['entity' => $existingResource]);
                if ($node) {
                    $question->addResource($node);
                }
            }
        }

        // Remaining resources are no longer in the Question
        if (0 < count($resourceEntities)) {
            foreach ($resourceEntities as $resourceToRemove) {
                $question->removeResource($resourceToRemove);
            }
        }
    }
}
