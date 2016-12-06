<?php

namespace UJM\ExoBundle\Manager\Question;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Repository\UserRepository;
use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Entity\Question\Shared;
use UJM\ExoBundle\Library\Validator\ValidationException;
use UJM\ExoBundle\Repository\QuestionRepository;

/**
 * @DI\Service("ujm_exo.manager.share")
 */
class ShareManager
{
    /**
     * @var ObjectManager
     */
    private $om;

    /**
     * ShareManager constructor.
     *
     * @DI\InjectParams({
     *     "om" = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param ObjectManager $om
     */
    public function __construct(ObjectManager $om)
    {
        $this->om = $om;
    }

    /**
     * Shares a list of question to users.
     *
     * @param \stdClass $shareRequest - an object containing the questions and users to link
     *
     * @throws ValidationException
     */
    public function share(\stdClass $shareRequest)
    {
        $errors = $this->validateShareRequest($shareRequest);
        if (count($errors) > 0) {
            throw new ValidationException('Share request is not valid', $errors);
        }

        $adminRights = isset($shareRequest->adminRights) && $shareRequest->adminRights;

        /** @var QuestionRepository $questionRepo */
        $questionRepo = $this->om->getRepository('UJMExoBundle:Question\Question');
        // Loaded questions (we load it to be sure it exist)
        $questions = $questionRepo->findByUuids($shareRequest->questions);

        /** @var UserRepository $userRepo */
        $userRepo = $this->om->getRepository('ClarolineCoreBundle:User');
        // Loaded users (we load it to be sure it exist)
        $users = $userRepo->findByIds($shareRequest->users);

        // Share each question with each user
        foreach ($questions as $question) {
            $sharedWith = $this->om->getRepository('UJMExoBundle:Question\Shared')->findBy(['question' => $question]);
            foreach ($users as $user) {
                $shared = new Shared();
                $shared->setQuestion($question);
                $shared->setUser($user);
                $shared->setAdminRights($adminRights);

                $this->om->persist($shared);
            }
        }

        $this->om->flush();
    }

    private function getExisting(User $user, array $shared)
    {

    }

    /**
     * Validates a share request.
     *
     * @param \stdClass $shareRequest
     *
     * @return array
     */
    private function validateShareRequest(\stdClass $shareRequest)
    {
        $errors = [];

        if (empty($shareRequest->questions) || !is_array($shareRequest->questions)) {
            $errors[] = [
                'path' => '/questions',
                'message' => 'should be a list of question ids',
            ];
        }

        if (empty($shareRequest->users) || !is_array($shareRequest->users)) {
            $errors[] = [
                'path' => '/users',
                'message' => 'should be a list of user ids',
            ];
        }

        if (!is_bool($shareRequest->adminRights)) {
            $errors[] = [
                'path' => '/adminRights',
                'message' => 'should be boolean',
            ];
        }

        return $errors;
    }
}
