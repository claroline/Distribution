<?php

namespace UJM\ExoBundle\Manager;

use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Hint;
use UJM\ExoBundle\Entity\LinkHintPaper;
use UJM\ExoBundle\Entity\Paper;
use UJM\ExoBundle\Entity\Question;
use UJM\ExoBundle\Repository\HintRepository;
use UJM\ExoBundle\Repository\PaperRepository;
use UJM\ExoBundle\Serializer\HintSerializer;
use UJM\ExoBundle\Transfer\Json\ValidationException;
use UJM\ExoBundle\Validator\JsonSchema\HintValidator;

/**
 * @DI\Service("ujm.exo.hint_manager")
 */
class HintManager
{
    /**
     * @var ObjectManager
     */
    private $om;

    /**
     * @var HintValidator
     */
    private $validator;

    /**
     * @var HintSerializer
     */
    private $serializer;

    /**
     * HintManager constructor.
     *
     * @DI\InjectParams({
     *     "objectManager" = @DI\Inject("claroline.persistence.object_manager"),
     *     "validator"     = @DI\Inject("ujm_exo.validator.hint"),
     *     "serializer"    = @DI\Inject("ujm_exo.serializer.hint")
     * })
     *
     * @param ObjectManager  $objectManager
     * @param HintValidator  $validator
     * @param HintSerializer $serializer
     */
    public function __construct(
        ObjectManager $objectManager,
        HintValidator $validator,
        HintSerializer $serializer)
    {
        $this->om = $objectManager;
        $this->validator = $validator;
        $this->serializer = $serializer;
    }

    /**
     * Validates and creates a new Hint from raw data.
     *
     * @param \stdClass $data
     *
     * @return Hint
     *
     * @throws ValidationException
     */
    public function create(\stdClass $data)
    {
        return $this->update(new Hint(), $data);
    }

    /**
     * Validates and updates a Hint entity with raw data.
     *
     * @param Hint      $hint
     * @param \stdClass $data
     *
     * @return Hint
     *
     * @throws ValidationException
     */
    public function update(Hint $hint, \stdClass $data)
    {
        // Validate received data
        $errors = $this->validator->validate($data);
        if (count($errors) > 0) {
            throw new ValidationException('Hint is not valid', $errors);
        }

        // Update Exercise with new data
        $this->serializer->deserialize($data, $hint);

        // Save to DB
        $this->om->persist($hint);
        $this->om->flush();

        return $hint;
    }

    /**
     * Exports an Hint.
     *
     * @param Hint  $hint
     * @param array $options
     *
     * @return \stdClass
     */
    public function export(Hint $hint, array $options = [])
    {
        return $this->serializer->serialize($hint, $options);
    }

    /**
     * Export an Hint.
     *
     * @deprecated use export() instead
     *
     * @param Hint $hint
     * @param bool $withSolution
     *
     * @return \stdClass
     */
    public function exportHint(Hint $hint, $withSolution = false)
    {
        $hintData = new \stdClass();
        $hintData->id = (string) $hint->getId();
        $hintData->penalty = $hint->getPenalty();

        if ($withSolution) {
            $hintData->value = $hint->getValue();
        }

        return $hintData;
    }

    /**
     * Returns whether a hint is related to a paper.
     *
     * @param Paper $paper
     * @param Hint  $hint
     *
     * @return bool
     */
    public function hasHint(Paper $paper, Hint $hint)
    {
        /** @var PaperRepository $repo */
        $repo = $this->om->getRepository('UJMExoBundle:Paper');

        return $repo->hasHint($paper, $hint);
    }

    /**
     * Returns the contents of a hint and records a log asserting that the hint
     * has been consulted for a given paper.
     *
     * @param Paper $paper
     * @param Hint  $hint
     *
     * @return string
     */
    public function viewHint(Paper $paper, Hint $hint)
    {
        $log = $this->om->getRepository('UJMExoBundle:LinkHintPaper')
            ->findOneBy(['paper' => $paper, 'hint' => $hint]);

        if (!$log) {
            $log = new LinkHintPaper($hint, $paper);
            $this->om->persist($log);
            $this->om->flush();
        }

        return $hint->getValue();
    }

    /**
     * Get Hints used by a User for a Question.
     *
     * @param Paper    $paper
     * @param Question $question
     *
     * @return Hint[]
     */
    public function getUsedHints(Paper $paper, Question $question)
    {
        /** @var HintRepository $repo */
        $repo = $this->om->getRepository('UJMExoBundle:Hint');

        return $repo->findViewedByPaperAndQuestion($paper, $question);
    }

    /**
     * Get score penalty for a Question based on Hints used by the User.
     *
     * @param Paper    $paper
     * @param Question $question
     *
     * @return float
     */
    public function getPenalty(Paper $paper, Question $question)
    {
        $penalty = 0;
        $usedHints = $this->getUsedHints($paper, $question);
        foreach ($usedHints as $used) {
            $penalty += $used->getPenalty();
        }

        return $penalty;
    }
}
