<?php

/**
 * Services for the hole.
 */

namespace UJM\ExoBundle\Services\classes\Interactions;

use Symfony\Component\HttpFoundation\Request;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use UJM\ExoBundle\Entity\InteractionHole;

/**
 * @DI\Service("ujm.exo.hole_service")
 */
class Hole extends Interaction
{
    /**
     * implement the abstract method
     * To process the user's response for a paper(or a test).
     *
     *
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @param int                                       $paperID id Paper or 0 if it's just a question test and not a paper
     *
     * @return mixed[]
     */
    public function response(Request $request, $paperID = 0)
    {
        $em = $this->doctrine->getManager();
        $interactionHoleID = $request->request->get('interactionHoleToValidated');

        $session = $request->getSession();

        $interHole = $em->getRepository('UJMExoBundle:InteractionHole')->find($interactionHoleID);

        $penalty = $this->getPenalty($interHole->getQuestion(), $session, $paperID);

        $score = $this->mark($interHole, $request->request, $penalty);

        $response = $this->getJsonResponse($interHole, $request);

        $res = array(
            'penalty' => $penalty,
            'interHole' => $interHole,
            'response' => $response,
            'score' => $score,
        );

        return $res;
    }

    /**
     * Temporary method (to delete with the full angular)
     * To process the user's response for a paper(or a test).
     *
     *
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @param int                                       $paperID id Paper or 0 if it's just a question test and not a paper
     *
     * @return mixed[]
     */
    public function responsePhp(Request $request, $paperID = 0)
    {
        $em = $this->doctrine->getManager();
        $interactionHoleID = $request->request->get('interactionHoleToValidated');

        $session = $request->getSession();

        $interHole = $em->getRepository('UJMExoBundle:InteractionHole')->find($interactionHoleID);

        $penalty = $this->getPenalty($interHole->getQuestion(), $session, $paperID);

        $score = $this->markPhp($interHole, $request->request, $penalty);

        $response = $this->getJsonResponse($interHole, $request);

        $res = array(
            'penalty' => $penalty,
            'interHole' => $interHole,
            'response' => $response,
            'score' => $score,
        );

        return $res;
    }

    /**
     * Temporary method (to delete with the full angular)
     * To calculate the score.
     *
     * @param \UJM\ExoBundle\Entity\InteractionHole     $interHole
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @param float                                     $penalty   penalty if the user showed hints
     *
     * @return string userScore/scoreMax
     */
    public function markPhp(
        \UJM\ExoBundle\Entity\InteractionHole $interHole = null,
        $request = null,
        $penalty = null
    ) {
        $score = 0;
        $scoreMax = $this->maxScore($interHole);
        $i = 1;
        foreach ($interHole->getHoles() as $hole) {
            if (is_array($request)) {
                $response = $request[$i];
                ++$i;
            } else {
                $response = $request->get('blank_'.$hole->getPosition());
            }
            $response = trim($response);
            $response = preg_replace('/\s+/', ' ', $response);
            $score += $this->getScoreHole($hole, $response);
        }
        $score -= $penalty;
        if ($score < 0) {
            $score = 0;
        }
        $score .= '/'.$scoreMax;

        return $score;
    }

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
     * @param \UJM\ExoBundle\Entity\InteractionHole     $interHole
     * @param \Symfony\Component\HttpFoundation\Request $request
     *
     * @return json
     */
    private function getJsonResponse($interHole, $request)
    {
        $tabResp = [];

        $em = $this->doctrine->getManager();
        foreach ($interHole->getHoles() as $hole) {
            $response = $request->get('blank_'.$hole->getPosition());
            $response = trim($response);
            $response = preg_replace('/\s+/', ' ', $response);

            if ($hole->getSelector()) {
                $wr = $em->getRepository('UJMExoBundle:WordResponse')->find($response);
                $tabResp[$hole->getPosition()] = $wr->getResponse();
            } else {
                $from = array("'", '"');
                $to = array("\u0027", "\u0022");
                $tabResp[$hole->getPosition()] = str_replace($from, $to, $response);
            }
        }

        return json_encode($tabResp);
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
