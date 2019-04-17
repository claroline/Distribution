<?php

namespace Claroline\CoreBundle\Manager\Workspace\Transfer\Tools;

interface ToolImporterInterface
{
    public function prepareImport(array $orderedToolData, array $data);
}
