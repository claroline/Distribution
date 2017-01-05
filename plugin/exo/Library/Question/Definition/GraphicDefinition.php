<?php

namespace UJM\ExoBundle\Library\Question\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\QuestionType\AbstractQuestion;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Serializer\Question\Type\GraphicQuestionSerializer;
use UJM\ExoBundle\Validator\JsonSchema\Attempt\AnswerData\GraphicAnswerValidator;
use UJM\ExoBundle\Validator\JsonSchema\Question\Type\GraphicQuestionValidator;

/**
 * Graphic question definition.
 *
 * @DI\Service("ujm_exo.definition.question_graphic")
 * @DI\Tag("ujm_exo.definition.question")
 */
class GraphicDefinition extends AbstractDefinition
{
    /**
     * @var GraphicQuestionValidator
     */
    private $validator;

    /**
     * @var GraphicAnswerValidator
     */
    private $answerValidator;

    /**
     * @var GraphicQuestionSerializer
     */
    private $serializer;

    /**
     * GraphicDefinition constructor.
     *
     * @param GraphicQuestionValidator  $validator
     * @param GraphicAnswerValidator    $answerValidator
     * @param GraphicQuestionSerializer $serializer
     *
     * @DI\InjectParams({
     *     "validator"       = @DI\Inject("ujm_exo.validator.question_graphic"),
     *     "answerValidator" = @DI\Inject("ujm_exo.validator.answer_graphic"),
     *     "serializer"      = @DI\Inject("ujm_exo.serializer.question_graphic")
     * })
     */
    public function __construct(
        GraphicQuestionValidator $validator,
        GraphicAnswerValidator $answerValidator,
        GraphicQuestionSerializer $serializer)
    {
        $this->validator = $validator;
        $this->answerValidator = $answerValidator;
        $this->serializer = $serializer;
    }

    /**
     * Gets the graphic question mime-type.
     *
     * @return string
     */
    public static function getMimeType()
    {
        return QuestionType::GRAPHIC;
    }

    /**
     * Gets the graphic question entity.
     *
     * @return string
     */
    public static function getEntityClass()
    {
        return '\UJM\ExoBundle\Entity\QuestionType\GraphicQuestion';
    }

    /**
     * Gets the graphic question validator.
     *
     * @return GraphicQuestionValidator
     */
    protected function getQuestionValidator()
    {
        return $this->validator;
    }

    /**
     * Gets the graphic question serializer.
     *
     * @return GraphicQuestionSerializer
     */
    protected function getQuestionSerializer()
    {
        return $this->serializer;
    }

    /**
     * Gets the graphic answer validator.
     *
     * @return GraphicAnswerValidator
     */
    protected function getAnswerValidator()
    {
        return $this->answerValidator;
    }

    public function correctAnswer(AbstractQuestion $question, $answer)
    {
        // TODO: Implement correctAnswer() method.
    }

    public function expectAnswer(AbstractQuestion $question)
    {
        // TODO: Implement expectAnswer() method.

        return [];
    }

    public function getStatistics(AbstractQuestion $graphicQuestion, array $answers)
    {
        $areasMap = [];
        foreach ($graphicQuestion->getAreas() as $area) {
            $areasMap[$area->getId()] = $this->exportArea($area);
        }

        $areas = [];

        /** @var Answer $answer */
        foreach ($answers as $answer) {
            $decoded = $this->convertAnswerDetails($answer);

            foreach ($decoded as $coords) {
                foreach ($areasMap as $area) {
                    if ($this->graphicService->isInArea($coords, $area)) {
                        if (!isset($areas[$area->id])) {
                            $areas[$area->id] = new \stdClass();
                            $areas[$area->id]->id = $area->id;
                            $areas[$area->id]->count = 0;
                        }

                        ++$areas[$area->id]->count;
                    }
                }
            }
        }

        return $areas;
    }
}
