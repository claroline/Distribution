<?php

namespace Claroline\CoreBundle\API\Validator;

use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\ValidatorInterface;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service()
 * @DI\Tag("claroline.validator")
 */
class UserValidator implements ValidatorInterface
{
    /**
     * UserValidator constructor.
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
        $this->repo = $this->om->getRepository('Claroline\CoreBundle\Entity\User');
    }

    public function validate($data)
    {
        //the big chunk of code allows us to know if the identifiers are already taken
        //and prohibits the use of an already used adress email in a username field
        $errors  = [];
        $qb = $this->om->createQueryBuilder();
        $qb->select('DISTINCT user')
           ->from('Claroline\CoreBundle\Entity\User', 'user')
           ->where($qb->expr()->orX(
               $qb->expr()->like('user.username', ':username'),
               $qb->expr()->like('user.username', ':email')
           ))

           ->setParameter('username', $data['username'])
           ->setParameter('email', $data['email']);

        if (isset($data->id)) {
            $qb->setParameter('uuid', $data['id'])
            ->andWhere('user.uuid != :uuid');
        }

        $users = $qb->getQuery()->getResult();

        if (count($users) > 0) {
            $errors[] = ['path' => 'username', 'message' => 'username_exists'];
        }

        $qb = $this->om->createQueryBuilder();

        $qb->select('DISTINCT user')
           ->from('Claroline\CoreBundle\Entity\User', 'user')
           ->where($qb->expr()->orX(
               $qb->expr()->like('user.mail', ':username'),
               $qb->expr()->like('user.mail', ':email')
           ))
           ->setParameter('username', $data['username'])
           ->setParameter('email', $data['email']);

        if (isset($data->id)) {
            $qb->setParameter('uuid', $data['id'])
               ->andWhere('user.uuid != :uuid');
        }

        $users = $qb->getQuery()->getResult();

        if (count($users) > 0) {
            $errors[] = ['path' => 'email', 'message' => 'email_exists'];
        }

        return $errors;
    }

    //not sure yet if using this or deduce from getUnique()
    //deduce from getUnique
    public function validateBulk(array $users)
    {
        foreach ($users as $user) {
            //check if there isn't any duplicate of unique fields
        }
    }

    public function getClass()
    {
        return 'Claroline\CoreBundle\Entity\User';
    }

    public function getUniqueFields()
    {
        return ['username', 'email'];
    }
}
