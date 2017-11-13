<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Event;

use Symfony\Component\EventDispatcher\Event;

class CrudEvent extends Event
{
    private $object;
    private $block;

    /**
     * @param $object  The object created
     * @param $options an array of options
     * @param $extra   anything else you might want to pass
     * (not used yet but options isn't always enough imo)
     */
    public function __construct($object, $options = [])
    {
        $this->object = $object;
        $this->block = false;
        $this->options = $options;
    }

    public function setObject($object)
    {
        $this->object = $object;
    }

    public function getObject()
    {
        return $this->object;
    }

    public function getOptions()
    {
        return $this->options;
    }

    public function block()
    {
        $this->block = true;
    }

    public function allow()
    {
        $this->block = false;
    }

    public function isAllowed()
    {
        return !$this->block;
    }
}
