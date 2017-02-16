<?php

namespace UJM\ExoBundle\Library\Item\Definition;

use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\ItemType\AbstractItem;
use UJM\ExoBundle\Entity\ItemType\OpenQuestion;
use UJM\ExoBundle\Entity\Misc\Keyword;
use UJM\ExoBundle\Library\Attempt\CorrectedAnswer;
use UJM\ExoBundle\Library\Item\ItemType;
use UJM\ExoBundle\Serializer\Item\Type\TextContentItemSerializer;
use UJM\ExoBundle\Validator\JsonSchema\Attempt\AnswerData\WordsAnswerValidator;
use UJM\ExoBundle\Validator\JsonSchema\Item\Type\TextContentItemValidator;

/**
 * Words question definition.
 *
 * @DI\Service("ujm_exo.definition.item_text_content")
 * @DI\Tag("ujm_exo.definition.item")
 */
class TextContentItemDefinition extends AbstractDefinition
{
    /**
     * @var TextContentItemValidator
     */
    private $validator;

    /**
     * @var WordsAnswerValidator
     */
    private $answerValidator;

    /**
     * @var WordsQuestionSerializer
     */
    private $serializer;

    /**
     * WordsDefinition constructor.
     *
     * @param TextContentItemValidator  $validator
     * @param WordsAnswerValidator      $answerValidator
     * @param TextContentItemSerializer $serializer
     *
     * @DI\InjectParams({
     *     "validator"       = @DI\Inject("ujm_exo.validator.item_text_content"),
     *     "answerValidator" = @DI\Inject("ujm_exo.validator.answer_words"),
     *     "serializer"      = @DI\Inject("ujm_exo.serializer.item_text_content")
     * })
     */
    public function __construct(
        TextContentItemValidator $validator,
        WordsAnswerValidator $answerValidator,
        TextContentItemSerializer $serializer)
    {
        $this->validator = $validator;
        $this->answerValidator = $answerValidator;
        $this->serializer = $serializer;
    }

    /**
     * Gets the text content item mime-type.
     *
     * @return string
     */
    public static function getMimeType()
    {
        return ItemType::TEXT_CONTENT;
    }

    /**
     * Gets the text content item entity.
     *
     * @return string
     */
    public static function getEntityClass()
    {
        return '\UJM\ExoBundle\Entity\ItemType\TextContentItem';
    }

    /**
     * Gets the text content item validator.
     *
     * @return TextContentItemValidator
     */
    protected function getQuestionValidator()
    {
        return $this->validator;
    }

    /**
     * Gets the words answer validator.
     *
     * @return WordsAnswerValidator
     */
    protected function getAnswerValidator()
    {
        return $this->answerValidator;
    }

    /**
     * Gets the text content item serializer.
     *
     * @return TextContentItemSerializer
     */
    protected function getQuestionSerializer()
    {
        return $this->serializer;
    }

//    /**
//     * @param OpenQuestion $question
//     * @param string       $answer
//     *
//     * @return CorrectedAnswer
//     */
    public function correctAnswer(AbstractItem $question, $answer)
    {
        $corrected = new CorrectedAnswer();
//        foreach ($question->getKeywords() as $keyword) {
//            if ($this->containKeyword($answer, $keyword)) {
//                if (0 < $keyword->getScore()) {
//                    $corrected->addExpected($keyword);
//                } else {
//                    $corrected->addUnexpected($keyword);
//                }
//            } elseif (0 < $keyword->getScore()) {
//                $corrected->addMissing($keyword);
//            }
//        }

        return $corrected;
    }
//
//    /**
//     * @param OpenQuestion $question
//     *
//     * @return array
//     */
    public function expectAnswer(AbstractItem $question)
    {
        return [];
//        return array_filter($question->getKeywords()->toArray(), function (Keyword $keyword) {
//            return 0 < $keyword->getScore();
//        });
    }
//
//    /**
//     * @param OpenQuestion $wordsQuestion
//     * @param array        $answersData
//     *
//     * @return array
//     */
    public function getStatistics(AbstractItem $wordsQuestion, array $answersData)
    {
        return [];
//        $keywords = [];
//
//        foreach ($answersData as $answerData) {
//            /** @var Keyword $keyword */
//            foreach ($wordsQuestion->getKeywords() as $keyword) {
//                if ($this->containKeyword($answerData, $keyword)) {
//                    if (!isset($keywords[$keyword->getId()])) {
//                        // First answer to contain the keyword
//                        $keywords[$keyword->getId()] = new \stdClass();
//                        $keywords[$keyword->getId()]->id = $keyword->getId();
//                        $keywords[$keyword->getId()]->count = 0;
//                    }
//
//                    ++$keywords[$keyword->getId()]->count;
//                }
//            }
//        }
//
//        return array_values($keywords);
    }
//
//    private function containKeyword($string, Keyword $keyword)
//    {
//        $found = false;
//
//        $flags = $keyword->isCaseSensitive() ? 'i' : '';
//        if (1 === preg_match('/'.$keyword->getText().'/'.$flags, $string)) {
//            $found = true;
//        }
//
//        return $found;
//    }
}
