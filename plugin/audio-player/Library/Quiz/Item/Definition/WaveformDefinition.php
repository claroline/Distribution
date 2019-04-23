<?php

namespace Claroline\AudioPlayerBundle\Library\Quiz\Item\Definition;

use Claroline\AudioPlayerBundle\Entity\Quiz\ItemType\WaveformQuestion;
use Claroline\AudioPlayerBundle\Serializer\Quiz\WaveformQuestionSerializer;
use Claroline\AudioPlayerBundle\Validator\Quiz\JsonSchema\Attempt\AnswerData\WaveformAnswerValidator;
use Claroline\AudioPlayerBundle\Validator\Quiz\JsonSchema\Item\Type\WaveformQuestionValidator;
use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Attempt\Answer;
use UJM\ExoBundle\Entity\ItemType\AbstractItem;
use UJM\ExoBundle\Library\Attempt\CorrectedAnswer;
use UJM\ExoBundle\Library\Item\Definition\AbstractDefinition;

/**
 * Waveform question definition.
 *
 * @DI\Service("claroline_audio.definition.question_waveform")
 * @DI\Tag("ujm_exo.definition.item")
 */
class WaveformDefinition extends AbstractDefinition
{
    /**
     * @var WaveformQuestionValidator
     */
    private $validator;

    /**
     * @var WaveformAnswerValidator
     */
    private $answerValidator;

    /**
     * @var WaveformQuestionSerializer
     */
    private $serializer;

    /**
     * WaveformDefinition constructor.
     *
     * @param WaveformQuestionValidator  $validator
     * @param WaveformAnswerValidator    $answerValidator
     * @param WaveformQuestionSerializer $serializer
     *
     * @DI\InjectParams({
     *     "validator"       = @DI\Inject("claroline_audio.validator.question_waveform"),
     *     "answerValidator" = @DI\Inject("claroline_audio.validator.answer_waveform"),
     *     "serializer"      = @DI\Inject("claroline_audio.serializer.question_waveform")
     * })
     */
    public function __construct(
        WaveformQuestionValidator $validator,
        WaveformAnswerValidator $answerValidator,
        WaveformQuestionSerializer $serializer
    ) {
        $this->validator = $validator;
        $this->answerValidator = $answerValidator;
        $this->serializer = $serializer;
    }

    /**
     * Gets the waveform question mime-type.
     *
     * @return string
     */
    public static function getMimeType()
    {
        return 'application/x.waveform+json';
    }

    /**
     * Gets the waveform question entity.
     *
     * @return string
     */
    public static function getEntityClass()
    {
        return WaveformQuestion::class;
    }

    /**
     * Gets the waveform question validator.
     *
     * @return WaveformQuestionValidator
     */
    protected function getQuestionValidator()
    {
        return $this->validator;
    }

    /**
     * Gets the waveform answer validator.
     *
     * @return WaveformAnswerValidator
     */
    protected function getAnswerValidator()
    {
        return $this->answerValidator;
    }

    /**
     * Gets the waveform question serializer.
     *
     * @return WaveformQuestionSerializer
     */
    protected function getQuestionSerializer()
    {
        return $this->serializer;
    }

    /**
     * @param WaveformQuestion $question
     * @param $answer
     *
     * @return CorrectedAnswer
     */
    public function correctAnswer(AbstractItem $question, $answer)
    {
//        $corrected = new CorrectedAnswer();
//
//        /** @var Area $area */
//        foreach ($question->getAreas() as $area) {
//            if (is_array($answer)) {
//                foreach ($answer as $coords) {
//                    if ($this->isPointInArea($area, $coords['x'], $coords['y'])) {
//                        if ($area->getScore() > 0) {
//                            $corrected->addExpected($area);
//                        } else {
//                            $corrected->addUnexpected($area);
//                        }
//                    } elseif ($area->getScore() > 0) {
//                        $corrected->addMissing($area);
//                    }
//                }
//            } elseif ($area->getScore() > 0) {
//                $corrected->addMissing($area);
//            }
//        }
//
//        return $corrected;
    }

    /**
     * @param AbstractItem $question
     *
     * @return array
     */
    public function expectAnswer(AbstractItem $question)
    {
//        return array_filter($question->getAreas()->toArray(), function (Area $area) {
//            return 0 < $area->getScore();
//        });
        return [];
    }

    /**
     * @param AbstractItem $openQuestion
     * @param array        $answersData
     * @param int          $total
     *
     * @return array
     */
    public function getStatistics(AbstractItem $openQuestion, array $answersData, $total)
    {
//        $areas = [];
//
//        foreach ($answersData as $answerData) {
//            $areasToInc = [];
//
//            foreach ($answerData as $areaAnswer) {
//                if (isset($areaAnswer['x']) && isset($areaAnswer['y'])) {
//                    $isInArea = false;
//
//                    foreach ($graphicQuestion->getAreas() as $area) {
//                        if ($this->isPointInArea($area, $areaAnswer['x'], $areaAnswer['y'])) {
//                            $areasToInc[$area->getUuid()] = true;
//                            $isInArea = true;
//                        }
//                    }
//                    if (!$isInArea) {
//                        $areas['_others'] = isset($areas['_others']) ? $areas['_others'] + 1 : 1;
//                    }
//                }
//            }
//            foreach (array_keys($areasToInc) as $areaId) {
//                $areas[$areaId] = isset($areas[$areaId]) ? $areas[$areaId] + 1 : 1;
//            }
//        }
//
//        return [
//            'areas' => $areas,
//            'total' => $total,
//            'unanswered' => $total - count($answersData),
//        ];
        return [];
    }

    /**
     * No additional identifier to regenerate.
     *
     * @param AbstractItem $item
     */
    public function refreshIdentifiers(AbstractItem $item)
    {
        return;
    }

    public function getCsvTitles(AbstractItem $item)
    {
        return [$item->getQuestion()->getContentText()];
    }

    public function getCsvAnswers(AbstractItem $item, Answer $answer)
    {
//        $data = json_decode($answer->getData(), true);
//        $answers = [];
//
//        foreach ($data as $point) {
//            $answers[] = "[{$point['x']},{$point['y']}]";
//        }
//
//        $compressor = new ArrayCompressor();
//
//        return [$compressor->compress($answers)];
    }
}
