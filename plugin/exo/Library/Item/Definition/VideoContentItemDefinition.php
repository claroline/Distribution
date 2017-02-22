<?php

namespace UJM\ExoBundle\Library\Item\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\ItemType\AbstractItem;
use UJM\ExoBundle\Library\Attempt\CorrectedAnswer;
use UJM\ExoBundle\Library\Item\ItemType;
use UJM\ExoBundle\Serializer\Item\Type\VideoContentItemSerializer;
use UJM\ExoBundle\Validator\JsonSchema\Attempt\AnswerData\VideoContentAnswerValidator;
use UJM\ExoBundle\Validator\JsonSchema\Item\Type\VideoContentItemValidator;

/**
 * Video content item definition.
 *
 * @DI\Service("ujm_exo.definition.item_video_content")
 * @DI\Tag("ujm_exo.definition.item")
 */
class VideoContentItemDefinition extends AbstractDefinition
{
    /**
     * @var VideoContentItemValidator
     */
    private $validator;

    /**
     * @var VideoContentAnswerValidator
     */
    private $answerValidator;

    /**
     * @var VideoContentItemSerializer
     */
    private $serializer;

    /**
     * VideoContentItemDefinition constructor.
     *
     * @param VideoContentItemValidator   $validator
     * @param VideoContentAnswerValidator $answerValidator
     * @param VideoContentItemSerializer  $serializer
     *
     * @DI\InjectParams({
     *     "validator"       = @DI\Inject("ujm_exo.validator.item_video_content"),
     *     "answerValidator" = @DI\Inject("ujm_exo.validator.answer_video_content"),
     *     "serializer"      = @DI\Inject("ujm_exo.serializer.item_video_content")
     * })
     */
    public function __construct(
        VideoContentItemValidator $validator,
        VideoContentAnswerValidator $answerValidator,
        VideoContentItemSerializer $serializer)
    {
        $this->validator = $validator;
        $this->answerValidator = $answerValidator;
        $this->serializer = $serializer;
    }

    /**
     * Gets the video content item mime-type.
     *
     * @return string
     */
    public static function getMimeType()
    {
        return ItemType::VIDEO_CONTENT;
    }

    /**
     * Gets the video content item entity.
     *
     * @return string
     */
    public static function getEntityClass()
    {
        return '\UJM\ExoBundle\Entity\ItemType\VideoContentItem';
    }

    /**
     * Gets the video content item validator.
     *
     * @return VideoContentItemValidator
     */
    protected function getQuestionValidator()
    {
        return $this->validator;
    }

    /**
     * Gets the video content answer validator.
     *
     * @return VideoContentAnswerValidator
     */
    protected function getAnswerValidator()
    {
        return $this->answerValidator;
    }

    /**
     * Gets the video content item serializer.
     *
     * @return VideoContentItemSerializer
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
