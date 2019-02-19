<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\AppBundle\Security;

use Doctrine\Common\Collections\ArrayCollection;

class ObjectCollection extends ArrayCollection
{
    private $class;
    private $options;

    public function __construct(array $objects, array $options = [])
    {
        foreach ($objects as $object) {
            if (!$object instanceof $objects[0]) {
                $classes = '';
                foreach ($objects as $object) {
                    $classes .= get_class($object).', ';
                }
                throw new \Exception('Classes of objects are varying. '.$classes);
            }
        }

        parent::__construct($objects);
        $this->options = $options;
    }

    public function addOption($option)
    {
        $this->options[] = $option;
    }

    public function getOptions()
    {
        return $this->options;
    }

    public function setOptions($options)
    {
        $this->options = $options;
    }

    /**
     * Be carreful as it can returns the doctrine proxy class name.
     */
    public function getClass()
    {
        return $this->class;
    }

    public function isInstanceOf($class)
    {
        //doctrine sends proxy so we have to do the check with the instanceof operator
        $rc = new \ReflectionClass($class);
        $toCheck = $rc->newInstanceWithoutConstructor();

        return $this->first() instanceof $toCheck;
    }
}
