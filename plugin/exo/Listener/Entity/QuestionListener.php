<?php

namespace UJM\ExoBundle\Listener\Entity;

use Doctrine\ORM\Event\LifecycleEventArgs;
use UJM\ExoBundle\Entity\Question;

/**
 * Question Listener.
 *
 * Manages Life cycle of the Question.
 */
class QuestionListener
{
    /**
     * Loads the entity that holds the question type data when a Question is loaded.
     *
     * @param Question           $question
     * @param LifecycleEventArgs $event
     */
    public function postLoad(Question $question, LifecycleEventArgs $event)
    {
        $repository = $event
            ->getEntityManager()
            ->getRepository('UJMExoBundle:'.$question->getType());

        /** @var \UJM\ExoBundle\Entity\AbstractInteraction $typeEntity */
        $typeEntity = $repository->findOneBy([
            'question' => $question,
        ]);

        if (!empty($typeEntity)) {
            $question->setInteraction($typeEntity);
        }
    }

    /**
     * Persists the entity that holds the question type data when a Question is persisted.
     *
     * @param Question           $question
     * @param LifecycleEventArgs $event
     */
    public function prePersist(Question $question, LifecycleEventArgs $event)
    {
        $event->getEntityManager()->persist($question->getInteraction());
    }

    /**
     * Deletes the entity that holds the question type data when a Question is deleted.
     *
     * @param Question           $question
     * @param LifecycleEventArgs $event
     */
    public function preRemove(Question $question, LifecycleEventArgs $event)
    {
        $event->getEntityManager()->remove($question->getInteraction());
    }
}
