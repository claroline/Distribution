<?php

/*
 * This file is part of the JVal package.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace JVal;

use JVal\Walker as JValWalker;
use stdClass;

class Walker extends JValWalker
{
    /**
     * Validates an instance against a given schema, populating a context
     * with encountered violations.
     *
     * @param mixed    $instance
     * @param stdClass $schema
     * @param Context  $context
     * @param array    $options
     */
    public function applyConstraints($instance, stdClass $schema, Context $context, array $options = [])
    {
        $cacheKey = gettype($instance).spl_object_hash($schema);
        $constraints = &$this->constraintsCache[$cacheKey];

        if (null === $constraints) {
            $version = $this->getVersion($schema);
            $instanceType = Types::getPrimitiveTypeOf($instance);
            $constraints = $this->registry->getConstraintsForType($version, $instanceType);
            $constraints = $this->filterConstraintsForSchema($constraints, $schema);
        }

        foreach ($constraints as $constraint) {
            $constraint->apply($instance, $schema, $context, $this, $options);
        }
    }
}
