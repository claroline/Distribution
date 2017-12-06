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

    public $ignore = [];

    /**
     * @return string
     */
    public function getClass()
    {
        return $this->class;
    }

    public function getIgnore()
    {
        return $this->ignore;
    }
}
