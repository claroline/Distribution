<?php

namespace Claroline\CoreBundle\API\Transfer\Adapter;

use JMS\DiExtraBundle\Annotation as DI;
use Claroline\CoreBundle\API\Transfer\Adapter\Explain\Csv\Explanation;
use Claroline\CoreBundle\API\Transfer\Adapter\Explain\Csv\Property;
use Claroline\CoreBundle\API\Transfer\Adapter\Explain\Csv\ExplanationBuilder;
use Claroline\CoreBundle\API\Utilities\ObjectHandler;
use Symfony\Component\Translation\TranslatorInterface;
use Claroline\CoreBundle\API\Utils\ArrayUtils;

/**
 * @DI\Service()
 * @DI\Tag("claroline.transfer.adapter")
 */
class CsvAdapter implements AdapterInterface
{
    private $translator;

    /**
     * @DI\InjectParams({
     *     "translator" = @DI\Inject("translator")
     * })
     *
     * @param TranslatorInterface $translator
     */
    public function __construct(TranslatorInterface $translator)
    {
        $this->translator = $translator;
        $this->arrayUtils = new ArrayUtils();
    }

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
        $object = [];

        foreach ($headers as $index => $property) {
            //idiot condition proof in case something is wrong with the csv (like more lines or columns)
            if ($properties[$index]) {
                $explainedProperty = $explanation->getProperty($property);
                $this->addPropertyToObject($explainedProperty, $object, $properties[$index]);
            }
        }

        return $object;
    }

    private function addPropertyToObject(Property $property, array &$object, $value)
    {
        $propertyName = $property->getName();

        if ($property->isArray()) {
            $keys = explode('.', $propertyName);
            $objectProp = array_pop($keys);
            $value = array_map(function ($value) use ($objectProp) {
                $object = [];
                $object[$objectProp] = $value;

                return $object;
            }, explode(',', $value));

            $propertyName = implode('.', $keys);
        }

        if ($property->getType() === 'integer') {
            $value = (int)$value;
        }

        $this->arrayUtils->set($object, $propertyName, $value);
    }

    public function explainSchema($data)
    {
        $builder = new ExplanationBuilder($this->translator);

        return $builder->explainSchema($data);
    }

    public function explainIdentifiers(array $schemas)
    {
        $builder = new ExplanationBuilder($this->translator);

        return $builder->explainIdentifiers($schemas);
    }


    public function getMimeTypes()
    {
        return ['text/csv', 'csv'];
    }
}
