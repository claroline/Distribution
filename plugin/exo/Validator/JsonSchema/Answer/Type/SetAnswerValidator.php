<?php

namespace UJM\ExoBundle\Validator\JsonSchema\Answer\Type;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Misc\Label;
use UJM\ExoBundle\Entity\Misc\Proposal;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;

/**
 * @DI\Service("ujm_exo.validator.answer_set")
 */
class SetAnswerValidator extends JsonSchemaValidator
{
    public function getJsonSchemaUri()
    {
        return 'answer-data/set/schema.json';
    }

    /**
     * Performs additional validations.
     *
     * @param \stdClass $question
     * @param array     $options
     *
     * @return array
     */
    public function validateAfterSchema($question, array $options = [])
    {
        $proposals = $question->getProposals()->toArray();

        $proposalIds = array_map(function (Proposal $proposal) {
            return (string) $proposal->getId();
        }, $proposals);

        $labels = $question->getLabels()->toArray();
        $labelsIds = array_map(function (Label $label) {
            return (string) $label->getId();
        }, $labels);

        $sourceIds = [];
        $targetIds = [];
        foreach ($data as $answer) {
            if ($answer !== '') {
                $set = explode(',', $answer);
                array_push($sourceIds, $set[0]);
                array_push($targetIds, $set[1]);
            }
        }

        foreach ($sourceIds as $id) {
            if (!in_array($id, $proposalIds)) {
                return ['Answer array identifiers must reference a question proposal id'];
            }
        }

        foreach ($targetIds as $id) {
            if (!in_array($id, $labelsIds)) {
                return ['Answer array identifiers must reference a question proposal associated label id'];
            }
        }

        return [];
    }
}
