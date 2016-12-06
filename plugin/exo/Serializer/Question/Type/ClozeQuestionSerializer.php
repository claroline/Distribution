<?php

namespace UJM\ExoBundle\Serializer\Question\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Misc\Hole;
use UJM\ExoBundle\Entity\Misc\Keyword;
use UJM\ExoBundle\Entity\QuestionType\ClozeQuestion;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;
use UJM\ExoBundle\Serializer\Misc\KeywordSerializer;

/**
 * @DI\Service("ujm_exo.serializer.question_cloze")
 */
class ClozeQuestionSerializer implements SerializerInterface
{
    /**
     * @var KeywordSerializer
     */
    private $keywordSerializer;

    /**
     * ClozeQuestionSerializer constructor.
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

    /**
     * Converts a Cloze question into a JSON-encodable structure.
     *
     * @param ChoiceQuestion $clozeQuestion
     * @param array          $options
     *
     * @return \stdClass
     */
    public function serialize($clozeQuestion, array $options = [])
    {
        $questionData = new \stdClass();

        $questionData->text = $clozeQuestion->getText();
        $questionData->holes = $this->serializeHoles($clozeQuestion);
        if (in_array(Transfer::INCLUDE_SOLUTIONS, $options)) {
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
     * @param \stdClass     $data
     * @param ClozeQuestion $clozeQuestion
     * @param array         $options
     *
     * @return ClozeQuestion
     */
    public function deserialize($data, $clozeQuestion = null, array $options = [])
    {
        if (empty($clozeQuestion)) {
            $clozeQuestion = new ClozeQuestion();
        }

        $clozeQuestion->setText($data->text);

        $this->deserializeHoles($clozeQuestion, $data->holes, $data->solutions, $options);

        return $clozeQuestion;
    }

    /**
     * Serializes the Question holes.
     *
     * @param ClozeQuestion $clozeQuestion
     *
     * @return array
     */
    private function serializeHoles(ClozeQuestion $clozeQuestion)
    {
        return array_map(function (Hole $hole) {
            $holeData = new \stdClass();
            $holeData->id = (string) $hole->getId();
            $holeData->size = $hole->getSize();

            if ($hole->getSelector()) {
                // We want to propose a list of choices
                $holeData->choices = array_map(function (Keyword $keyword) {
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
     * @param ClozeQuestion $clozeQuestion
     * @param array         $holes
     * @param array         $solutions
     * @param array         $options
     */
    private function deserializeHoles(ClozeQuestion $clozeQuestion, array $holes, array $solutions, array $options = [])
    {
        $holeEntities = $clozeQuestion->getHoles()->toArray();

        foreach ($holes as $holeData) {
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

    private function serializeSolutions(ClozeQuestion $clozeQuestion)
    {
        return array_map(function (Hole $hole) {
            $solutionData = new \stdClass();
            $solutionData->holeId = (string) $hole->getId();

            $solutionData->answers = array_map(function (Keyword $keyword) {
                return $this->keywordSerializer->serialize($keyword);
            }, $hole->getKeywords()->toArray());

            return $solutionData;
        }, $clozeQuestion->getHoles()->toArray());
    }
}
