<?php

namespace Claroline\CoreBundle\API\Transfer\Adapter;

interface AdapterInterface
{
    public function decodeSchema($content, $explanation);
    public function getMimeTypes();
    public function explainSchema($json);
    public function explainIdentifiers(array $schemas);
}
