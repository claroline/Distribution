<?php

namespace Claroline\CoreBundle\API\Transfer\Adapter;

use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service()
 * @DI\Tag("claroline.transfer.adapter")
 */
class CsvAdapter implements AdapterInterface
{
    public function getData($content)
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
        return ['text/csv'];
    }
}
