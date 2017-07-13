<?php

namespace UJM\ExoBundle\Controller\Tool;

use Claroline\CoreBundle\API\Finder;
use Claroline\CoreBundle\Entity\User;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use UJM\ExoBundle\Manager\Item\ItemManager;
use UJM\ExoBundle\Serializer\UserSerializer;

/**
 * QuestionBankController
 * The tool permits to users to manage their questions across the platform (edit, export, share, etc.).
 *
 * @EXT\Route("/questions", options={"expose"=true})
 */
class QuestionBankController
{
    /**
     * @var ItemManager
     */
    private $itemManager;

    /**
     * @var UserSerializer
     */
    private $userSerializer;

    /**
     * @var Finder
     */
    private $finder;

    /**
     * QuestionBankController constructor.
     *
     * @DI\InjectParams({
     *     "itemManager" = @DI\Inject("ujm_exo.manager.item"),
     *     "userSerializer"  = @DI\Inject("ujm_exo.serializer.user"),
     *     "finder" = @DI\Inject("claroline.API.finder")
     * })
     *
     * @param ItemManager    $itemManager
     * @param UserSerializer $userSerializer
     * @param Finder $finder
     */
    public function __construct(ItemManager $itemManager, UserSerializer $userSerializer, Finder $finder)
    {
        $this->itemManager = $itemManager;
        $this->userSerializer = $userSerializer;
        $this->finder = $finder;
    }

    /**
     * Opens the bank of Questions for the current user.
     *
     * @EXT\Route("", name="question_bank")
     * @EXT\Method("GET")
     * @EXT\Template("UJMExoBundle:Tool:question-bank.html.twig")
     *
     * @return array
     */
    public function openAction()
    {
        return $this->finder->search(
            'UJM\ExoBundle\Entity\Item\Item',
            0,
            20,
            ['filters' => ['isModel' => false, 'isPersonal' => false]]
        );
    }
}
