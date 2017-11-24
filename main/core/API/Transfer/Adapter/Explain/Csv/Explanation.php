<?php

namespace Claroline\CoreBundle\API\Transfer\Adapter\Explain\Csv;

/**
 *
 */
class Explanation
{
    public function __construct(array $properties = [])
    {
        $this->properties = $properties;
    }

    public function addProperty($name, $type, $description, $required, $isArray = false)
    {
        $this->properties[] = new Property($name, $type, $description, $required, $isArray);
    }

    public function getProperties()
    {
        return $this->properties;
    }

    public function addOneOf(array $properties, $description)
    {
        $this->properties[] = new OneOf($properties, $description, true);
    }
}
