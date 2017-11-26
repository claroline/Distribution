<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\API\Utilities;

//where do we put that code because it's usefull...
class ObjectHandler
{
    public function set(\stdClass $object, $keys, $value)
    {
        $keys = explode('.', $keys);
        $depth = count($keys);
        $key = array_shift($keys);

        if ($depth === 1) {
            $object->{$key} = $value;
        } else {
            if (!isset($object->{$key})) {
                $object->{$key} = new \stdClass();
            } elseif (!$object->{$key} instanceof \stdClass) {
                throw new \Exception('Cannot set property because it already exists as a non \stdClass');
            }

            $this->set($object->{$key}, implode('.', $keys), $value);
        }
    }
}
