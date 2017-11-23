<?php

namespace Claroline\CoreBundle\API\Transfer\Adapter\Explain\Csv;

/**
 *
 */
class Explanation
{
    public function __construct()
    {
        $this->properties = [];
    }

    public function addProperty($name, $type, $description, $required)
    {
        $this->properties[] = new Property($name, $type, $description, $required);
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
