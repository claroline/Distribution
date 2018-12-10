<?php

namespace HeVinci\CompetencyBundle\Validator;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

/**
 * Validator ensuring that an array or any object implementing
 * the Countable interface is not empty.
 */
class NotEmptyValidator extends ConstraintValidator
{
    public function validate($value, Constraint $constraint)
    {
        if (!is_array($value) && !$value instanceof \Countable) {
            throw new \InvalidArgumentException(
                'array or Countable instance expected'
            );
        }

        if (0 === count($value)) {
            $this->context->addViolation($constraint->message);
        }
    }
}
