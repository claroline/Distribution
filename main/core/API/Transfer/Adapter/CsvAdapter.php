<?php

namespace Claroline\CoreBundle\API\Transfer\Adapter;

use JMS\DiExtraBundle\Annotation as DI;
use Claroline\CoreBundle\API\Transfer\Adapter\Explain\Csv\Explanation;
use Claroline\CoreBundle\API\Transfer\Adapter\Explain\Csv\Property;

/**
 * @DI\Service()
 * @DI\Tag("claroline.transfer.adapter")
 */
class CsvAdapter implements AdapterInterface
{
    /**
     * Create a php \stdClass object from the schema according to the data passed on.
     * Each line is a new object.
     *
     * @todo make this recursive (for object containing other object: max level is 2 now: ie: groups.yolo)
     */
    public function decodeSchema($content, $schema)
    {
        $data = [];
        $lines = str_getcsv($content, PHP_EOL);
        $header = array_shift($lines);
        $headers = array_filter(
          str_getcsv($header, ';'),
          function ($header) {
              return $header !== '';
          }
        );

        foreach ($lines as $line) {
            $properties = str_getcsv($line, ';');
            $object = new \stdClass();

            foreach ($headers as $index => $property) {
                if ($properties[$index]) {
                    if (strpos($property, '.') > 0) {
                        $parts = explode('.', $property);
                        //my first guess is that it shouldn't always be an array
                        //the schema should be parsed here just to be sure (and at the beginning, not here)
                        $new = new \stdClass();
                        $new->{$parts[1]} = $properties[$index];
                        $object->{$parts[0]} = [$new];
                    } else {
                        $object->$property = $properties[$index];
                    }
                }
            }

            $data[] = $object;
        }

        return $data;
    }

    public function getMimeTypes()
    {
        return ['text/csv', 'csv'];
    }

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

    private function explainOneOf($data, $explanation, $currentPath, $isArray = false)
    {
        $explanations = [];

        foreach ($data->oneOf as $oneOf) {
            $explanations[] = $this->explainSchema($oneOf, null, $currentPath, $isArray);
        }

        $properties = [];

        foreach ($explanations as $singleExplain) {
            //$properties[] = $singleExplain->getProperties()[0];
        }

        $explanation->addOneOf($explanations, 'an auto generated descr', true);
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

    private function getProperty($data, $prop, $default)
    {
        if (isset($data->{$prop})) {
            return $data->{$prop};
        }

        return $default;
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

    public function decodeIdentifiers($data, array $schemas)
    {
    }
}
