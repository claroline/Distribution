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
            $object = new \stdClass();

            foreach ($headers as $index => $property) {
                $object->$property = $line[$index];
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
