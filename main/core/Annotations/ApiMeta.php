<?php

namespace Claroline\CoreBundle\Annotations;

use Doctrine\Common\Annotations\Annotation;

/**
 * @Annotation
 * @Target("CLASS")
 */
final class ApiMeta extends Annotation
{
    /**
     * @Required
     *
     * @var string
     */
    public $class;

    /**
     * @Required
     *
     * @var string
     */
    public $prefix;
    public $ignore = [];

    /**
     * @return string
     */
    public function getClass()
    {
        return $this->class;
    }

    /**
     * @return string
     */
    public function getPrefix()
    {
        return $this->prefix;
    }

    public function getIgnore()
    {
        return $this->ignore;
    }
}
