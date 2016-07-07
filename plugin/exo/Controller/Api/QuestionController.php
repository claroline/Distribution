<?php

namespace UJM\ExoBundle\Controller\Api;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Question Controller.
 *
 * @EXT\Route(
 *     "/questions",
 *     options={"expose"=true},
 *     defaults={"_format": "json"}
 * )
 * @EXT\Method("GET")
 */
class QuestionController
{
    private $om;

    /**
     * QuestionController constructor.
     *
     * @DI\InjectParams({
     *     "om" = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param ObjectManager $om
     */
    public function __construct(
        ObjectManager $om)
    {
        $this->om = $om;
    }

    /**
     * List all the Questions of the current User (its owns and the ones that are shared with him)
     *
     * @EXT\Route("/{id}/attempts", name="question_index")
     * @EXT\Method("POST")
     * @EXT\ParamConverter("user", converter="current_user")
     *
     * @return JsonResponse
     */
    public function indexAction(User $user)
    {

        return new JsonResponse();
    }
}