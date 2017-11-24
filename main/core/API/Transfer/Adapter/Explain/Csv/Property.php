<?php

namespace Claroline\CoreBundle\API\Transfer\Adapter\Explain\Csv;

/**
 *
 */
class Property
{
    public function __construct($name, $type, $description, $required, $isArray = false)
    {
        $this->name        = $name;
        $this->type        = $type;
        $this->description = $description;
        $this->required    = $required;
        $this->isArray     = $isArray;
    }
}
