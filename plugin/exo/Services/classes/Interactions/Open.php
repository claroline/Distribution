<?php

namespace UJM\ExoBundle\Services\classes\Interactions;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\InteractionOpen;

/**
 * Services for open.
 *
 * @DI\Service("ujm.exo.open_service")
 */
class Open extends Interaction
{
    /**
     * implement the abstract method
     * To calculate the score.
     *
     * @param InteractionOpen $interOpen
     * @param string          $response
     * @param float           $penalty   penalty if the user showed hints
     *
     * @return string userScore/scoreMax
     */
    public function mark(
        InteractionOpen $interOpen = null,
        $response = null,
        $penalty = null
    ) {
        if ($interOpen->getTypeOpenQuestion()->getValue() === 'long') {
            $score = -1;
        } elseif ($interOpen->getTypeOpenQuestion()->getValue() === 'oneWord') {
            $score = $this->getScoreOpenOneWord($response, $interOpen);
        } elseif ($interOpen->getTypeOpenQuestion()->getValue() === 'short') {
            $score = $this->getScoreShortResponse($response, $interOpen);
        }

        if ($interOpen->getTypeOpenQuestion()->getValue() !== 'long') {
            $score -= $penalty;
            if ($score < 0) {
                $score = 0;
            }
        }

        return $score;
    }

    /**
     * implement the abstract method
     * Get score max possible for an open question.
     *
     *
     * @param \UJM\ExoBundle\Entity\InteractionOpen $interOpen
     *
     * @return float
     */
    public function maxScore($interOpen = null)
    {
        $em = $this->doctrine->getManager();
        $scoreMax = 0;

        if ($interOpen->getTypeOpenQuestion() === 'long') {
            $scoreMax = $interOpen->getScoreMaxLongResp();
        } elseif ($interOpen->getTypeOpenQuestion() === 'oneWord') {
            $scoreMax = $em->getRepository('UJMExoBundle:WordResponse')
                ->getScoreMaxOneWord($interOpen->getId());
        } elseif ($interOpen->getTypeOpenQuestion() === 'short') {
            $scoreMax = $em->getRepository('UJMExoBundle:WordResponse')
                ->getScoreMaxShort($interOpen->getId());
        }

        return $scoreMax;
    }

    /**
     * implement the abstract method.
     *
     * @param int $questionId
     *
     * @return \UJM\ExoBundle\Entity\InteractionOpen
     */
    public function getInteractionX($questionId)
    {
        return $this->doctrine->getManager()
            ->getRepository('UJMExoBundle:InteractionOpen')
            ->findOneByQuestion($questionId);
    }

    /**
     * Get the types of open question long, short, numeric, one word.
     *
     *
     * @return array
     */
    public function getTypeOpen()
    {
        $em = $this->doctrine->getManager();

        $typeOpen = [];
        $types = $em->getRepository('UJMExoBundle:TypeOpenQuestion')
            ->findAll();

        foreach ($types as $type) {
            $typeOpen[$type->getId()] = $type->getCode();
        }

        return $typeOpen;
    }

    /**
     * Get score for an open question with one word.
     *
     *
     * @param string                                $response
     * @param \UJM\ExoBundle\Entity\InteractionOpen $interOpen
     *
     * @return float
     */
    private function getScoreOpenOneWord($response, $interOpen)
    {
        $score = 0;
        foreach ($interOpen->getWordResponses() as $wr) {
            $score += $this->getScoreWordResponse($wr, $response);
        }

        return $score;
    }

    /**
     * Get score for an open question with short answer.
     *
     *
     * @param string                                $response
     * @param \UJM\ExoBundle\Entity\InteractionOpen $interOpen
     *
     * @return float
     */
    private function getScoreShortResponse($response, $interOpen)
    {
        $score = 0;

        foreach ($interOpen->getWordResponses() as $wr) {
            $pattern = '/'.$wr->getResponse().'/';
            if (!$wr->getCaseSensitive()) {
                $pattern .= 'i';
            }
            $subject = '/'.$response.'/';
            if (preg_match($pattern, $subject)) {
                $score += $wr->getScore();
            }
        }

        return $score;
    }
}
