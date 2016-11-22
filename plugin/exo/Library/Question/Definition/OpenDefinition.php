<?php

namespace UJM\ExoBundle\Library\Question\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\AbstractInteraction;
use UJM\ExoBundle\Library\Question\QuestionType;
use UJM\ExoBundle\Serializer\Answer\Type\OpenAnswerSerializer;
use UJM\ExoBundle\Serializer\Question\Type\OpenQuestionSerializer;
use UJM\ExoBundle\Validator\JsonSchema\Question\Type\OpenQuestionValidator;

/**
 * Open question definition.
 *
 * @DI\Service("ujm_exo.definition.question_open")
 * @DI\Tag("ujm_exo.definition.question")
 */
class OpenDefinition extends AbstractDefinition
{
    /**
     * @var OpenQuestionValidator
     */
    private $validator;

    /**
     * @var OpenQuestionSerializer
     */
    private $serializer;

    /**
     * @var OpenAnswerSerializer
     */
    private $answerSerializer;

    /**
     * OpenDefinition constructor.
     *
     * @param OpenQuestionValidator  $validator
     * @param OpenQuestionSerializer $serializer
     * @param OpenAnswerSerializer $answerSerializer
     *
     * @DI\InjectParams({
     *     "validator"  = @DI\Inject("ujm_exo.validator.question_open"),
     *     "serializer" = @DI\Inject("ujm_exo.serializer.question_open"),
     *     "answerSerializer" = @DI\Inject("ujm_exo.serializer.answer_open")
     * })
     */
    public function __construct(
        OpenQuestionValidator $validator,
        OpenQuestionSerializer $serializer,
        OpenAnswerSerializer $answerSerializer)
    {
        $this->validator = $validator;
        $this->serializer = $serializer;
        $this->answerSerializer = $answerSerializer;
    }

    /**
     * Gets the open question mime-type.
     *
     * @return string
     */
    public function getMimeType()
    {
        return QuestionType::OPEN;
    }

    /**
     * Gets the open question entity.
     *
     * @return string
     */
    public function getEntityClass()
    {
        return 'OpenQuestion';
    }

    /**
     * Gets the open question validator.
     *
     * @return OpenQuestionValidator
     */
    protected function getQuestionValidator()
    {
        return $this->validator;
    }

    /**
     * Gets the open question serializer.
     *
     * @return OpenQuestionSerializer
     */
    protected function getQuestionSerializer()
    {
        return $this->serializer;
    }

    /**
     * Gets the open answer serializer.
     *
     * @return OpenAnswerSerializer
     */
    protected function getAnswerSerializer()
    {
        return $this->answerSerializer;
    }

    public function calculateTotal(AbstractInteraction $question)
    {
        // TODO: Implement calculateTotal() method.
    }

    public function getStatistics(AbstractInteraction $openQuestion, array $answers)
    {
        return null;
    }
}
