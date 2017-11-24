<?php

namespace Claroline\CoreBundle\API\Transfer\Adapter\Explain\Csv;

/**
 *
 */
class OneOf
{
    public function __construct(array $properties, $description, $required)
    {
        $this->oneOf       = $properties;
        $this->description = $description;
        $this->required    = $required;
    }
}
