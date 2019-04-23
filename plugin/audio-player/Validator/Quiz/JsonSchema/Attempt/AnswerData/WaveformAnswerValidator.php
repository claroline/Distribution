<?php

namespace Claroline\AudioPlayerBundle\Validator\Quiz\JsonSchema\Attempt\AnswerData;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Options\Validation;
use UJM\ExoBundle\Library\Validator\JsonSchemaValidator;

/**
 * @DI\Service("claroline_audio.validator.answer_waveform")
 */
class WaveformAnswerValidator extends JsonSchemaValidator
{
    public function getJsonSchemaUri()
    {
        return 'answer-data/waveform/schema.json';
    }

    /**
     * Performs additional validations.
     *
     * @param array $answerData
     * @param array $options
     *
     * @return array
     */
    public function validateAfterSchema($answerData, array $options = [])
    {
        $question = !empty($options[Validation::QUESTION]) ? $options[Validation::QUESTION] : null;

        if (empty($question)) {
            throw new \LogicException('Answer validation : Cannot perform additional validation without question.');
        }

        $errors = [];
        $done = [];

        foreach ($answerData as $i => $sectionA) {
            $startA = $sectionA['start'] - $sectionA['startTolerance'];
            $endA = $sectionA['end'] - $sectionA['endTolerance'];

            foreach ($answerData as $j => $sectionB) {
                if (!isset($done[$j])) {
                    $startB = $sectionB['start'] - $sectionB['startTolerance'];
                    $endB = $sectionB['end'] - $sectionB['endTolerance'];

                    if ($startA >= $startB && $startA <= $endB) {
                        $errors[] = [
                            'path' => "/[{$i}].start",
                            'message' => "Start position of [{$i}] is in [{$j}]",
                        ];
                    }
                    if ($endA >= $startB && $endA <= $endB) {
                        $errors[] = [
                            'path' => "/[{$i}].end",
                            'message' => "End position of [{$i}] is in [{$j}]",
                        ];
                    }
                    if ($startA < $startB && $endA > $endB) {
                        $errors[] = [
                            'path' => "/[{$i}]",
                            'message' => "Section [{$i}] is overlayed by [{$j}]",
                        ];
                    }
                }
            }
            $done[$i] = true;
        }

        return $errors;
    }
}
