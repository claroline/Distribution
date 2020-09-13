<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CursusBundle\Serializer;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\File\PublicFileSerializer;
use Claroline\CoreBundle\API\Serializer\Resource\ResourceNodeSerializer;
use Claroline\CoreBundle\API\Serializer\User\LocationSerializer;
use Claroline\CoreBundle\API\Serializer\User\RoleSerializer;
use Claroline\CoreBundle\API\Serializer\Workspace\WorkspaceSerializer;
use Claroline\CoreBundle\Entity\File\PublicFile;
use Claroline\CoreBundle\Entity\Organization\Location;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Library\Normalizer\DateRangeNormalizer;
use Claroline\CursusBundle\Entity\Course;
use Claroline\CursusBundle\Entity\CourseSession;

class SessionSerializer
{
    use SerializerTrait;

    /** @var ObjectManager */
    private $om;
    /** @var PublicFileSerializer */
    private $fileSerializer;
    /** @var RoleSerializer */
    private $roleSerializer;
    /** @var LocationSerializer */
    private $locationSerializer;
    /** @var WorkspaceSerializer */
    private $workspaceSerializer;
    /** @var ResourceNodeSerializer */
    private $resourceSerializer;
    /** @var CourseSerializer */
    private $courseSerializer;

    private $courseRepo;

    /**
     * SessionSerializer constructor.
     *
     * @param ObjectManager          $om
     * @param PublicFileSerializer   $fileSerializer
     * @param RoleSerializer         $roleSerializer
     * @param LocationSerializer     $locationSerializer
     * @param WorkspaceSerializer    $workspaceSerializer
     * @param ResourceNodeSerializer $resourceSerializer
     * @param CourseSerializer       $courseSerializer
     */
    public function __construct(
        ObjectManager $om,
        PublicFileSerializer $fileSerializer,
        RoleSerializer $roleSerializer,
        LocationSerializer $locationSerializer,
        WorkspaceSerializer $workspaceSerializer,
        ResourceNodeSerializer $resourceSerializer,
        CourseSerializer $courseSerializer
    ) {
        $this->om = $om;
        $this->fileSerializer = $fileSerializer;
        $this->roleSerializer = $roleSerializer;
        $this->locationSerializer = $locationSerializer;
        $this->workspaceSerializer = $workspaceSerializer;
        $this->resourceSerializer = $resourceSerializer;
        $this->courseSerializer = $courseSerializer;

        $this->courseRepo = $om->getRepository(Course::class);
    }

    /**
     * @return string
     */
    public function getSchema()
    {
        return '#/plugin/cursus/session.json';
    }

    /**
     * @param CourseSession $session
     * @param array         $options
     *
     * @return array
     */
    public function serialize(CourseSession $session, array $options = [])
    {
        $serialized = [
            'id' => $session->getUuid(),
            'code' => $session->getCode(),
            'name' => $session->getName(),
            'description' => $session->getDescription(),
            'poster' => $this->serializePoster($session),
            'thumbnail' => $this->serializeThumbnail($session),
            'workspace' => $session->getWorkspace() ?
                $this->workspaceSerializer->serialize($session->getWorkspace(), [Options::SERIALIZE_MINIMAL]) :
                null,
            'location' => $session->getLocation() ?
                $this->locationSerializer->serialize($session->getLocation(), [Options::SERIALIZE_MINIMAL]) :
                null,
            'restrictions' => [
                'users' => $session->getMaxUsers(),
                'dates' => DateRangeNormalizer::normalize($session->getStartDate(), $session->getEndDate()),
            ],
        ];

        if (!in_array(Options::SERIALIZE_MINIMAL, $options)) {
            $duration = null;
            if ($session->getStartDate() && $session->getEndDate()) {
                // this is just to expose the same schema than course
                $duration = $session->getEndDate()->diff($session->getStartDate())->format('%a');
            }

            $serialized = array_merge($serialized, [
                'meta' => [
                    'duration' => $duration,
                    'default' => $session->isDefaultSession(),
                    'order' => $session->getDisplayOrder(),

                    'type' => $session->getType(),
                    'course' => $this->courseSerializer->serialize($session->getCourse(), [Options::SERIALIZE_MINIMAL]),
                    'learnerRole' => $session->getLearnerRole() ?
                        $this->roleSerializer->serialize($session->getLearnerRole(), [Options::SERIALIZE_MINIMAL]) :
                        null,
                    'tutorRole' => $session->getTutorRole() ?
                        $this->roleSerializer->serialize($session->getTutorRole(), [Options::SERIALIZE_MINIMAL]) :
                        null,
                    'color' => $session->getColor(),
                    'certificated' => $session->getCertificated(),
                ],
                'registration' => [
                    'publicRegistration' => $session->getPublicRegistration(),
                    'publicUnregistration' => $session->getPublicUnregistration(),
                    'registrationValidation' => $session->getRegistrationValidation(),
                    'userValidation' => $session->getUserValidation(),
                    'organizationValidation' => $session->getOrganizationValidation(),
                    'eventRegistrationType' => $session->getEventRegistrationType(),
                ],
                'resources' => array_map(function (ResourceNode $resource) {
                    return $this->resourceSerializer->serialize($resource, [Options::SERIALIZE_MINIMAL]);
                }, $session->getResources()->toArray()),
            ]);
        }

        return $serialized;
    }

