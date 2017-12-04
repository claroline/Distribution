<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\APINew;

use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\Response;

/**
 * @EXT\Route("/logger")
 */
class LoggerController
{
    /**
     * @DI\InjectParams({
     *     "logDir"     = @DI\Inject("%claroline.param.import_log_dir%")
     * })
     */
    public function __construct($logDir)
    {
        $this->logDir = $logDir;
    }

    /**
     * @EXT\Route("/transfer/{name}", name="apiv2_logger_transfer_get")
     * @EXT\Method("GET")
     *
     * @return Response
     */
    public function transfer($name)
    {
        return new Response(file_get_contents($this->logDir.'/'.$name.'.log'));
    }
}
