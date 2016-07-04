<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Event\Log;

class LogUserLoginEvent extends LogGenericEvent
{
    const ACTION = 'user-login';

    /**
     * Constructor.
     */
    public function __construct()
    {
        parent::__construct(self::ACTION, []);
    }

    /**
     * @return array
     */
    public static function getRestriction()
    {
        return [self::DISPLAYED_ADMIN];
    }
}
