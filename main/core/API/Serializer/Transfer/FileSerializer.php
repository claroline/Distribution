<?php

namespace Claroline\CoreBundle\API\Serializer\Transfer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\API\Serializer\File\PublicFileSerializer;
use Claroline\CoreBundle\Entity\Import\File;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.import_file")
 * @DI\Tag("claroline.serializer")
 */
class FileSerializer
{
    use SerializerTrait;

    /** @var PublicFileSerializer */
    private $fileSerializer;

    /**
     * ScheduledTaskSerializer constructor.
     *
     * @DI\InjectParams({
     *     "fileSerializer" = @DI\Inject("claroline.serializer.public_file")
     * })
     *
     * @param ObjectManager       $om
     * @param UserSerializer      $userSerializer
     * @param WorkspaceSerializer $workspaceSerializer
     */
    public function __construct(
        PublicFileSerializer $fileSerializer
    ) {
        $this->fileSerializer = $fileSerializer;
    }

    /** @return string */
    public function getClass()
    {
        return 'Claroline\CoreBundle\Entity\Import\File';
    }

    /**
     * Serializes a PublicFile entity.
     *
     * @param PublicFile $file
     * @param array      $options
     *
     * @return array
     */
    public function serialize(File $file, array $options = [])
    {
        return [
            'id' => $file->getUuid(),
            'log' => $file->getLog(),
            'status' => $file->getStatus(),
            'uploadDate' => $file->getUploadDate(),
            'executionDate' => $file->getUploadDate(),
            'uploadedFile' => $this->fileSerializer->serialize($file->getFile()),
          ];
    }

    /**
     * Deserializes data into a PublicFile into an entity.
     *
     * @param \stdClass $data
     * @param File|null $file
     * @param array     $options
     *
     * @return File
     */
    public function deserialize($data, File $file = null, array $options = [])
    {
        $this->sipe('log', 'setLog', $data, $file);
        $this->sipe('status', 'setStatus', $data, $file);
        $this->sipe('executionDate', 'setExeuctionDate', $data, $file);

        if (isset($data['uploadedFile'])) {
            $uploadedFile = $this->fileSerializer->deserializer($data['uploadedFile']);
            if ($uploadedFile) {
                $file->setFile($uploadedFile);
            }
        }

        return $file;
    }
}
