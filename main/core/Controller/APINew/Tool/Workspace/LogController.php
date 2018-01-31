<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\APINew\Tool\Workspace;

use Claroline\CoreBundle\Annotations\ApiMeta;
use Claroline\CoreBundle\Controller\APINew\AbstractCrudController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

/**
 * @ApiMeta(class="Claroline\CoreBundle\Entity\Log\Log",
 *     ignore={"create", "update", "deleteBulk", "copyBulk", "exist", "schema"})
 * @Route("/tools/workspace/{workspaceId}/logs", name="workspace_tool_logs", requirements={"workspaceId"="\d+"})
 * @ParamConverter("log", class="Claroline\CoreBundle\Entity\Log\Log", options={"mapping": {"workspaceId": "workspace"}})
 */
class LogController extends AbstractCrudController
{
    /**
     * Get the name of the managed entity.
     *
     * @return string
     */
    public function getName()
    {
        return 'log';
    }
}
