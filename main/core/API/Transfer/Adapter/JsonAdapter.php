<?php

namespace Claroline\CoreBundle\API\Transfer\Adapter;

use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service()
 * @DI\Tag("claroline.transfer.adapter")
 */
class JsonAdapter implements AdapterInterface
{
    public function decodeSchema($content, $schema)
    {
        return json_decode($content);
    }

    public function getMimeTypes()
    {
        return ['application/json', 'json'];
    }

    public function explainSchema($schema)
    {
        return $schema;
    }

    public function explainIdentifiers(array $schema)
    {
        return $schema;
    }

    public function decodeIdentifiers($data, array $schemas)
    {
        return json_decode($data);
    }
}
