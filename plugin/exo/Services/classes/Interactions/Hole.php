<?php

namespace UJM\ExoBundle\Services\classes\Interactions;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\InteractionHole;

/**
 * Services for the hole.
 *
 * @DI\Service("ujm.exo.hole_service")
 */
class Hole extends Interaction
{
    /**
     * implement the abstract method
     * To calculate the score.
     *
     * @param InteractionHole $interHole
     * @param $request
     * @param float $penalty penalty if the user showed hints
     *
     * @return string userScore/scoreMax
     */
    public function mark(InteractionHole $interHole = null, $request = null, $penalty = null)
    {
        $score = 0;
        foreach ($interHole->getHoles() as $hole) {
            $response = null;

            // Loop through Request to find response for the current Hole
            foreach ($request as $responseData) {
                if ($responseData['holeId'] == $hole->getId()) {
                    // Response for the current hole found
                    if (!empty($responseData['answerText'])) {
                        // Clean response text for DB comparison
                        $response = trim($responseData['answerText']);
                        $response = preg_replace('/\s+/', ' ', $response);
                    }
                }
            }

            if ($response) {
                $score += $this->getScoreHole($hole, $response);
            } else {
                $score = 0;
            }
        }

        if ($penalty) {
            $score -= $penalty;
        }

        if ($score < 0) {
            $score = 0;
        }

        return $score;
    }

    /**
     * Get score max possible for a question with holes question.
     *
     * @param \UJM\ExoBundle\Entity\InteractionHole $interHole
     *
     * @return float
     */
    public function maxScore($interHole = null)
    {
        $scoreMax = 0;
        foreach ($interHole->getHoles() as $hole) {
            $scoreTemp = 0;
            foreach ($hole->getWordResponses() as $wr) {
                if ($wr->getScore() > $scoreTemp) {
                    $scoreTemp = $wr->getScore();
                }
            }
            $scoreMax += $scoreTemp;
        }

        return $scoreMax;
    }

    /**
     * implement the abstract method.
     *
     * @param int $questionId
     *
     * @return \UJM\ExoBundle\Entity\InteractionHole
     */
    public function getInteractionX($questionId)
    {
        return $this->doctrine->getManager()
            ->getRepository('UJMExoBundle:InteractionHole')
            ->findOneByQuestion($questionId);
    }

    /**
     * @param \UJM\ExoBundle\Entity\Hole $hole
     * @param string                     $response
     *
     * @return float
     */
    private function getScoreHole($hole, $response)
    {
        $em = $this->doctrine->getManager();
        $mark = 0;
        if ($hole->getSelector() == true) {
            $wr = $em->getRepository('UJMExoBundle:WordResponse')->find($response);
            $mark = $wr->getScore();
        } else {
            foreach ($hole->getWordResponses() as $wr) {
                $mark += $this->getScoreWordResponse($wr, $response);
            }
        }

        return $mark;
    }
}
