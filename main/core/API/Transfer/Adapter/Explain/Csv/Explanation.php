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
}
