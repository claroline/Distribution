<?php

namespace UJM\ExoBundle\Library\Item\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\ItemType\AbstractItem;
use UJM\ExoBundle\Library\Attempt\CorrectedAnswer;
use UJM\ExoBundle\Library\Item\ItemType;
use UJM\ExoBundle\Serializer\Item\Type\AudioContentItemSerializer;
use UJM\ExoBundle\Validator\JsonSchema\Attempt\AnswerData\AudioContentAnswerValidator;
use UJM\ExoBundle\Validator\JsonSchema\Item\Type\AudioContentItemValidator;

/**
 * Audio content item definition.
 *
 * @DI\Service("ujm_exo.definition.item_audio_content")
 * @DI\Tag("ujm_exo.definition.item")
 */
class AudioContentItemDefinition extends AbstractDefinition
{
    /**
     * @var AudioContentItemValidator
     */
    private $validator;

    /**
     * @var AudioContentAnswerValidator
     */
    private $answerValidator;

    /**
     * @var AudioContentItemSerializer
     */
    private $serializer;

    /**
     * AudioContentItemDefinition constructor.
     *
     * @param AudioContentItemValidator   $validator
     * @param AudioContentAnswerValidator $answerValidator
     * @param AudioContentItemSerializer  $serializer
     *
     * @DI\InjectParams({
     *     "validator"       = @DI\Inject("ujm_exo.validator.item_audio_content"),
     *     "answerValidator" = @DI\Inject("ujm_exo.validator.answer_audio_content"),
     *     "serializer"      = @DI\Inject("ujm_exo.serializer.item_audio_content")
     * })
     */
    public function __construct(
        AudioContentItemValidator $validator,
        AudioContentAnswerValidator $answerValidator,
        AudioContentItemSerializer $serializer)
    {
        $this->validator = $validator;
        $this->answerValidator = $answerValidator;
        $this->serializer = $serializer;
    }

    /**
     * Gets the audio content item mime-type.
     *
     * @return string
     */
    public static function getMimeType()
    {
        return ItemType::AUDIO_CONTENT;
    }

    /**
     * Gets the audio content item entity.
     *
     * @return string
     */
    public static function getEntityClass()
    {
        return '\UJM\ExoBundle\Entity\ItemType\AudioContentItem';
    }

    /**
     * Gets the audio content item validator.
     *
     * @return AudioContentItemValidator
     */
    protected function getQuestionValidator()
    {
        return $this->validator;
    }

    /**
     * Gets the audio content answer validator.
     *
     * @return AudioContentAnswerValidator
     */
    protected function getAnswerValidator()
    {
        return $this->answerValidator;
    }

    /**
     * Gets the audio content item serializer.
     *
     * @return AudioContentItemSerializer
     */
    protected function getQuestionSerializer()
    {
        return $this->serializer;
    }

    public function correctAnswer(AbstractItem $item, $answer)
    {
        return new CorrectedAnswer();
    }

    public function expectAnswer(AbstractItem $item)
    {
        return [];
    }

    public function getStatistics(AbstractItem $item, array $answersData)
    {
        return [];
    }
}
