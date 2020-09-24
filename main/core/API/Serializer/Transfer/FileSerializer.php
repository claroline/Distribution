<?php

namespace Claroline\CoreBundle\API\Serializer\Transfer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\File\PublicFileSerializer;
use Claroline\CoreBundle\Entity\Import\File;
use Claroline\CoreBundle\Entity\Workspace\Workspace;

class FileSerializer
{
    use SerializerTrait;

    /** @var PublicFileSerializer */
    private $fileSerializer;

    public function __construct(PublicFileSerializer $fileSerializer, ObjectManager $om)
    {
        $this->fileSerializer = $fileSerializer;
        $this->om = $om;
    }

    /** @return string */
    public function getClass()
    {
        return File::class;
    }

    public function getName()
    {
        return 'public_file';
    }

    public function serialize(File $file, array $options = []): array
    {
        $data = [
            'id' => $file->getUuid(),
            'log' => $file->getLog(),
            'status' => $file->getStatus(),
            'uploadDate' => $file->getUploadDate()->format('Y-m-d\TH:i:s'),
            'executionDate' => $file->getUploadDate()->format('Y-m-d\TH:i:s'),
          ];

        if ($file->getFile()) {
            $data['uploadedFile'] = $this->fileSerializer->serialize($file->getFile());
        }

        return $data;
    }

    public function deserialize(array $data, File $file = null, array $options = []): File
    {
        $this->sipe('log', 'setLog', $data, $file);
        $this->sipe('status', 'setStatus', $data, $file);
        $this->sipe('executionDate', 'setExecutionDate', $data, $file);
        $this->sipe('action', 'setAction', $data, $file);

        if (isset($data['uploadedFile'])) {
            $uploadedFile = $this->fileSerializer->deserialize($data['uploadedFile']);
            if ($uploadedFile) {
                $file->setFile($uploadedFile);
            }
        }

        if (isset($data['workspace'])) {
            $workspace = $this->om->getRepository(Workspace::class)->findOneBy(['uuid' => $data['workspace']['id']]);
            if ($workspace) {
                $file->setWorkspace($workspace);
            }
        }

        return $file;
    }
}
