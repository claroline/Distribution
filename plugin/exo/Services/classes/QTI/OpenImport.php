<?php

namespace UJM\ExoBundle\Services\classes\QTI;

use UJM\ExoBundle\Entity\InteractionOpen;
use UJM\ExoBundle\Entity\TypeOpenQuestion;
use UJM\ExoBundle\Library\Question\QuestionType;

/**
 * To import an open question.
 */
class OpenImport extends QtiImport
{
    protected $interactionOpen;
    protected $codeType;

    /**
     * Implements the abstract method.
     *
     * @param qtiRepository $qtiRepos
     * @param DOMElement    $assessmentItem assessmentItem of the question to imported
     * @param string        $path           parent directory of the files
     */
    public function import(qtiRepository $qtiRepos, $assessmentItem, $path)
    {
        $this->qtiRepos = $qtiRepos;
        $this->path = $path;
        $this->getQTICategory();
        $this->initAssessmentItem($assessmentItem);

        if ($this->qtiValidate() === false) {
            return false;
        }

        $codeTypeOpen = $this->getCodeTypeOpen();

        $mimeType = QuestionType::WORDS;
        if ('long' === $codeTypeOpen->getValue()) {
            $mimeType = QuestionType::OPEN;
        }

        $this->createQuestion(InteractionOpen::TYPE, $mimeType);
        $this->createInteractionOpen($codeTypeOpen);
    }

    /**
     * Create the InteractionOpen object.
     */
    protected function createInteractionOpen($codeTypeOpen)
    {
        $ocd = $this->assessmentItem->getElementsByTagName('outcomeDeclaration')->item(0);
        $df = $ocd->getElementsByTagName('defaultValue')->item(0);
        $val = $df->getElementsByTagName('value')->item(0);

        $this->interactionOpen = new InteractionOpen();
        $this->interactionOpen->setQuestion($this->question);
        $this->interactionOpen->setTypeOpenQuestion($codeTypeOpen);
        $this->interactionOpen->setScoreMaxLongResp($val->nodeValue);

        $this->om->persist($this->interactionOpen);
        $this->om->flush();
    }

    /**
     * return the TypeOpenQuestion.
     *
     *
     * @return TypeOpenQuestion
     */
    protected function getCodeTypeOpen()
    {
        $type = $this->om
                     ->getRepository('UJMExoBundle:TypeOpenQuestion')
                     ->findOneByCode($this->codeType);

        return $type;
    }

    /**
     * Implements the abstract method.
     */
    protected function getPrompt()
    {
        return $this->getPromptChild();
    }

    /**
     * Implements the abstract method.
     */
    protected function qtiValidate()
    {
        $validated = false;
        switch ($this->getCodeTypeOpen()) {
            case 'numerical':
                $validated = $this->numericalQtiValidate();
                break;
            case 'long':
                $validated = $this->longQtiValidate();
                break;
            case 'short':
                $validated = $this->shortQtiValidate();
                break;
            case 'oneWord':
                $validated = $this->oneWordValidate();
                break;
        }

        return $validated;
    }

    private function numericalQtiValidate()
    {
        return true;
    }

    private function longQtiValidate()
    {
        if (empty($this->assessmentItem->getElementsByTagName('responseDeclaration')->item(0))) {
            return false;
        }

        return true;
    }

    private function shortQtiValidate()
    {
        $rd = $this->assessmentItem->getElementsByTagName('responseDeclaration')->item(0);
        if (empty($rd) || empty($rd->getElementsByTagName('mapping')->item(0))) {
            return false;
        }

        return true;
    }

    private function oneWordValidate()
    {
        return $this->shortQtiValidate();
    }
}
