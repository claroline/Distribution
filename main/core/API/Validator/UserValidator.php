<?php

namespace Claroline\CoreBundle\API\Validator;

use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\ValidatorInterface;
use Claroline\CoreBundle\Repository\UserRepository;
use Doctrine\ORM\QueryBuilder;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service()
 * @DI\Tag("claroline.validator")
 */
class UserValidator implements ValidatorInterface
{
    /** @var ObjectManager */
    private $om;
    /** @var UserRepository */
    private $repo;

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
        //and prohibits the use of an already used address email in a username field
        $errors  = [];

        if ($this->exists('username', $data['username'], $data['id'])) {
            $errors[] = [
                'path' => 'username',
                'message' => 'This username already exists.'
            ];
        }

        if ($this->exists('mail', $data['email'], $data['id'])) {
            $errors[] = [
                'path' => 'email',
                'message' => 'This email already exists.'
            ];
        }

        return $errors;
    }

    private function exists($propName, $propValue, $userId = null)
    {
        /** @var QueryBuilder $qb */
        $qb = $this->om->createQueryBuilder();
        $qb
            ->select('COUNT(DISTINCT user)')
            ->from('Claroline\CoreBundle\Entity\User', 'user')
            ->where('user.'.$propName.' = :value')
            ->setParameter('value', $propValue);

        if (isset($userId)) {
            $qb
                ->andWhere('user.uuid != :uuid')
                ->setParameter('uuid', $userId);
        }

        return 0 < $qb->getQuery()->getSingleScalarResult();
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
        return [
            'username' => 'username',
            'email' => 'mail',
        ];
    }
}
