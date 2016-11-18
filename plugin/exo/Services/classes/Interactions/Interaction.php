<?php

namespace UJM\ExoBundle\Services\classes\Interactions;

use Doctrine\Bundle\DoctrineBundle\Registry;
use JMS\DiExtraBundle\Annotation as DI;

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
