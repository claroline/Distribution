<?php

namespace UJM\ExoBundle\Serializer\Question;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use UJM\ExoBundle\Entity\Hint;
use UJM\ExoBundle\Entity\Question;
use UJM\ExoBundle\Entity\QuestionObject;
use UJM\ExoBundle\Entity\QuestionResource;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Library\Question\QuestionDefinitionsCollection;
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
     * @var TokenStorageInterface
     */
    private $tokenStorage;

    /**
     * @var QuestionDefinitionsCollection
     */
    private $questionDefinitions;

    /**
     * @var CategorySerializer
     */
    private $categorySerializer;

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
     * @param ObjectManager                 $om
     * @param QuestionDefinitionsCollection $questionDefinitions
     * @param CategorySerializer            $categorySerializer
     * @param HintSerializer                $hintSerializer
     * @param ResourceContentSerializer     $resourceContentSerializer
     *
     * @DI\InjectParams({
     *     "om"                        = @DI\Inject("claroline.persistence.object_manager"),
     *     "tokenStorage"              = @DI\Inject("security.token_storage"),
     *     "questionDefinitions"       = @DI\Inject("ujm_exo.collection.question_definitions"),
     *     "categorySerializer"        = @DI\Inject("ujm_exo.serializer.category"),
     *     "hintSerializer"            = @DI\Inject("ujm_exo.serializer.hint"),
     *     "resourceContentSerializer" = @DI\Inject("ujm_exo.serializer.resource_content")
     * })
     */
    public function __construct(
        ObjectManager $om,
        QuestionDefinitionsCollection $questionDefinitions,
        CategorySerializer $categorySerializer,
        HintSerializer $hintSerializer,
        ResourceContentSerializer $resourceContentSerializer)
    {
        $this->om = $om;
        $this->questionDefinitions = $questionDefinitions;
        $this->categorySerializer = $categorySerializer;
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
        $questionData->id = $question->getUuid();
        $questionData->type = $question->getMimeType();
        $questionData->content = $question->getInvite();

        $title = $question->getTitle();
        if (!empty($title)) {
            $questionData->title = $title;
        }

        if (!in_array(Transfer::MINIMAL, $options)) {
            $description = $question->getDescription();
            if (!empty($description)) {
                $questionData->description = $description;
            }

            $info = $question->getSupplementary();
            if (!empty($info)) {
                $questionData->info = $info;
            }

            $instruction = $question->getSpecification();
            if (!empty($instruction)) {
                $questionData->instruction = $question->getSpecification();
            }

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
            if (in_array(Transfer::INCLUDE_SOLUTIONS, $options) && $question->getFeedback()) {
                $questionData->feedback = $question->getFeedback();
            }
        }

        return $questionData;
    }

    /**
     * Converts raw data into a Question entity.
     *
     * @param \stdClass $data
     * @param Question  $question
     * @param array     $options
     *
     * @return Question
     */
    public function deserialize($data, $question = null, array $options = [])
    {
        if (empty($question)) {
            // Loads the Question from DB if already exist
            $question = $this->om->getRepository('UJMExoBundle:Question')->findOneBy([
                'uuid' => $data->id,
            ]);

            if (empty($question)) {
                // Question not exist
                $question = new Question();
            }
        }

        if (!empty($data->id)) {
            $question->setUuid($data->id);
        }

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
            $this->deserializeHints($question, $data->hints, $options);
        }

        if (!empty($data->objects)) {
            $this->deserializeObjects($question, $data->objects, $options);
        }

        if (!empty($data->resources)) {
            $this->deserializeResources($question, $data->resources, $options);
        }

        $this->deserializeQuestionType($question, $data, $options);

        if (isset($data->meta)) {
            $this->deserializeMetadata($question, $data->meta);
        }

        return $question;
    }

    private function serializeQuestionType(Question $question, array $options = [])
    {
        $definition = $this->questionDefinitions->get($question->getMimeType());

        return $definition->serializeQuestion($question->getInteraction(), $options);
    }

    private function deserializeQuestionType(Question $question, \stdClass $data, array $options = [])
    {
        $definition = $this->questionDefinitions->get($question->getMimeType());

        // Deserialize question type data
        $type = $definition->deserializeQuestion($data, $question->getInteraction(), $options);
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
        $metadata = new \stdClass();

        $creator = $question->getCreator();
        if ($creator) {
            $author = new \stdClass();
            $author->name = sprintf('%s %s', $creator->getFirstName(), $creator->getLastName());

            $metadata->authors = [$author];
        }

        $metadata->created = $question->getDateCreate()->format('Y-m-d\TH:i:s');
        $metadata->updated = $question->getDateModify()->format('Y-m-d\TH:i:s');

        if (in_array(Transfer::INCLUDE_ADMIN_META, $options)) {
            $metadata->model = $question->isModel();

            // Includes the list of Exercises using this question
            /** @var QuestionRepository $questionRepo */
            $questionRepo = $this->om->getRepository('UJMExoBundle:Question');

            $metadata->usedBy = $questionRepo->findUsages($question);

            // Adds category
            $metadata->category = $this->categorySerializer->serialize($question->getCategory(), $options);
        }

        return $metadata;
    }

    /**
     * Deserializes Question metadata.
     *
     * @param Question  $question
     * @param \stdClass $metadata
     */
    public function deserializeMetadata(Question $question, \stdClass $metadata)
    {
        if (isset($metadata->model)) {
            $question->setModel($metadata->model);
        }

        // Sets the creator of the Question if not set
        $creator = $question->getCreator();
        if (empty($creator)) {
            $currentUser = $this->tokenStorage->getToken()->getUser();
            if ($currentUser instanceof User) {
                $question->setCreator($currentUser);
            }
        }

        // TODO : Sets category
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
        return array_map(function (Hint $hint) use ($options) {
            return $this->hintSerializer->serialize($hint, $options);
        }, $question->getHints()->toArray());
    }

    /**
     * Deserializes Question hints.
     * Forwards the hint deserialization to HintSerializer.
     *
     * @param Question $question
     * @param array    $hints
     * @param array    $options
     */
    private function deserializeHints(Question $question, array $hints = [], array $options = [])
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

            $entity = $this->hintSerializer->deserialize($hintData, $existingHint, $options);

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
        return array_map(function (QuestionObject $object) use ($options) {
            return $this->resourceContentSerializer->serialize($object->getResourceNode(), $options);
        }, $question->getObjects()->toArray());
    }

    /**
     * Deserializes Question objects.
     *
     * @param Question $question
     * @param array    $objects
     * @param array    $options
     */
    private function deserializeObjects(Question $question, array $objects = [], array $options = [])
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
                $node = $this->resourceContentSerializer->deserialize($objectData, $existingObject, $options);
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
        return array_map(function (QuestionResource $resource) use ($options) {
            return $this->resourceContentSerializer->serialize($resource->getResourceNode(), $options);
        }, $question->getResources()->toArray());
    }

    /**
     * Deserializes Question resources.
     *
     * @param Question $question
     * @param array    $resources
     * @param array    $options
     */
    private function deserializeResources(Question $question, array $resources = [], array $options = [])
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
                $node = $this->resourceContentSerializer->deserialize($resourceData, $existingResource, $options);
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
