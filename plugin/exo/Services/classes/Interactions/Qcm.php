<?php

namespace UJM\ExoBundle\Services\classes\Interactions;

use JMS\DiExtraBundle\Annotation as DI;

/**
 * Services for the qcm.
 * 
 * @DI\Service("ujm.exo.qcm_service")
 */
class Qcm extends Interaction
{
    /**
     * implement the abstract method
     * To calculate the score for a QCM.
     *
     *
     * @param \UJM\ExoBundle\Entity\InteractionQCM $interQCM
     * @param array [integer]                      $response   array of id Choice selected
     * @param array [UJM\ExoBundle\Entity\Choice]  $allChoices choices linked at the QCM
     * @param float                                $penalty    penalty if the user showed hints
     *
     * @return string userScore/scoreMax
     */
    public function mark(
        \UJM\ExoBundle\Entity\InteractionQCM $interQCM = null,
        array $response = null,
        $allChoices = null,
        $penalty = null
    ) {
        $scoreMax = $this->maxScore($interQCM);

        if (!$interQCM->getWeightResponse()) {
            $score = $this->markGlobal($allChoices, $response, $interQCM, $penalty);
        } else {
            $score = $this->markWeightResponse($allChoices, $response, $penalty, $scoreMax);
        }

        return $score;
    }

    /**
     * implement the abstract method
     * Get score max possible for a QCM.
     *
     *
     * @param \UJM\ExoBundle\Entity\InteractionQCM $interQCM
     *
     * @return float
     */
    public function maxScore($interQCM = null)
    {
        $scoreMax = 0;

        if (!$interQCM->getWeightResponse()) {
            $scoreMax = $interQCM->getScoreRightResponse();
        } else {
            foreach ($interQCM->getChoices() as $choice) {
                if ($choice->getRightResponse()) {
                    $scoreMax += $choice->getWeight();
                }
            }
        }

        return $scoreMax;
    }

    /**
     * implement the abstract method.
     *
     * @param int $questionId
     *
     * @return \UJM\ExoBundle\Entity\InteractionQCM
     */
    public function getInteractionX($questionId)
    {
        return $this->doctrine->getManager()
            ->getRepository('UJMExoBundle:InteractionQCM')
            ->findOneByQuestion($questionId);
    }

    /**
     * Get the types of QCM, Multiple response, unique response.
     *
     *
     * @return array
     */
    public function getTypeQCM()
    {
        $em = $this->doctrine->getManager();

        $typeQCM = array();
        $types = $em->getRepository('UJMExoBundle:TypeQCM')
            ->findAll();

        foreach ($types as $type) {
            $typeQCM[$type->getId()] = $type->getCode();
        }

        return $typeQCM;
    }

    /**
     * Calculate the score with weightResponse.
     *
     *
     * @param array [UJM\ExoBundle\Entity\Choice] $allChoices choices linked at the QCM
     * @param array [integer]                     $response   array of id Choice selected
     * @param float                               $penalty    penalty if the user showed hints
     *
     * @return float
     */
    private function markWeightResponse($allChoices, $response, $penalty, $scoreMax)
    {
        $score = 0;
        $markByChoice = array();
        foreach ($allChoices as $choice) {
            $markByChoice[(string) $choice->getId()] = $choice->getWeight();
        }
        if (isset($response[0]) && $response[0] != null) {
            foreach ($response as $res) {
                $score += $markByChoice[$res];
            }
        }

        if ($score > $scoreMax) {
            $score = $scoreMax;
        }

        $score -= $penalty;

        if ($score < 0) {
            $score = 0;
        }

        return $score;
    }

    /**
     * Calculate the score with global mark.
     *
     *
     * @param array [\UJM\ExoBundle\Entity\Choice] $allChoices choices linked at the QCM
     * @param array [integer]                      $response   array of id Choice selected
     * @param \UJM\ExoBundle\Entity\InteractionQCM $interQCM
     * @param float                                $penalty    penalty if the user showed hints
     *
     * @return float
     */
    private function markGlobal($allChoices, $response, $interQCM, $penalty)
    {
        $rightChoices = array();
        foreach ($allChoices as $choice) {
            if ($choice->getRightResponse()) {
                $rightChoices[] = (string) $choice->getId();
            }
        }

        $result = array_diff($response, $rightChoices);
        $resultBis = array_diff($rightChoices, $response);

        if ((count($result) == 0) && (count($resultBis) == 0)) {
            $score = $interQCM->getScoreRightResponse() - $penalty;
        } else {
            $score = $interQCM->getScoreFalseResponse() - $penalty;
        }

        if ($score < 0) {
            $score = 0;
        }

        return $score;
    }
}
