<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Manager\Workspace;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\AbstractEvaluation;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Evaluation;
use Claroline\CoreBundle\Entity\Workspace\Workspace;

class EvaluationManager
{
    /** @var ObjectManager */
    private $om;

    private $evaluationRepo;

    /**
     * @param ObjectManager $om
     */
    public function __construct(ObjectManager $om)
    {
        $this->om = $om;

        $this->evaluationRepo = $om->getRepository(Evaluation::class);
    }

    public function getEvaluation(Workspace $workspace, User $user, $withCreation = true)
    {
        $evaluation = $this->evaluationRepo->findOneBy(['workspace' => $workspace, 'user' => $user]);

        if ($withCreation && empty($evaluation)) {
            $evaluation = new Evaluation();
            $evaluation->setWorkspace($workspace);
            $evaluation->setWorkspaceSlug($workspace->getSlug());
            $evaluation->setUser($user);
            $evaluation->setUserName($user->getLastName().' '.$user->getFirstName());
            $evaluation->setDate(new \DateTime());
            $evaluation->setStatus(AbstractEvaluation::STATUS_OPENED);
            $this->om->persist($evaluation);
            $this->om->flush();
        }

        return $evaluation;
    }
}
