<?php

namespace Claroline\CoreBundle\API\Serializer\Workspace;

use Claroline\CoreBundle\API\Serializer\User\UserSerializer;
use Claroline\CoreBundle\Entity\Workspace\Evaluation;

class EvaluationSerializer
{
    private $userSerializer;

    /**
     * EvaluationSerializer constructor.
     *
     * @param UserSerializer $userSerializer
     */
    public function __construct(UserSerializer $userSerializer)
    {
        $this->userSerializer = $userSerializer;
    }

    /**
     * Serializes an Evaluation entity for the JSON api.
     *
     * @param Evaluation $evaluation
     *
     * @return array - the serialized representation of the workspace evaluation
     */
    public function serialize(Evaluation $evaluation)
    {
        return [
            'id' => $evaluation->getId(),
            'date' => $evaluation->getDate() ? $evaluation->getDate()->format('Y-m-d H:i') : null,
            'status' => $evaluation->getStatus(),
            'duration' => $evaluation->getDuration(),
            'score' => $evaluation->getScore(),
            'scoreMin' => $evaluation->getScoreMin(),
            'scoreMax' => $evaluation->getScoreMax(),
            'customScore' => $evaluation->getCustomScore(),
            'progression' => $evaluation->getProgression(),
            'progressionMax' => $evaluation->getProgressionMax(),
            'nbAttempts' => $evaluation->getNbAttempts(),
            'nbOpenings' => $evaluation->getNbOpenings(),
            'required' => $evaluation->isRequired(),
            'user' => $this->userSerializer->serialize($evaluation->getUser()),
            'userName' => $evaluation->getUserName(),
            'workspaceCode' => $evaluation->getWorkspaceCode(),
        ];
    }
}
