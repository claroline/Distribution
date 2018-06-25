<?php

namespace Claroline\CoreBundle\Entity;

use Claroline\AppBundle\Entity\Identifier\Id;

/**
 * DataSource entity.
 *
 * Describes a DataSource provided by a plugin.
 */
class DataSource
{
    use Id;

    /**
     * The name of the source.
     *
     * @var string
     */
    private $name;

    /**
     * The type of the source.
     *
     * @var string
     */
    private $type;

    /**
     * Get name.
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set name.
     *
     * @param $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * Get type.
     *
     * @return string
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set type.
     *
     * @param $type
     */
    public function setType($type)
    {
        $this->type = $type;
    }
}
