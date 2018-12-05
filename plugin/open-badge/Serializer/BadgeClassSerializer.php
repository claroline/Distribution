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
     * @DI\InjectParams({
     *     "fileUt"             = @DI\Inject("claroline.utilities.file"),
     *     "router"             = @DI\Inject("router"),
     *     "serializer"         = @DI\Inject("claroline.api.serializer"),
     *     "om"                 = @DI\Inject("claroline.persistence.object_manager"),
     *     "criteriaSerializer" = @DI\Inject("claroline.serializer.open_badge.criteria"),
     *     "imageSerializer"    = @DI\Inject("claroline.serializer.open_badge.image"),
     *     "profileSerializer"  = @DI\Inject("claroline.serializer.open_badge.profile")
     * })
     *
     * @param Router $router
     */
    public function __construct(
        FileUtilities $fileUt,
        RouterInterface $router,
        SerializerProvider $serializer,
        ObjectManager $om,
        CriteriaSerializer $criteriaSerializer,
        ProfileSerializer $profileSerializer,
        ImageSerializer $imageSerializer
    ) {
        $this->router = $router;
        $this->fileUt = $fileUt;
        $this->serializer = $serializer;
        $this->om = $om;
        $this->criteriaSerializer = $criteriaSerializer;
        $this->profileSerializer = $profileSerializer;
        $this->imageSerializer = $imageSerializer;
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
        $data = [
            'id' => $badge->getUuid(),
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

        if (in_array(Options::ENFORCE_OPEN_BADGE_JSON, $options)) {
            $data['id'] = $this->router->generate('apiv2_open_badge__badge_class', ['badge' => $badge->getUuid()]);
            $data['type'] = 'BadgeClass';
            $data['criteria'] = $this->criteriaSerializer->serialize($badge);
            $image = $this->om->getRepository(PublicFile::class)->findOneBy(['url' => $badge->getImage()]);

            if ($image) {
                $data['image'] = $this->imageSerializer->serialize($image);
            }

            $data['issuer'] = $this->profileSerializer->serialize($badge->getIssuer());
        }

        return $data;
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
