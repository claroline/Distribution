<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Manager;

use Claroline\CoreBundle\Entity\Cryptography\CryptographicKey;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.manager.cryptography_manager")
 */
class CryptographyManager
{
    public function generatePair()
    {
        $crypto = new CryptographicKey();

        return $crypto;
    }
}
