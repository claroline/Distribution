<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\Administration;

use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;

/**
 * @DI\Tag("security.secure_service")
 * @EXT\Route("/admin/transfer", options={"expose"=true})
 */
class TransferController
{
    /**
     * @EXT\Route("/", name="claro_admin_transfer_index")
     * @EXT\Method("GET")
     * @EXT\Template()
     */
    public function indexAction()
    {
        return [];
    }
}
