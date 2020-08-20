<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Event\Resource\File;

use Claroline\AppBundle\Event\DataConveyorEventInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Contracts\EventDispatcher\Event;

class EncodeFileEvent extends Event implements DataConveyorEventInterface
{
    /** @var UploadedFile */
    private $file;
    private $isPopulated = false;

    /**
     * EncodeFileEvent constructor.
     */
    public function __construct(UploadedFile $file)
    {
        $this->file = $file;
    }

    /**
     * @return UploadedFile
     */
    public function getFile()
    {
        return $this->file;
    }

    public function setFile(UploadedFile $file)
    {
        $this->isPopulated = true;
        $this->file = $file;
    }

    /**
     * @return bool
     */
    public function isPopulated()
    {
        return $this->isPopulated;
    }
}
