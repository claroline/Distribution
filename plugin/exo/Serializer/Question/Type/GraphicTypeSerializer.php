<?php

namespace UJM\ExoBundle\Serializer\Question\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Coords;
use UJM\ExoBundle\Entity\InteractionGraphic;
use UJM\ExoBundle\Library\Question\Handler\QuestionHandlerInterface;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Library\Serializer\SerializerInterface;

/**
 * @DI\Service("ujm_exo.serializer.question_graphic")
 * @DI\Tag("ujm_exo.question.serializer")
 */
class GraphicTypeSerializer implements QuestionHandlerInterface, SerializerInterface
{
    public function getQuestionMimeType()
    {
        return QuestionType::GRAPHIC;
    }

    /**
     * Converts a Graphic question into a JSON-encodable structure.
     *
     * @param InteractionGraphic $graphicQuestion
     * @param array              $options
     *
     * @return \stdClass
     */
    public function serialize($graphicQuestion, array $options = [])
    {
        $questionData = new \stdClass();

        $questionData->image = $this->serializeImage($graphicQuestion);
        $questionData->pointers = $graphicQuestion->getAreas()->count();

        if (isset($options['includeSolutions']) && $options['includeSolutions']) {
            $questionData->solutions = $this->serializeSolutions($graphicQuestion);
        }

        // Serializes score type
        $questionData->score = new \stdClass();
        $questionData->score->type = 'sum';

        return $questionData;
    }

    /**
     * Converts raw data into a Graphic question entity.
     *
     * @param \stdClass $data
     * @param array     $options
     *
     * @return InteractionGraphic
     */
    public function deserialize($data, array $options = [])
    {
        $entity = !empty($options['entity']) ? $options['entity'] : new InteractionGraphic();

        $this->deserializeImage($entity, $data->image);
        $this->deserializeAreas($entity, $data->solutions);

        return $entity;
    }

    /**
     * Serializes the Question image.
     *
     * @param InteractionGraphic $graphicQuestion
     *
     * @return \stdClass
     */
    private function serializeImage(InteractionGraphic $graphicQuestion)
    {
        $questionImg = $graphicQuestion->getImage();

        $image = new \stdClass();

        $imageMeta = new \stdClass();
        $imageMeta->title = $questionImg->getLabel();

        $image->id = (string) $questionImg->getId();
        $image->meta = $imageMeta;
        $image->url = $questionImg->getUrl();
        $image->width = $questionImg->getWidth();
        $image->height = $questionImg->getHeight();

        return $image;
    }

    /**
     * Deserializes the Question image.
     *
     * @param InteractionGraphic $graphicQuestion
     * @param \stdClass          $image
     */
    private function deserializeImage(InteractionGraphic $graphicQuestion, \stdClass $image)
    {
    }

    /**
     * Serializes Question solutions.
     *
     * @param InteractionGraphic $graphicQuestion
     *
     * @return array
     */
    private function serializeSolutions(InteractionGraphic $graphicQuestion)
    {
        return array_map(function (Coords $area) {
            $solutionData = new \stdClass();
            $solutionData->area = $this->serializeArea($area);
            $solutionData->score = $area->getScore();
            if ($area->getFeedback()) {
                $solutionData->feedback = $area->getFeedback();
            }

            return $solutionData;
        }, $graphicQuestion->getAreas()->toArray());
    }

    /**
     * Deserializes Question areas.
     *
     * @param InteractionGraphic $graphicQuestion
     * @param array              $solutions
     */
    private function deserializeAreas(InteractionGraphic $graphicQuestion, array $solutions)
    {
        $areaEntities = $graphicQuestion->getAreas()->toArray();

        foreach ($solutions as $solutionData) {
            $area = null;

            // Searches for an existing area entity.
            foreach ($areaEntities as $entityIndex => $entityArea) {
                /** @var Coords $entityArea */
                if ((string) $entityArea->getId() === $solutionData->area->id) {
                    $area = $entityArea;
                    unset($areaEntities[$entityIndex]);
                    break;
                }
            }

            if (null === $area) {
                $area = new Coords();
            }

            // Deserializes area definition
            $this->deserializeArea($area, $solutionData->area);

            $graphicQuestion->addArea($area);
        }

        array_map(function (Coords $area) {
            $solutionData = new \stdClass();
            $solutionData->area = $this->serializeArea($area);
            $solutionData->score = $area->getScore();
            if ($area->getFeedback()) {
                $solutionData->feedback = $area->getFeedback();
            }

            return $solutionData;
        }, $graphicQuestion->getAreas()->toArray());

        // Remaining areas are no longer in the question
        foreach ($areaEntities as $areaToRemove) {
            $graphicQuestion->removeArea($areaToRemove);
        }
    }

    /**
     * Serializes an Area.
     *
     * @param Coords $area
     *
     * @return \stdClass
     */
    private function serializeArea(Coords $area)
    {
        $areaData = new \stdClass();

        $areaData->id = (string) $area->getId();
        $areaData->color = $area->getColor();

        $position = explode(',', $area->getValue());

        switch ($area->getShape()) {
            case 'circle':
                $areaData->shape = 'circle';
                $areaData->radius = $area->getSize() / 2;

                // We store the top left corner, so we need to calculate the real center
                $center = $this->serializeCoords($position);
                $center->x += $areaData->radius;
                $center->y += $areaData->radius;
                $areaData->center = $center;

                break;
            case 'rect':
            case 'square':
                $areaData->shape = 'rect';
                $areaData->coords = [
                    // top-left coords
                    $this->serializeCoords($position),
                    // bottom-right coords
                    $this->serializeCoords([$position[0] + $area->getSize(), $position[1] + $area->getSize()]),
                ];

                break;
        }

        return $areaData;
    }

    private function deserializeArea(Coords $area, \stdClass $data)
    {
        $area->setColor($data->color);
        $area->setShape($data->shape);

        switch ($data->shape) {
            case 'circle':
                break;
            case 'square':
            case 'rect':
                break;
        }
    }

    /**
     * Serializes Coordinates.
     *
     * @param array $coords
     *
     * @return \stdClass
     */
    private function serializeCoords(array $coords)
    {
        $coordsData = new \stdClass();

        $coordsData->x = (int) $coords[0];
        $coordsData->y = (int) $coords[1];

        return $coordsData;
    }
}
