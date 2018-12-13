<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\OpenBadgeBundle\Controller\API;

use Claroline\AppBundle\Controller\AbstractCrudController;
use Claroline\OpenBadgeBundle\Entity\CryptographicKey;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;

/**
 * @EXT\Route("/crypto")
 */
class CryptographicKeyController extends AbstractCrudController
{
    public function getName()
    {
        return 'badge-crypto';
    }

    public function getClass()
    {
        return CryptographicKey::class;
    }
}
