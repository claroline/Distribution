<?php
/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Date: 1/25/17
 */

namespace Claroline\CoreBundle\Library\Icon;

class IconItemForList
{
    private $name;

    private $relativeUrl;

    private $mimeTypes = [];

    public function __construct($name, $relativeUrl, array $mimeTypes)
    {
        $this->name = $name;
        $this->relativeUrl = $relativeUrl;
        $this->mimeTypes = $mimeTypes;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @return mixed
     */
    public function getRelativeUrl()
    {
        return $this->relativeUrl;
    }

    /**
     * @return array
     */
    public function getMimeTypes()
    {
        return $this->mimeTypes;
    }

    public function addMimeType($mimeType)
    {
        $this->mimeTypes[] = $mimeType;
    }
}
