<?php

namespace UJM\ExoBundle\Serializer\Question\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Hole;
use UJM\ExoBundle\Entity\InteractionHole;
use UJM\ExoBundle\Entity\WordResponse;
use UJM\ExoBundle\Library\Question\Handler\QuestionHandlerInterface;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;
use UJM\ExoBundle\Serializer\Misc\KeywordSerializer;

/**
 * @DI\Service("ujm_exo.serializer.question_cloze")
 * @DI\Tag("ujm_exo.question.serializer")
 */
class ClozeTypeSerializer implements QuestionHandlerInterface, SerializerInterface
{
    /**
     * @var KeywordSerializer
     */
    private $keywordSerializer;

    /**
     * ClozeTypeSerializer constructor.
     *
     * @param KeywordSerializer $keywordSerializer
     *
     * @DI\InjectParams({
     *     "keywordSerializer" = @DI\Inject("ujm_exo.serializer.keyword")
     * })
     */
    public function __construct(KeywordSerializer $keywordSerializer)
    {
        $this->keywordSerializer = $keywordSerializer;
    }

    public function getQuestionMimeType()
    {
        return QuestionType::CLOZE;
    }

    /**
     * Converts a Cloze question into a JSON-encodable structure.
     *
     * @param InteractionHole $clozeQuestion
     * @param array           $options
     *
     * @return \stdClass
     */
    public function serialize($clozeQuestion, array $options = [])
    {
        $questionData = new \stdClass();

        $questionData->text = $clozeQuestion->getText();
        $questionData->holes = $this->serializeHoles($clozeQuestion);
        if (isset($options['includeSolutions']) && $options['includeSolutions']) {
            $questionData->solutions = $this->serializeSolutions($clozeQuestion);
        }

        // Serializes score type
        $questionData->score = new \stdClass();
        $questionData->score->type = 'sum';

        return $questionData;
    }

    /**
     * Converts raw data into a Cloze question entity.
     *
     * @param \stdClass       $data
     * @param InteractionHole $clozeQuestion
     * @param array           $options
     *
     * @return InteractionHole
     */
    public function deserialize($data, $clozeQuestion = null, array $options = [])
    {
        if (empty($clozeQuestion)) {
            $clozeQuestion = new InteractionHole();
        }

        $clozeQuestion->setText($data->text);

        $this->deserializeHoles($clozeQuestion, $data->holes, $data->solutions, $options);

        return $clozeQuestion;
    }

    /**
     * Serializes the Question holes.
     *
     * @param InteractionHole $clozeQuestion
     *
     * @return array
     */
    private function serializeHoles(InteractionHole $clozeQuestion)
    {
        return array_map(function (Hole $hole) {
            $holeData = new \stdClass();
            $holeData->id = (string) $hole->getId();
            $holeData->size = $hole->getSize();

            if ($hole->getSelector()) {
                // We want to propose a list of choices
                $holeData->choices = array_map(function (WordResponse $keyword) {
                    return $keyword->getText();
                }, $hole->getKeywords()->toArray());
            }

            $placeholder = $hole->getPlaceholder();
            if (!empty($placeholder)) {
                $holeData->placeholder = $placeholder;
            }

            return $holeData;
        }, $clozeQuestion->getHoles()->toArray());
    }

    /**
     * Deserializes Question holes.
     *
     * @param InteractionHole $clozeQuestion
     * @param array           $holes
     * @param array           $solutions
     * @param array           $options
     */
    private function deserializeHoles(InteractionHole $clozeQuestion, array $holes, array $solutions, array $options = [])
    {
        $holeEntities = $clozeQuestion->getHoles()->toArray();

        foreach ($holes as $index => $holeData) {
            $hole = null;

            // Searches for an existing hole entity.
            foreach ($holeEntities as $entityIndex => $entityHole) {
                /** @var Hole $entityHole */
                if ((string) $entityHole->getId() === $holeData->id) {
                    $hole = $entityHole;
                    unset($holeEntities[$entityIndex]);
                    break;
                }
            }

            if (null === $hole) {
                $hole = new Hole();
            }

            $hole->setPosition($index);

            if (!empty($holeData->choices)) {
                $hole->setSelector(true);
            } else {
                $hole->setSelector(false);
            }

            foreach ($solutions as $solution) {
                if ($solution->holeId === $holeData->id) {
                    $this->deserializeHoleKeywords($hole, $holeData->keywords, $options);

                    break;
                }
            }

            $clozeQuestion->addHole($hole);
        }

        // Remaining holes are no longer in the Question
        foreach ($holeEntities as $holeToRemove) {
            $clozeQuestion->removeHole($holeToRemove);
        }
    }

    /**
     * Deserializes the keywords of a Hole.
     *
     * @param Hole  $hole
     * @param array $keywords
     * @param array $options
     */
    private function deserializeHoleKeywords(Hole $hole, array $keywords, array $options = [])
    {
        $updatedKeywords = $this->keywordSerializer->deserializeCollection($keywords, $hole->getKeywords()->toArray(), $options);
        $hole->setKeywords($updatedKeywords);
    }

    private function serializeSolutions(InteractionHole $clozeQuestion)
    {
        return array_map(function (Hole $hole) {
            $solutionData = new \stdClass();
            $solutionData->holeId = (string) $hole->getId();

            $solutionData->answers = array_map(function (WordResponse $keyword) {
                return $this->keywordSerializer->serialize($keyword);
            }, $hole->getKeywords()->toArray());

            return $solutionData;
        }, $clozeQuestion->getHoles()->toArray());
    }
}
