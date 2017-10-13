<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\DropZoneBundle\Manager;

use Claroline\CoreBundle\API\Crud;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\DropZoneBundle\API\Serializer\DropzoneSerializer;
use Claroline\DropZoneBundle\Entity\Dropzone;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.manager.dropzone_manager")
 */
class DropzoneManager
{
    /** @var Crud */
    private $crud;

    /** @var DropzoneSerializer */
    private $dropzoneSerializer;

    /** @var ObjectManager */
    private $om;

    /**
     * DropzoneManager constructor.
     *
     * @DI\InjectParams({
     *     "crud"               = @DI\Inject("claroline.api.crud"),
     *     "dropzoneSerializer" = @DI\Inject("claroline.serializer.dropzone"),
     *     "om"                 = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param ObjectManager      $om
     * @param DropzoneSerializer $dropzoneSerializer
     */
    public function __construct(
        Crud $crud,
        DropzoneSerializer $dropzoneSerializer,
        ObjectManager $om
    ) {
        $this->crud = $crud;
        $this->dropzoneSerializer = $dropzoneSerializer;
        $this->om = $om;
    }

    /**
     * Serializes a Dropzone entity.
     *
     * @param Dropzone $dropzone
     *
     * @return array
     */
    public function serialize(Dropzone $dropzone)
    {
        return $this->dropzoneSerializer->serialize($dropzone);
    }

    /**
     * Updates a Dropzone.
     *
     * @param Dropzone $dropzone
     * @param array    $data
     *
     * @return Dropzone
     */
    public function update(Dropzone $dropzone, array $data)
    {
        $this->crud->update('Claroline\DropZoneBundle\Entity\Dropzone', $data);

        return $dropzone;
    }

    /**
     * Deletes a Dropzone.
     *
     * @param Dropzone $dropzone
     */
    public function delete(Dropzone $dropzone)
    {
        $this->crud->delete($dropzone, 'Claroline\DropZoneBundle\Entity\Dropzone');
    }
}
