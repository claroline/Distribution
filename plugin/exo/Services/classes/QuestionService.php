<?php

namespace UJM\ExoBundle\Services\classes;

use Claroline\CoreBundle\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * Services for the questions
 */
class QuestionService
{
    /**
     * @var ObjectManager
     */
    private $om;

    /**
     * @var TokenStorageInterface
     */
    private $tokenStorage;

    /**
     * Constructor.
     *
     * @param ObjectManager $om
     * @param TokenStorageInterface $tokenStorage
     */
    public function __construct(
        ObjectManager $om,
        TokenStorageInterface $tokenStorage)
    {
        $this->om = $om;
        $this->tokenStorage = $tokenStorage;
    }

    /**
     * To control the User's rights to this shared question.
     *
     * @param int $questionId
     *
     * @return array
     */
    public function controlUserSharedQuestion($questionId)
    {
        $user = $this->tokenStorage->getToken()->getUser();

        return $this->om
            ->getRepository('UJMExoBundle:Share')
            ->getControlSharedQuestion($user->getId(), $questionId);
    }

    /**
     * To control the User's rights to this question.
     *
     * @param int $questionId
     *
     * @return mixed
     */
    public function controlUserQuestion($questionId)
    {
        $user = $this->tokenStorage->getToken()->getUser();

        return $this->om
            ->getRepository('UJMExoBundle:Question')
            ->findOneBy(['id' => $questionId, 'user' => $user]);
    }
}
