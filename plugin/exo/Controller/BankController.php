<?php

namespace UJM\ExoBundle\Controller;

use Claroline\CoreBundle\Entity\User;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use UJM\ExoBundle\Manager\QuestionManager;

/**
 * Class BankController
 */
class BankController
{
    /**
     * BankController constructor.
     *
     * @DI\InjectParams({
     *     "questionManager" = @DI\Inject("ujm.exo.question_manager")
     * })
     *
     * @param QuestionManager $questionManager
     */
    public function __construct(QuestionManager $questionManager)
    {
        $this->questionManager = $questionManager;
    }

    /**
     * Opens the bank of Questions.
     *
     * @param User $user
     *
     * @EXT\Route("", name="question_bank", options={"expose"=true})
     * @EXT\ParamConverter("user", converter="current_user")
     * @EXT\Template("UJMExoBundle::bank.html.twig")
     * @EXT\Method("GET")
     *
     * @return array
     */
    public function openAction(User $user)
    {
        return [
            'questions' => $this->questionManager->exportUserQuestions($user),
        ];
    }
}
