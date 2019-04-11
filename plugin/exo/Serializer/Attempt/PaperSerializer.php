<?php

namespace UJM\ExoBundle\Serializer\Attempt;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Attempt\Answer;
use UJM\ExoBundle\Entity\Attempt\Paper;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Serializer\UserSerializer;

/**
 * Serializer for paper data.
 *
 * @DI\Service("ujm_exo.serializer.paper")
 * @DI\Tag("claroline.serializer")
 */
class PaperSerializer
{
    use SerializerTrait;

    /**
     * @var UserSerializer
     */
    private $userSerializer;

    /**
     * @var AnswerSerializer
     */
    private $answerSerializer;

    /**
     * PaperSerializer constructor.
     *
     * @DI\InjectParams({
     *     "userSerializer"   = @DI\Inject("ujm_exo.serializer.user"),
     *     "answerSerializer" = @DI\Inject("ujm_exo.serializer.answer")
     * })
     *
     * @param UserSerializer   $userSerializer
     * @param AnswerSerializer $answerSerializer
     */
    public function __construct(UserSerializer $userSerializer, AnswerSerializer $answerSerializer)
    {
        $this->userSerializer = $userSerializer;
        $this->answerSerializer = $answerSerializer;
    }

    /**
     * Converts a Paper into a JSON-encodable structure.
     *
     * @param Paper $paper
     * @param array $options
     *
     * @return array
     */
    public function serialize(Paper $paper, array $options = [])
    {
        $serialized = [
            'id' => $paper->getUuid(),
            'number' => $paper->getNumber(),
            'finished' => !$paper->isInterrupted(),
            'user' => $paper->getUser() && !$paper->isAnonymized() ? $this->userSerializer->serialize($paper->getUser(), $options) : null,
            'startDate' => $paper->getStart() ? DateNormalizer::normalize($paper->getStart()) : null,
            'endDate' => $paper->getEnd() ? DateNormalizer::normalize($paper->getEnd()) : null,
            'structure' => json_decode($paper->getStructure()),
        ];

        // Adds detail information
        if (!in_array(Transfer::MINIMAL, $options)) {
            $serialized['answers'] = $this->serializeAnswers($paper, $options);
        }

        // Adds user score
        if (!in_array(Transfer::INCLUDE_USER_SCORE, $options)) {
            $serialized['score'] = $paper->getScore();
        }

        return $serialized;
    }

    /**
     * Converts raw data into a Paper entity.
     *
     * @param array $data
     * @param Paper $paper
     * @param array $options
     *
     * @return Paper
     */
    public function deserialize($data, Paper $paper = null, array $options = [])
    {
        $paper = $paper ?: new Paper();

        $this->sipe('id', 'setUuid', $data, $paper);
        $this->sipe('number', 'setNumber', $data, $paper);
        $this->sipe('score', 'setScore', $data, $paper);

        if (isset($data['startDate'])) {
            $startDate = DateNormalizer::denormalize($data['startDate']);
            $paper->setStart($startDate);
        }
        if (isset($data['endDate'])) {
            $endDate = DateNormalizer::denormalize($data['endDate']);
            $paper->setEnd($endDate);
        }
        if (isset($data['structure'])) {
            $paper->setStructure(json_encode($data['structure']));
        }
        if (isset($data['finished'])) {
            $paper->setInterrupted(!$data['finished']);
        }
        if (isset($data['answers'])) {
            $this->deserializeAnswers($paper, $data['answers'], $options);
        }

        return $paper;
    }

    /**
     * Serializes paper answers.
     *
     * @param Paper $paper
     * @param array $options
     *
     * @return array
     */
    private function serializeAnswers(Paper $paper, array $options = [])
    {
        // We need to inject the hints available in the structure
        $options['hints'] = [];
        $decoded = json_decode($paper->getStructure());

        foreach ($decoded->steps as $step) {
            foreach ($step->items as $item) {
                if (1 === preg_match('#^application\/x\.[^/]+\+json$#', $item->type)) {
                    foreach ($item->hints as $hint) {
                        $options['hints'][$hint->id] = $hint;
                    }
                }
            }
        }

        return array_map(function (Answer $answer) use ($options) {
            return $this->answerSerializer->serialize($answer, $options);
        }, $paper->getAnswers()->toArray());
    }

    private function deserializeAnswers(Paper $paper, array $answers, array $options = [])
    {
        foreach ($answers as $answerData) {
            $answer = $this->answerSerializer->deserialize($answerData, $paper->getAnswer($answerData['questionId']), $options);
            $paper->addAnswer($answer);
        }
    }
}
