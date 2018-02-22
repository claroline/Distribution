<?php

/*
 * This file is part of the JVal package.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\AppBundle\JVal\Constraint;

use JVal\Constraint;
use JVal\Context;
use JVal\Exception\Constraint\EmptyArrayException;
use JVal\Exception\Constraint\InvalidTypeException;
use JVal\Exception\Constraint\NotUniqueException;
use JVal\Types;
use JVal\Walker;
use stdClass;

/**
 * Constraint for the "required" keyword.
 */
class RequiredAtUpdate implements Constraint
{
    /**
     * {@inheritdoc}
     */
    public function keywords()
    {
        return ['requiredAtUpdate'];
    }

    /**
     * {@inheritdoc}
     */
    public function supports($type)
    {
        return Types::TYPE_OBJECT === $type;
    }

    /**
     * {@inheritdoc}
     */
    public function normalize(stdClass $schema, Context $context, Walker $walker)
    {
        $context->enterNode('requiredAtUpdate');

        if (!is_array($schema->requiredAtUpdate)) {
            throw new InvalidTypeException($context, Types::TYPE_ARRAY);
        }

        if (0 === $requiredCount = count($schema->requiredAtUpdate)) {
            throw new EmptyArrayException($context);
        }

        foreach ($schema->requiredAtUpdate as $index => $property) {
            if (!is_string($property)) {
                $context->enterNode($index);

                throw new InvalidTypeException($context, Types::TYPE_STRING);
            }
        }

        if ($requiredCount !== count(array_unique($schema->requiredAtUpdate))) {
            throw new NotUniqueException($context);
        }

        $context->leaveNode();
    }

    /**
     * {@inheritdoc}
     */
    public function apply($instance, stdClass $schema, Context $context, Walker $walker, array $options = [])
    {
        /*
        foreach ($schema->requiredAtUpdate as $property) {
            if (!property_exists($instance, $property)) {
                $context->addViolation('property "%s" is missing', [$property]);
            }
        }*/
    }
}
