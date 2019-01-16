<?php

/*
 * This file is part of the JVal package.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\AppBundle\JVal\Constraint;

use JVal\Constraint;
use JVal\Constraint\RequiredConstraint as JValConstraint;
use JVal\Context;
use JVal\Walker;
use stdClass;

/**
 * Constraint for the "required" keyword.
 */
class RequiredConstraint extends JValConstraint
{
    /**
     * {@inheritdoc}
     */
    public function apply($instance, stdClass $schema, Context $context, Walker $walker)
    {
        foreach ($schema->required as $property) {
            if (!property_exists($instance, $property)) {
                $context->addViolation('property "%s" is missing', [$property], $property);
            }
        }
    }
}
