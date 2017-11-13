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
     * @var string
     */
    public $class;
}
