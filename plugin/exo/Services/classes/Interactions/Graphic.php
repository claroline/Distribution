<?php

namespace UJM\ExoBundle\Services\classes\Interactions;

use JMS\DiExtraBundle\Annotation as DI;

/**
 * Services for the graphic.
 *
 * @DI\Service("ujm.exo.graphic_service")
 */
class Graphic extends Interaction
{
    /**
     * implement the abstract method
     * To calculate the score.
     *
     * @param string                         $answer
     * @param \UJM\ExoBundle\Entity\Coords[] $rightCoords
     * @param number                         $penalty
     *
     * @return float
     */
    public function mark($answer = null, array $rightCoords = null, $penalty = null)
    {
        $score = 0;

        // Get the list of submitted coords from the answer string
        $coordsList = preg_split('/[;,]/', $answer);
        if (!empty($coordsList)) {
            // Loop through correct answers to know if they are in the submitted data
            foreach ($rightCoords as $expected) {
                // Get X and Y values from expected string
                list($xr, $yr) = explode(',', $expected->getValue());
                // Get tolerance zone
                $zoneSize = $expected->getSize();
                $zoneShape = $expected->getShape();

                foreach ($coordsList as $coords) {
                    if (preg_match('/[0-9]+/', $coords)) {
                        // Get X and Y values from answers of the student
                        list($xa, $ya) = explode('-', $coords);

                        if ($zoneShape === 'circle') {
                            $xcenter = $xr + ($zoneSize / 2);
                            $ycenter = $yr + ($zoneSize / 2);
                            $valid = pow($xa - $xcenter, 2) + pow($ya - $ycenter, 2) <= pow($zoneSize / 2, 2);
                        } elseif ($zoneShape === 'square') {
                            $valid = ($xa <= ($xr + $zoneSize)) && ($xa > $xr) && ($ya <= ($yr + $zoneSize)) && ($ya > $yr);
                        }

                        if ($valid) {
                            // The student answer is in the answer zone give him the points
                            $score += $expected->getScoreCoords();

                            break; // We have found an answer for this answer zone, so we directly pass to the next one
                        }
                    }
                }
            }
        }

        if ($penalty) {
            $score = $score - $penalty; // Score of the student with penalty
        }

        // Not negative score
        if ($score < 0) {
            $score = 0;
        }

        return $score;
    }

    public function isInArea(\stdClass $coords, \stdClass $area)
    {
        $in = false;

        switch ($area->shape) {
            case 'circle':
                if (pow($coords->x - $area->center->x, 2) + pow($coords->y - $area->center->y, 2) <= pow($area->radius, 2)) {
                    $in = true;
                }
                break;

            case 'rect':
                if ($coords->x >= $area->coords[0]->x && $coords->x <= $area->coords[1]->x
                    && $coords->y >= $area->coords[0]->y && $coords->y <= $area->coords[1]->y) {
                    $in = true;
                }
                break;
        }

        return $in;
    }

    /**
     * implement the abstract method
     * Get score max possible for a graphic question.
     *
     * @param \UJM\ExoBundle\Entity\InteractionGraphic $interGraph
     *
     * @return float
     */
    public function maxScore($interGraph = null)
    {
        $em = $this->doctrine->getManager();
        $scoreMax = 0;

        $rightCoords = $em->getRepository('UJMExoBundle:Coords')
            ->findBy(['interactionGraphic' => $interGraph->getId()]);

        foreach ($rightCoords as $score) {
            $scoreMax += $score->getScoreCoords();
        }

        return $scoreMax;
    }

    /**
     * implement the abstract method.
     *
     * @param int $questionId
     *
     * @return \UJM\ExoBundle\Entity\InteractionGraphic
     */
    public function getInteractionX($questionId)
    {
        return $this->doctrine->getManager()
            ->getRepository('UJMExoBundle:InteractionGraphic')
            ->findOneByQuestion($questionId);
    }
}
