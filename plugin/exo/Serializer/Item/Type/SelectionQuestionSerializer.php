<?php

namespace UJM\ExoBundle\Serializer\Item\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\ItemType\SelectionQuestion;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;

/**
 * @DI\Service("ujm_exo.serializer.question_selection")
 */
class SelectionQuestionSerializer implements SerializerInterface
{
    /**
     * Converts a Selection question into a JSON-encodable structure.
     *
     * @param SelectionQuestion $selectionQuestion
     * @param array             $options
     *
     * @return \stdClass
     */
    public function serialize($selectionQuestion, array $options = [])
    {
        $questionData = new \stdClass();
        $questionData->text = $selectionQuestion->getText();
        $questionData->mode = $selectionQuestion->getMode();

        switch ($selectionQuestion->getMode()) {
           case SelectionQuestion::MODE_FIND:
              $questionData->tries = $selectionQuestion->getTries();
              break;
           case SelectionQuestion::MODE_SELECT:
              $questionData->selections = $this->serializeSelections($selectionQuestion);
              break;
           case SelectionQuestion::MODE_HIGHLIGHT:
              $questionData->selections = $this->serializeSelections($selectionQuestion);
              $questionData->colors = $this->serializeColors($selectionQuestion);
              break;
        }

        if (in_array(Transfer::INCLUDE_SOLUTIONS, $options)) {
            $questionData->solutions = $this->serializeSolutions($selectionQuestion);
        }

        return $questionData;
    }

    /**
     * Converts raw data into a Selection question entity.
     *
     * @param \stdClass         $data
     * @param SelectionQuestion $selectionQuestion
     * @param array             $options
     *
     * @return ClozeQuestion
     */
    public function deserialize($data, $selectionQuestion = null, array $options = [])
    {
        if (empty($selectionQuestion)) {
            $selectionQuestion = new SelectionQuestion();
        }

        $selectionQuestion->setText($data->text);
        $selectionQuestion->setMode($data->mode);

        //colors must be unserialized first becaus they might be usefull for selections
        if ($data->colors) {
            $this->deserializeColors($selectionQuestion, $data->colors, $options);
        }

        if ($data->selections) {
            $this->deserializeSelections($selectionQuestion, $data->selections, $data->solutions, $options);
        }

        return $selectionQuestion;
    }

    /**
     * Serializes the Question holes.
     *
     * @param SelectionQuestion $selectionQuestion
     *
     * @return array
     */
    private function serializeSelections(SelectionQuestion $selectionQuestion)
    {
        return array_map(function (Selection $selection) {
            $selectionData = new \stdClass();
            $selectionData->id = $selection->getUuid();

            if ($selectionQuestion->getMode() === SelectionQuestion::MODE_SELECT) {
                $selectionData->score = $selection->getScore();
            } else {
                if ($selectionQuestion->getMode() === SelectionQuestion::MODE_HIGHLIGHT) {
                    $selectionData->begin = $selection->getBegin();
                    $selectionData->end = $selection->getEnd();
                }
            }

            return $selectionData;
        }, $selectionQuestion->getSelections()->toArray());
    }

    private function serializeColors(SelectionQuestion $selectionQuestion)
    {
        return array_map(function (Color $color) {
            $colorData = new \stdClass();
            $colorData->id = $color->getUuid();
            $colorData->code = $color->getColorCode();

            return $colorData;
        }, $selectionQuestion->getColors()->toArray());
    }

    private function deserializeColors(SelectionQuestion $selectionQuestion, $colors, $options)
    {
        $colorEntities = $selectionQuestion->getColors()->toArray();

        foreach ($colors as $colorData) {
            $color = null;

          // Searches for an existing color entity.
          foreach ($colorEntities as $entityIndex => $colorEntity) {
              /* @var Color $entityHole */
              if ($colorEntity->getUuid() === $colorData->id) {
                  $color = $colorEntity;
                  unset($colorEntities[$entityIndex]);
                  break;
              }
          }

            if (empty($hole)) {
                $color = new Color();
            }

          // Force client ID if needed
          if (!in_array(Transfer::USE_SERVER_IDS, $options)) {
              $color->setUuid($colorData->id);
          }

            $hole->setColorCode($colorData->code);
        }

      // Remaining color are no longer in the Question
      foreach ($colorEntities as $colorToRemove) {
          $selectionQuestion->removeColor($colorToRemove);
      }
    }

    /**
     * Deserializes Question selection.
     *
     * @param SelectionQuestion $clozeQuestion
     */
    private function deserializeSelections(SelectionQuestion $selectionQuestion, $selections, $solutions, $options = [])
    {
        $selectionEntities = $selectionQuestion->getSelections()->toArray();

        foreach ($selections as $selectionData) {
            $selection = null;

          // Searches for an existing color entity.
          foreach ($selectionEntities as $entityIndex => $selectionEntity) {
              /* @var Color $entityHole */
              if ($selectionEntity->getUuid() === $selectionData->id) {
                  $selection = $selectionEntity;
                  unset($selectionEntities[$entityIndex]);
                  break;
              }
          }

            if (empty($selection)) {
                $selection = new Selection();
            }

          // Force client ID if needed
          if (!in_array(Transfer::USE_SERVER_IDS, $options)) {
              $selection->setUuid($selectionData->id);
          }

            $selection->setBegin($selectionData->begin);
            $selection->setEnd($selectionData->end);
            $score = $selectionData->score ? $selectionData->score : null;
          //MODE SELECT
          $selection->setScore($score);

            foreach ($solutions as $solutionData) {
                if ($solutionData->selectionId === $selectionData->id) {
                    //MODE FIND OBVIOUSLY
                if ($selectionQuestion->getMode() === SelectionQuestion::MODE_FIND) {
                    $selection->setScore($solutionData->score);
                } else {
                    //$colorSelections = $selection->getColorSelections()->toArray();
                    //do stuff here but I don't know what yet
                }
                }
            }
        }

      // Remaining color are no longer in the Question
      foreach ($selectionEntities as $selectionToRemove) {
          $selectionEntities->removeSelection($selectionToRemove);
      }
    }

    private function serializeSolutions(SelectionQuestion $selectionQuestion)
    {
        switch ($selectionQuestion->getMode()) {
         case SelectionQuestion::MODE_FIND:
            return array_map(function (Selection $selection) {
                $solutionData = new \stdClass();
                $solutionData->selectionId = $selection->getUuid();
                $solutionData->score = $selection->getScore();
                $solutionData->begin = $selection->getBegin();
                $solutionData->end = $selection->getEnd();

                return $solutionData;
            }, $selectionQuestion->getSelections());
         case SelectionQuestion::MODE_SELECT:
             return array_map(function (Selection $selection) {
                 $solutionData = new \stdClass();
                 $solutionData->selectionId = $selection->getUuid();
                 $solutionData->end = $selection->getEnd();

                 return $solutionData;
             }, $selectionQuestion->getSelections());
         case SelectionQuestion::MODE_HIGHLIGHT:
             return array_map(function (Selection $selection) {
                 $solutionData = new \stdClass();
                 $solutionData->selectionId = $selection->getUuid();
                 $solutionData->answers = [];

                 foreach ($selection->getColorSelections()->toArray() as $colorSelection) {
                     $answer = new \stdClass();
                     $answer->score = $colorSelection->getScore();
                     $answer->colorId = $colorSelection->getColor()->getUuid();
                     $solutionData->answers[] = $answer;
                 }

                 return $solutionData;
             }, $selectionQuestion->getSelections());
      }
    }
}
