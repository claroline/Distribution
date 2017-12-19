<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Manager\Resource;

use Claroline\CoreBundle\Entity\Resource\AbstractResourceEvaluation;
use Claroline\CoreBundle\Entity\Resource\ResourceEvaluation;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Resource\ResourceUserEvaluation;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Event\ResourceEvaluationEvent;
use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

/**
 * @DI\Service("claroline.manager.resource_evaluation_manager")
 */
class ResourceEvaluationManager
{
    private $eventDispatcher;
    private $om;

    /**
     * @DI\InjectParams({
     *     "eventDispatcher" = @DI\Inject("event_dispatcher"),
     *     "om"              = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param EventDispatcherInterface $eventDispatcher
     * @param ObjectManager            $om
     */
    public function __construct(EventDispatcherInterface $eventDispatcher, ObjectManager $om)
    {
        $this->eventDispatcher = $eventDispatcher;
        $this->om = $om;

        $this->resourceUserEvaluationRepo = $om->getRepository('ClarolineCoreBundle:Resource\ResourceUserEvaluation');
        $this->resourceEvaluationRepo = $om->getRepository('ClarolineCoreBundle:Resource\ResourceEvaluation');
    }

    public function getResourceUserEvaluation(ResourceNode $node, User $user, $withCreation = true)
    {
        $evaluation = $this->resourceUserEvaluationRepo->findOneBy(['resourceNode' => $node, 'user' => $user]);

        if ($withCreation && empty($evaluation)) {
            $evaluation = $this->createResourceUserEvaluation($node, $user);
        }

        return $evaluation;
    }

    public function persistResourceUserEvaluation(ResourceUserEvaluation $evaluation)
    {
        $this->om->persist($evaluation);
        $this->om->flush();
    }

    public function createResourceUserEvaluation(ResourceNode $node, User $user)
    {
        $evaluation = new ResourceUserEvaluation();
        $evaluation->setResourceNode($node);
        $evaluation->setUser($user);
        $this->persistResourceUserEvaluation($evaluation);

        return $evaluation;
    }

    public function persistResourceEvaluation(ResourceEvaluation $evaluation)
    {
        $this->om->persist($evaluation);
        $this->om->flush();
    }

    public function createResourceEvaluation(
        ResourceNode $node,
        User $user,
        \DateTime $date = null,
        $status = null,
        $score = null,
        $scoreMin = null,
        $scoreMax = null,
        $customScore = null,
        $duration = null,
        $comment = null,
        $data = null,
        $forceStatus = false
    ) {
        $this->om->startFlushSuite();
        $resourceUserEvaluation = $this->getResourceUserEvaluation($node, $user);
        $evaluation = new ResourceEvaluation();
        $evaluation->setResourceUserEvaluation($resourceUserEvaluation);
        $evaluationDate = $date ? $date : new \DateTime();
        $evaluation->setDate($evaluationDate);
        $evaluation->setStatus($status);
        $evaluation->setScore($score);
        $evaluation->setScoreMin($scoreMin);
        $evaluation->setScoreMax($scoreMax);
        $evaluation->setCustomScore($customScore);
        $evaluation->setDuration($duration);
        $evaluation->setComment($comment);
        $evaluation->setData($data);
        $this->persistResourceEvaluation($evaluation);
        $this->updateResourceUserEvaluation($evaluation, $forceStatus);
        $this->eventDispatcher->dispatch('resource_evaluation', new ResourceEvaluationEvent($resourceUserEvaluation));
        $this->om->endFlushSuite();

        return $evaluation;
    }

    private function updateResourceUserEvaluation(ResourceEvaluation $evaluation, $forceStatus = false)
    {
        $reu = $evaluation->getResourceUserEvaluation();
        $reu->setDate($evaluation->getDate());
        $duration = $evaluation->getDuration();
        $score = $evaluation->getScore();
        $scoreMax = $evaluation->getScoreMax();
        $scoreMin = $evaluation->getScoreMin();
        $statusPriority = AbstractResourceEvaluation::STATUS_PRORITY;

        if (!empty($duration)) {
            $reuDuration = $reu->getDuration() ? $reu->getDuration() : 0;
            $reuDuration += $duration;
            $reu->setDuration($reuDuration);
        }
        if ($forceStatus) {
            $reu->setScore($score);
            $reu->setScoreMax($scoreMax);
            $reu->setScoreMin($scoreMin);
        } elseif (!empty($score)) {
            $newScore = empty($scoreMax) ? $score : $score / $scoreMax;

            $reuScore = $reu->getScore() ? $reu->getScore() : 0;
            $reuScoreMax = $reu->getScoreMax();
            $oldScore = empty($reuScoreMax) ? $reuScore : $reuScore / $reuScoreMax;

            if ($newScore >= $oldScore) {
                $reu->setScore($score);
                $reu->setScoreMax($scoreMax);
                $reu->setScoreMin($scoreMin);
            }
        }
        if ($forceStatus ||
            empty($reu->getStatus()) ||
            ($evaluation->isSuccessful() && !$reu->isSuccessful()) ||
            $statusPriority[$evaluation->getStatus()] > $statusPriority[$reu->getStatus()]
        ) {
            $reu->setStatus($evaluation->getStatus());
        }
        $this->persistResourceUserEvaluation($reu);
    }
}
