<?php

namespace UJM\ExoBundle\Controller\Tool;

use Claroline\CoreBundle\Entity\User;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use UJM\ExoBundle\Manager\Question\QuestionManager;

/**
 * QuestionBankController
 * The tool permits to users to manage their questions across the platform (edit, export, share, etc.).
 *
 * @EXT\Route("/questions", options={"expose"=true})
 */
class QuestionBankController
{
    /**
     * QuestionBankController constructor.
     *
     * @DI\InjectParams({
     *     "questionManager" = @DI\Inject("ujm_exo.manager.question")
     * })
     *
     * @param QuestionManager $questionManager
     */
    public function __construct(QuestionManager $questionManager)
    {
        $this->questionManager = $questionManager;
    }

    /**
     * Opens the bank of Questions for the current user.
     *
     * @param User $user
     *
     * @EXT\Route("", name="question_bank")
     * @EXT\Method("GET")
     * @EXT\ParamConverter("user", converter="current_user")
     * @EXT\Template("UJMExoBundle:Tool:question-bank.html.twig")
     *
     * @return array
     */
    public function openAction(User $user)
    {
        return [
            'initialSearch' => $this->questionManager->search($user),
        ];
    }
}
