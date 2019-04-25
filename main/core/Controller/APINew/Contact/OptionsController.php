<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Controller\APINew\Contact;

use Claroline\AppBundle\Controller\AbstractCrudController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;

/**
 * @EXT\Route("/contact_options")
 */
class OptionsController extends AbstractCrudController
{
    public function getClass()
    {
        return 'Claroline\CoreBundle\Entity\Contact\Options';
    }

    public function getName()
    {
        return 'contact_options';
    }
}
