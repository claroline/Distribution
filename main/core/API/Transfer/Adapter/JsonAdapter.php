<?php

namespace Claroline\CoreBundle\API\Transfer\Adapter;

use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service()
 * @DI\Tag("claroline.transfer.adapter")
 */
class JsonAdapter implements AdapterInterface
{
    public function getData($content)
    {
        return json_decode($content);
    }

    public function getMimeTypes()
    {
        return ['application/json'];
    }

    public function getExplain($json)
    {
        return $json;
    }
}
