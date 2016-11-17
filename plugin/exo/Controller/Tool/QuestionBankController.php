<?php

namespace UJM\ExoBundle\Controller\Tool;

use Claroline\CoreBundle\Entity\User;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Manager\Question\QuestionManager;

/**
 * Class QuestionBankController
 *
 * @EXT\Route(
 *     "/questions",
 *     options={"expose"=true}
 * )
 * @EXT\Method("GET")
 */
class QuestionBankController
{
    /**
     * QuestionBankController constructor.
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
     * @EXT\Template("UJMExoBundle:Tool:question-bank.html.twig")
     *
     * @return array
     */
    public function openAction(User $user)
    {
        $search = $this->questionManager->search($user);

        return [
            'questions' => array_map(function ($question) {
                return $this->questionManager->export($question, [Transfer::MINIMAL, Transfer::INCLUDE_ADMIN_META]);
            }, $search['questions']),
            'total' => $search['total']
        ];
    }
}
