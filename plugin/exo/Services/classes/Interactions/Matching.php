<?php

namespace UJM\ExoBundle\Services\classes\Interactions;

use JMS\DiExtraBundle\Annotation as DI;

/**
 * Services for the matching.
 *
 * @DI\Service("ujm.exo.matching_service")
 */
class Matching extends Interaction
{
    /**
     * implement the abstract method
     * To calculate the score.
     *
     *
     * @param \UJM\ExoBundle\Entity\InteractionMatching $interMatching
     * @param float                                     $penalty          penalty if the user showed hints
     * @param array                                     $tabRightResponse
     * @param array                                     $tabResponseIndex
     *
     * @return string userScore/scoreMax
     */
    public function mark(
        \UJM\ExoBundle\Entity\InteractionMatching $interMatching = null,
        $penalty = null, $tabRightResponse = null,
        $tabResponseIndex = null
    ) {
        $em = $this->doctrine->getManager();
        $score = 0;

        foreach ($tabRightResponse as $labelId => $value) {
            $rightResponseArray = explode('-', $tabRightResponse[$labelId]);
            $responseArray = explode('-', $tabResponseIndex[$labelId]);
            foreach ($responseArray as $responseGiven) {
                if (in_array($responseGiven, $rightResponseArray)) {
                    $label = $em->getRepository('UJMExoBundle:Label')
                        ->find($labelId);
                    $score += $label->getScoreRightResponse();
                }
            }
        }

        if ($penalty) {
            $score = $score - $penalty;
        }

        if ($score < 0) {
            $score = 0;
        }

        return $score;
    }

    /**
     * implement the abstract method
     * Get score max possible for a matching question.
     *
     *
     * @param \UJM\ExoBundle\Entity\InteractionMatching $interMatching
     *
     * @return float
     */
    public function maxScore($interMatching = null)
    {
        $scoreMax = 0;

        foreach ($interMatching->getLabels() as $label) {
            $scoreMax += $label->getScoreRightResponse();
        }

        return $scoreMax;
    }

    /**
     * implement the abstract method.
     *
     * @param int $questionId
     *
     * @return \UJM\ExoBundle\Entity\InteractionMatching
     */
    public function getInteractionX($questionId)
    {
        return $this->doctrine->getManager()
            ->getRepository('UJMExoBundle:InteractionMatching')
            ->findOneByQuestion($questionId);
    }

    /**
     * Get the types of Matching, Multiple response, unique response.
     *
     *
     * @return array
     */
    public function getTypeMatching()
    {
        $em = $this->doctrine->getManager();

        $typeMatching = array();
        $types = $em->getRepository('UJMExoBundle:TypeMatching')
            ->findAll();

        foreach ($types as $type) {
            $typeMatching[$type->getId()] = $type->getCode();
        }

        return $typeMatching;
    }

    /**
     * For the correction of a matching question :
     * init array of responses of user indexed by labelId
     * init array of rights responses indexed by labelId.
     *
     *
     * @param string                                    $response
     * @param \UJM\ExoBundle\Entity\InteractionMatching $interMatching
     *
     * @return array of arrays
     */
    public function initTabResponseMatching($response, $interMatching)
    {
        $tabsResponses = array();

        $tabResponseIndex = $this->getTabResponseIndex($response);
        $tabRightResponse = $this->initTabRightResponse($interMatching);

        //add in $tabResponseIndex label empty
        foreach ($interMatching->getLabels() as $label) {
            if (!isset($tabResponseIndex[$label->getId()])) {
                $tabResponseIndex[$label->getId()] = null;
            }
        }

        $tabsResponses[0] = $tabResponseIndex;
        $tabsResponses[1] = $tabRightResponse;

        return $tabsResponses;
    }

    /**
     * init array of rights responses indexed by labelId.
     *
     *
     * @param \UJM\ExoBundle\Entity\InteractionMatching $interMatching
     *
     * @return mixed[]
     */
    public function initTabRightResponse($interMatching)
    {
        $tabRightResponse = array();

        //array of rights responses indexed by labelId
        foreach ($interMatching->getProposals() as $proposal) {
            $associateLabel = $proposal->getAssociatedLabel();
            if ($associateLabel != null) {
                foreach ($associateLabel as $associatedLabel) {
                    $index = $associatedLabel->getId();
                    if (isset($tabRightResponse[$index])) {
                        $tabRightResponse[$index] .= '-'.$proposal->getId();
                    } else {
                        $tabRightResponse[$index] = $proposal->getId();
                    }
                }
            }
        }

        //add in $tabRightResponse label empty
        foreach ($interMatching->getLabels() as $label) {
            if (!isset($tabRightResponse[$label->getId()])) {
                $tabRightResponse[$label->getId()] = null;
            }
        }

        return $tabRightResponse;
    }

    /**
     * init array of student response indexed by labelId.
     *
     *
     * @param string $response
     *
     * @return int[]
     */
    private function getTabResponseIndex($response)
    {
        // in attempt of angular for the question bank
        if (is_array($response)) {
            $tabResponse = $response;
        } else {
            $tabResponse = explode(';', substr($response, 0, -1));
        }
        $tabResponseIndex = array();

        //array of responses of user indexed by labelId
        foreach ($tabResponse as $rep) {
            $tabTmp = preg_split('(,)', $rep);
            $end = count($tabTmp);
            for ($i = 1; $i < $end; ++$i) {
                if (isset($tabResponseIndex[$tabTmp[$i]])) {
                    $tabResponseIndex[$tabTmp[$i]] .= '-'.$tabTmp[0];
                } else {
                    $tabResponseIndex[$tabTmp[$i]] = $tabTmp[0];
                }
            }
        }

        return $tabResponseIndex;
    }
}
