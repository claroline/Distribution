<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Exception;

class AddRoleException extends \Exception
{
    public function __construct($message = null, $total = null, $toAdd = null, $max = null)
    {
        parent::__construct($message);

        $this->total = $total;
        $this->toAdd = $toAdd;
        $this->max = $max;
    }

    public function getTotal()
    {
        return $this->total;
    }

    public function getToAdd()
    {
        return $this->toAdd;
    }

    public function getMax()
    {
        return $this->max;
    }
}
