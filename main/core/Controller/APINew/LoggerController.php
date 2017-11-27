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

use Claroline\CoreBundle\Manager\LocaleManager;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Manages platform locales.
 *
 * @EXT\Route("logger")
 */
class LoggerController
{
    /**
     * @var LocaleManager
     */
    private $manager;


    public function __construct()
    {
    }

    /**
     * List platform locales.
     *
     * @EXT\Route("/{name}", name="apiv2_logger_get")
     * @EXT\Method("GET")
     *
     * @return JsonResponse
     */
    public function get($name)
    {
        //get the log file here
    }
}
