<?php

namespace Claroline\CoreBundle\API\Validator;

use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\ValidatorInterface;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service()
 * @DI\Tag("claroline.validator")
 */
class GroupValidator implements ValidatorInterface
{
    /**
     * GroupValidator constructor.
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
        $this->repo = $this->om->getRepository('Claroline\CoreBundle\Entity\Group');
    }

    public function validate($data)
    {
        $errors  = [];
        $qb = $this->om->createQueryBuilder();

        $qb->select('DISTINCT g')
           ->from('Claroline\CoreBundle\Entity\Group', 'g')
           ->where('g.name LIKE :name')
           ->setParameter('name', $data->name)
           ->getQuery()
           ->getResult();

        if (isset($data->id)) {
            $qb->setParameter('uuid', $data->id)
               ->andWhere('g.uuid != :uuid');
        }

        $groups = $qb->getQuery()->getResult();

        if (count($groups) > 0) {
            $errors[] = ['path' => 'name', 'message' => 'name_exists'];
        }

        return $errors;
    }

    //not sure yet if using this or deduce from getUnique()
    public function validateBulk(array $users)
    {
        foreach ($users as $user) {
            //check if there isn't any duplicate of unique fields
        }
    }

    public function getUnique()
    {
        return ['name'];
    }

    public function getClass()
    {
        return 'Claroline\CoreBundle\Entity\Group';
    }
}
