<?php

namespace Claroline\CoreBundle\API\Transfer\Adapter;

use JMS\DiExtraBundle\Annotation as DI;
use Claroline\CoreBundle\API\Transfer\Adapter\Explain\Csv\Explanation;
use Claroline\CoreBundle\API\Transfer\Adapter\Explain\Csv\Property;
use Claroline\CoreBundle\API\Transfer\Adapter\Explain\Csv\ExplanationBuilder;
use Claroline\CoreBundle\API\Utilities\ObjectHandler;

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
    public function decodeSchema($content, $explanation)
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
            $data[] = $this->buildObjectFromLine($properties, $headers, $explanation);
        }

        return $data;
    }

    private function buildObjectFromLine($properties, array $headers, Explanation $explanation)
    {
        $object = new \stdClass();

        foreach ($headers as $index => $property) {
            //idiot condition proof in case something is wrong with the csv (like more lines or columns)
            if ($properties[$index]) {
                $explainedProperty = $explanation->getProperty($property);
                $this->addPropertyToObject($explainedProperty, $object, $properties[$index]);
            }
        }

        return $object;
    }

    private function addPropertyToObject(Property $property, \stdClass $object, $value)
    {
        $propertyName = $property->getName();

        if ($property->isArray()) {
            $keys = explode('.', $propertyName);
            $objectProp = array_pop($keys);
            $value = array_map(function ($value) use ($objectProp) {
                $object = new \StdClass();
                $object->{$objectProp} = $value;

                return $object;
            }, explode(',', $value));

            $propertyName = implode('.', $keys);
        }

        $handler = new ObjectHandler();
        $handler->set($object, $propertyName, $value);
    }

    public function explainSchema($data)
    {
        $builder = new ExplanationBuilder();

        return $builder->explainSchema($data);
    }

    public function explainIdentifiers(array $schemas)
    {
        $builder = new ExplanationBuilder();

        return $builder->explainIdentifiers($schemas);
    }


    public function getMimeTypes()
    {
        return ['text/csv', 'csv'];
    }
}
