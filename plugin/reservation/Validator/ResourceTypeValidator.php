<?php

namespace FormaLibre\ReservationBundle\Validator;

use Claroline\AppBundle\API\ValidatorInterface;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service()
 * @DI\Tag("claroline.validator")
 */
class ResourceTypeValidator implements ValidatorInterface
{
    public function validate($data, $mode, array $options = [])
    {
        return [];
    }

    public function validateBulk(array $users)
    {
    }

    public function getUniqueFields()
    {
        return [
          'name' => 'name',
        ];
    }

    public function getClass()
    {
        return 'FormaLibre\ReservationBundle\Entity\ResourceType';
    }
}
