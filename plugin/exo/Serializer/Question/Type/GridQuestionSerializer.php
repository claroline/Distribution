<?php

namespace UJM\ExoBundle\Serializer\Question\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Misc\Cell;
use UJM\ExoBundle\Entity\Misc\CellChoice;
use UJM\ExoBundle\Entity\QuestionType\GridQuestion;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;
use UJM\ExoBundle\Serializer\Misc\KeywordSerializer;

/**
 * @DI\Service("ujm_exo.serializer.question_grid")
 */
class GridQuestionSerializer implements SerializerInterface
{

    /**
     * @var KeywordSerializer
     */
    private $keywordSerializer;

    /**
     * GridQuestionSerializer constructor.
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
     * Converts a Grid question into a JSON-encodable structure.
     *
     * @param GridQuestion $gridQuestion
     * @param array        $options
     *
     * @return \stdClass
     */
    public function serialize($gridQuestion, array $options = [])
    {
        $questionData = new \stdClass();

        $questionData->random = $gridQuestion->getShuffle();
        $questionData->penalty = $gridQuestion->getPenalty();
        $questionData->rows = $gridQuestion->getRows();
        $questionData->cols = $gridQuestion->getCols();
        $questionData->sumMode = $gridQuestion->getSumMode();
        $questionData->border = $gridQuestion->getGridStyle();
        $questionData->cells = $this->serializeCells($gridQuestion, $options);
        if (in_array(Transfer::INCLUDE_SOLUTIONS, $options)) {
            $questionData->solutions = $this->serializeSolutions($gridQuestion, $options);
        }

        // TODO: Serialize cells and solutions
        return $questionData;
    }

    /**
     * @param GridQuestion $gridQuestion
     * @param array         $options
     *
     * @return array
     */
    private function serializeCells(GridQuestion $gridQuestion, array $options = [])
    {
        return array_map(function (GridCell $cell) use ($options) {
            $cellData = new \stdClass();
            $cellData->id = $cell->getUuid();
            $cellData->data = $cell->getData();
            $cellData->background = $cell->getBackground();
            $cellData->color = $cell->getColor();
            $cellData->coordinates = $cell->getCoords();
            // add a list of choice if more than one choice (else it will be an empty text input)
            if (1 < count($cell->getChoices()->toArray())) {
                $cellData->choices = array_map(function (CellChoice $choice) use ($cellData) {
                    return $choice->getText();
                }, $cell->getChoices()->toArray());
            }
            return $cellData;
        }, $gridQuestion->getCells()->toArray());
    }

    /**
     * @param GridQuestion $gridQuestion
     * @param array         $options
     *
     * @return array
     */
    private function serializeSolutions(GridQuestion $gridQuestion, array $options = [])
    {
        return array_map(function (GridCell $cell) use ($options) {
            $celChoices = $cell->getChoices()->toArray();
            if (0 < count($celChoices)) {
                $solutionData = new \stdClass();
                $solutionData->cellId = $cell->getUuid();
                $solutionData->answers = array_map(function (CellChoice $choice) use ($options) {
                    return $this->keywordSerializer->serialize($choice, $options);
                }, $cell->getOptions()->toArray());
                return $solutionData;
            }
        }, $gridQuestion->getCells()->toArray());
    }


    /**
     * Converts raw data into a Grid question entity.
     *
     * @param \stdClass    $data
     * @param GridQuestion $gridQuestion
     * @param array        $options
     *
     * @return PairQuestion
     */
    public function deserialize($data, $gridQuestion = null, array $options = [])
    {
        if (empty($gridQuestion)) {
            $gridQuestion = new GridQuestion();
        }

        if (!empty($data->penalty) || 0 === $data->penalty) {
            $gridQuestion->setPenalty($data->penalty);
        }

        if (!empty($data->data)) {
            $gridQuestion->setData($data->data);
        }

        $gridQuestion->setRows($data->rows);
        $gridQuestion->setColumns($data->columns);
        $gridQuestion->setSumMode($data->sumMode);
        $gridQuestion->setBorderWidth($data->border->width);
        $gridQuestion->setBorderColor($data->border->color);
        // Deserialize cells and solutions
        $this->deserializeCells($gridQuestion, $data->cells, $options);
        
        return $gridQuestion;
    }

    /**
     * Deserializes Question cells.
     *
     * @param GridQuestion  $gridQuestion
     * @param array         $cells
     * @param array         $solutions
     * @param array         $options
     */
    private function deserializeCells(GridQuestion $gridQuestion, array $cells, array $solutions, array $options = [])
    {
        $cellEntities = $gridQuestion->getCells()->toArray();

        foreach ($cells as $cellData) {
            $cell = null;

            // Searches for an existing cell entity.
            foreach ($cellEntities as $entityIndex => $entityCell) {
                /** @var Hole $entityHole */
                if ($entityCell->getUuid() === $cellData->id) {
                    $cell = $entityCell;
                    unset($cellEntities[$entityIndex]);
                    break;
                }
            }

            if (empty($cell)) {
                $cell = new Cell();
                $cell->setCoordsY($cellData->coordinates[0]);
                $cell->setCoordsX($cellData->coordinates[1]);
            }

            // Force client ID if needed
            if (!in_array(Transfer::USE_SERVER_IDS, $options)) {
                $cell->setUuid($cellData->id);
            }

            $cell->setColor($cellData->color);
            $cell->setBackground($cellData->background);
            $cell->setData($cellData->data);

            foreach ($solutions as $solution) {
                if ($solution->cellId === $cellData->id) {
                    $this->deserializeCellChoices($cell, $solution->answers, $options);

                    break;
                }
            }
        }

      // Remaining cells are no longer in the Question
      foreach ($cellEntities as $cellToRemove) {
          $gridQuestion->removeCell($cellToRemove);
      }
    }

    private function deserializeCellChoices(Cell $cell, array $answers, array $solutions)
    {
        $updatedChoices = $this->keywordSerializer->deserializeCollection($answers, $cell->getOptions()->toArray(), $options);
        $cell->setOptions($updatedChoices);
    }
}
