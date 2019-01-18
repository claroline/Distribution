<?php

namespace Claroline\CoreBundle\API\Validator;

use Claroline\CoreBundle\API\ValidatorInterface;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Repository\WorkspaceRepository;
use Doctrine\ORM\QueryBuilder;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service()
 * @DI\Tag("claroline.validator")
 */
class WorkspaceValidator implements ValidatorInterface
{
    /** @var ObjectManager */
    private $om;
    /** @var WorkspaceRepository */
    private $repo;

    /**
     * WorkspaceValidator constructor.
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
        $this->repo = $this->om->getRepository('Claroline\CoreBundle\Entity\Workspace\Workspace');
    }

    public function validate($data)
    {
        $errors = [];

        if ($this->exists('code', $data['code'], isset($data['id']) ? $data['id'] : null)) {
            $errors[] = [
                'path' => 'code',
                'message' => 'The code '.$data['code'].' already exists.',
            ];
        }


        return $errors;
    }

    /**
     * @param string      $propName
     * @param string      $propValue
     * @param string|null $workspaceId
     * Check if a workspace exists with the given data
     */
    private function exists($propName, $propValue, $workspaceId = null)
    {
        /** @var QueryBuilder $qb */
        $qb = $this->om->createQueryBuilder();
        $qb
            ->select('COUNT(DISTINCT workspace)')
            ->from('Claroline\CoreBundle\Entity\Workspace\Workspace', 'workspace')
            ->where('workspace.'.$propName.' = :value')
            ->setParameter('value', $propValue);

        if (isset($workspaceId)) {
            $qb
                ->andWhere('workspace.uuid != :uuid')
                ->setParameter('uuid', $workspaceId);
        }

        return 0 < $qb->getQuery()->getSingleScalarResult();
    }

    public function getClass()
    {
        return 'Claroline\CoreBundle\Entity\Workspace\Workspace';
    }

    public function getUniqueFields()
    {
        return [
            'code' => 'code',
        ];
    }
}
