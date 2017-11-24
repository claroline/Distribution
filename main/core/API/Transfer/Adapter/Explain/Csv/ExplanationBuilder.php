<?php

namespace Claroline\CoreBundle\API\Transfer\Adapter\Explain\Csv;

/**
 *
 */
class ExplanationBuilder
{
    private function explainObject($data, $explanation, $currentPath, $isArray = false)
    {
        foreach ($data->properties as $name => $property) {
            $whereAmI = $currentPath === '' ? $name: $currentPath . '.' . $name;

            if ($property->type === 'array') {
                $this->explainSchema($property->items, $explanation, $whereAmI, true);
            } elseif ($property->type === 'object') {
                $this->explainObject($property, $explanation, $whereAmI, $isArray);
            }

            if (!in_array($property->type, ['array', 'object'])) {
                $required = isset($data->required) ? in_array($name, $data->required): false;
                $explanation->addProperty(
                  $whereAmI,
                  $property->type,
                  $this->getProperty($property, 'description', ''),
                  $required,
                  $isArray
              );
            }
        }
    }

    /**
     * A oneOf is simply an other schema that needs to be explained
     */
    private function explainOneOf($data, $explanation, $currentPath, $isArray = false)
    {
        $explanation->addOneOf(array_map(function ($oneOf) use ($currentPath, $isArray) {
            return $this->explainSchema($oneOf, null, $currentPath, $isArray);
        }, $data->oneOf), 'an auto generated descr', true);
    }

    /**
     * Explain how to import according to the json-schema for a given mime type (csv)
     * Here, we'll give a csv description according to the schema
     * This is only a first version because not everything will be supported by csv
     */
    public function explainSchema(
      $data,
      $explanation = null,
      $currentPath = '',
      $isArray = false
  ) {
        if (!$explanation) {
            $explanation = new Explanation();
        }
        //parse the json and explain what to do

        if (isset($data->type)) {
            $this->explainObject($data, $explanation, $currentPath, $isArray);
        } elseif (property_exists($data, 'oneOf')) {
            $this->explainOneOf($data, $explanation, $currentPath, $isArray);
        } elseif (property_exists($data, 'allOf')) {
        } elseif (property_exists($data, 'anyOf')) {
        }

        return $explanation;
    }

    public function explainIdentifiers(array $schemas)
    {
        $explanation = new Explanation();

        foreach ($schemas as $prop => $schema) {
            $identifiers = $schema->claroIds;

            if (isset($schema->type) && $schema->type === 'object') {
                $oneOfs = [];
                foreach ($identifiers as $property) {
                    $data = $schema->properties->{$property};
                    $oneOfs[] = new Explanation([new Property(
                        $prop . '.' . $property,
                        $data->type,
                        $this->getProperty($data, 'description', ''),
                        false
                    )]);
                }

                $explanation->addOneOf($oneOfs, 'a description generated', true);
            }
        }

        return $explanation;
    }

    private function getProperty($data, $prop, $default)
    {
        if (isset($data->{$prop})) {
            return $data->{$prop};
        }

        return $default;
    }
}
