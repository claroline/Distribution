<?php

namespace Claroline\CoreBundle\API\Transfer\Adapter;

interface AdapterInterface
{
    public function getData($content);
    public function getMimeTypes();
    public function explainSchema($json);
}
