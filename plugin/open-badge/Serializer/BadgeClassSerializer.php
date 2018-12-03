<?php

namespace Claroline\OpenBadgeBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\File\PublicFile;
use Claroline\CoreBundle\Entity\Organization\Organization;
use Claroline\CoreBundle\Library\Utilities\FileUtilities;
use Claroline\OpenBadgeBundle\Entity\BadgeClass;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Routing\RouterInterface;

/**
 * @DI\Service()
 * @DI\Tag("claroline.serializer")
 */
class BadgeClassSerializer
{
    use SerializerTrait;

    /**
     * Crud constructor.
     *
     * @DI\InjectParams({
     *     "fileUt"     = @DI\Inject("claroline.utilities.file"),
     *     "router"     = @DI\Inject("router"),
     *     "serializer" = @DI\Inject("claroline.api.serializer"),
     *     "om"         = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param Router $router
     */
    public function __construct(
        FileUtilities $fileUt,
        RouterInterface $router,
        SerializerProvider $serializer,
        ObjectManager $om
    ) {
        $this->router = $router;
        $this->fileUt = $fileUt;
        $this->serializer = $serializer;
        $this->om = $om;
    }

    /**
     * Serializes a Group entity.
     *
     * @param Group $group
     * @param array $options
     *
     * @return array
     */
    public function serialize(BadgeClass $badge, array $options = [])
    {
        return [
            'id' => $this->router->generate('apiv2_badge-class_get', ['id' => $badge->getId()]),
            'name' => $badge->getName(),
            'description' => $badge->getDescription(),
            'criteria' => $badge->getCriteria(),
            'image' => $badge->getImage() && $this->om->getRepository(PublicFile::class)->findOneBy([
                  'url' => $badge->getImage(),
              ]) ? $this->serializer->serialize($this->om->getRepository(PublicFile::class)->findOneBy([
                  'url' => $badge->getImage(),
              ])
            ) : null,
            'issuer' => $this->serializer->serialize($badge->getIssuer()),
        ];
    }

    /**
     * Deserializes data into a Group entity.
     *
     * @param \stdClass $data
     * @param Group     $group
     * @param array     $options
     *
     * @return Group
     */
    public function deserialize($data, BadgeClass $badge = null, array $options = [])
    {
        $this->sipe('name', 'setName', $data, $badge);
        $this->sipe('description', 'setDescription', $data, $badge);
        $this->sipe('criteria', 'setCriteria', $data, $badge);

        if (isset($data['issuer'])) {
            $badge->setIssuer($this->serializer->deserialize(
                Organization::class,
                $data['issuer']
            ));
        }

        if (isset($data['image']) && isset($data['image']['id'])) {
            $thumbnail = $this->serializer->deserialize(
                PublicFile::class,
                $data['image']
            );
            $badge->setImage($data['image']['url']);
            $this->fileUt->createFileUse(
                $thumbnail,
                BadgeClass::class,
                $badge->getUuid()
            );
        }

        return $badge;
    }

    public function getClass()
    {
        return BadgeClass::class;
    }
}
