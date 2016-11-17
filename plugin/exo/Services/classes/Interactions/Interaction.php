<?php

namespace UJM\ExoBundle\Services\classes\Interactions;

use Doctrine\Bundle\DoctrineBundle\Registry;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

/**
 * abstract class.
 */
abstract class Interaction
{
    protected $doctrine;

    /**
     * @DI\InjectParams({
     *     "doctrine"   = @DI\Inject("doctrine")
     * })
     *
     * @param Registry $doctrine
     */
    public function __construct(Registry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     * Get penalty for an interaction and a paper.
     *
     * @param \UJM\ExoBundle\Entity\Question $question
     * @param int                            $paperID
     *
     * @return float
     */
    private function getPenaltyPaper($question, $paperID)
    {
        $em = $this->doctrine->getManager();
        $penalty = 0;

        $hints = $question->getHints();

        foreach ($hints as $hint) {
            $lhp = $em->getRepository('UJMExoBundle:LinkHintPaper')
                      ->getLHP($hint->getId(), $paperID);
            if (count($lhp) > 0) {
                $signe = substr($hint->getPenalty(), 0, 1);

                if ($signe === '-') {
                    $penalty += substr($hint->getPenalty(), 1);
                } else {
                    $penalty += $hint->getPenalty();
                }
            }
        }

        return $penalty;
    }

    /**
     * Get penalty for a test or a paper.
     *
     * @param \UJM\ExoBundle\Entity\Question                             $question
     * @param \Symfony\Component\HttpFoundation\Session\SessionInterface $session
     * @param int                                                        $paperID
     *
     * @return float
     */
    protected function getPenalty($question, SessionInterface $session, $paperID)
    {
        $penalty = 0;
        if ($paperID === 0) {
            if ($session->get('penalties')) {
                foreach ($session->get('penalties') as $penal) {
                    $signe = substr($penal, 0, 1); // In order to manage the symbol of the penalty

                    if ($signe === '-') {
                        $penalty += substr($penal, 1);
                    } else {
                        $penalty += $penal;
                    }
                }
            }
            $session->remove('penalties');
        } else {
            $penalty = $this->getPenaltyPaper($question, $paperID);
        }

        return $penalty;
    }

     /**
      * Get score for a question with key word.
      *
      *
      * @param \UJM\ExoBundle\Entity\WordResponse $wr
      * @param string $response
      *
      * @return float
      */
     protected function getScoreWordResponse($wr, $response)
     {
         $score = 0;

         $formattedResponse = trim($response);
         $formattedWord = trim($wr->getResponse());
         if (!$wr->getCaseSensitive()) {
             $formattedResponse = strtolower($formattedResponse);
             $formattedWord = strtolower($formattedWord);
         }

         if ($formattedResponse === $formattedWord) {
             $score = $wr->getScore();
         }

         return $score;
     }

     /**
      * @param \UJM\ExoBundle\Entity\Interaction $interaction
      *
      * @return int
      */
     public function getNbReponses($interaction)
     {
         $em = $this->doctrine->getEntityManager();
         $response = $em->getRepository('UJMExoBundle:Response')
                        ->findBy(['question' => $interaction->getId()]);

         return count($response);
     }

     /**
      * abstract method
      * To calculate the score for a question.
      *
      *
      * @return float userScore
      */
     abstract public function mark();

     /**
      * abstract method
      * Get score max possible for a question.
      *
      *
      * @return float
      */
     abstract public function maxScore();

     /**
      * abstract method.
      *
      * @param int $questionId
      *
      * @return \UJM\ExoBundle\Entity\InteractionX (qcm, graphic, open, ...)
      */
     abstract public function getInteractionX($questionId);
}