    /**
     * @param array         $data
     * @param CourseSession $session
     *
     * @return CourseSession
     */
    public function deserialize(array $data, CourseSession $session)
    {
        $this->sipe('id', 'setUuid', $data, $session);
        $this->sipe('code', 'setCode', $data, $session);
        $this->sipe('name', 'setName', $data, $session);
        $this->sipe('description', 'setDescription', $data, $session);

        $this->sipe('meta.default', 'setDefaultSession', $data, $session);
        $this->sipe('meta.type', 'setType', $data, $session);
        $this->sipe('meta.order', 'setDisplayOrder', $data, $session);
        $this->sipe('meta.color', 'setColor', $data, $session);
        //$this->sipe('meta.total', 'setTotal', $data, $session);
        $this->sipe('meta.certificated', 'setCertificated', $data, $session);

        $this->sipe('restrictions.users', 'setMaxUsers', $data, $session);

        $this->sipe('registration.publicRegistration', 'setPublicRegistration', $data, $session);
        $this->sipe('registration.publicUnregistration', 'setPublicUnregistration', $data, $session);
        $this->sipe('registration.registrationValidation', 'setRegistrationValidation', $data, $session);
        $this->sipe('registration.userValidation', 'setUserValidation', $data, $session);
        $this->sipe('registration.organizationValidation', 'setOrganizationValidation', $data, $session);
        $this->sipe('registration.eventRegistrationType', 'setEventRegistrationType', $data, $session);

        if (isset($data['restrictions']['dates'])) {
            $dates = DateRangeNormalizer::denormalize($data['restrictions']['dates']);

            $session->setStartDate($dates[0]);
            $session->setEndDate($dates[1]);
        }

        if (isset($data['poster'])) {
            $session->setPoster($data['poster']['url'] ?? null);
        }

        if (isset($data['thumbnail'])) {
            $session->setThumbnail($data['thumbnail']['url'] ?? null);
        }

        $course = $session->getCourse();
        // Sets course at creation
        if (empty($course) && isset($data['meta']['course']['id'])) {
            /** @var Course $course */
            $course = $this->courseRepo->findOneBy(['uuid' => $data['meta']['course']['id']]);
            if ($course) {
                $session->setCourse($course);
            }
        }

        if (isset($data['location'])) {
            $location = null;
            if (!empty($data['location']['id'])) {
                $location = $this->om->getRepository(Location::class)->findOneBy(['uuid' => $data['location']['id']]);
            }

            $session->setLocation($location);
        }

        if (isset($data['resources'])) {
            $resources = [];
            foreach ($data['resources'] as $resourceData) {
                $resources[] = $this->om->getRepository(ResourceNode::class)->findOneBy(['uuid' => $resourceData['id']]);
            }

            $session->setResources($resources);
        }

        return $session;
    }

    private function serializePoster(CourseSession $session)
    {
        if (!empty($session->getPoster())) {
            /** @var PublicFile $file */
            $file = $this->om
                ->getRepository(PublicFile::class)
                ->findOneBy(['url' => $session->getPoster()]);

            if ($file) {
                return $this->fileSerializer->serialize($file);
            }
        }

        return null;
    }

    private function serializeThumbnail(CourseSession $session)
    {
        if (!empty($session->getThumbnail())) {
            /** @var PublicFile $file */
            $file = $this->om
                ->getRepository(PublicFile::class)
                ->findOneBy(['url' => $session->getThumbnail()]);

            if ($file) {
                return $this->fileSerializer->serialize($file);
            }
        }

        return null;
    }
}
