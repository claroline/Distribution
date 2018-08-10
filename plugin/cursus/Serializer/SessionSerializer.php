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
use Claroline\CoreBundle\API\Serializer\User\RoleSerializer;
use Claroline\CoreBundle\API\Serializer\Workspace\WorkspaceSerializer;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use Claroline\CoreBundle\Repository\WorkspaceRepository;
use Claroline\CursusBundle\Entity\CourseSession;
use Claroline\CursusBundle\Repository\CourseRepository;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.cursus.session")
 * @DI\Tag("claroline.serializer")
 */
class SessionSerializer
{
    use SerializerTrait;

    /** @var ObjectManager */
    private $om;
    /** @var RoleSerializer */
    private $roleSerializer;
    /** @var WorkspaceSerializer */
    private $workspaceSerializer;

    /** @var CourseRepository */
    private $courseRepo;
    /** @var WorkspaceRepository */
    private $workspaceRepo;

    /**
     * SessionSerializer constructor.
     *
     * @DI\InjectParams({
     *     "om"                  = @DI\Inject("claroline.persistence.object_manager"),
     *     "roleSerializer"      = @DI\Inject("claroline.serializer.role"),
     *     "workspaceSerializer" = @DI\Inject("claroline.serializer.workspace")
     * })
     *
     * @param ObjectManager       $om
     * @param RoleSerializer      $roleSerializer
     * @param WorkspaceSerializer $workspaceSerializer
     */
    public function __construct(
        ObjectManager $om,
        RoleSerializer $roleSerializer,
        WorkspaceSerializer $workspaceSerializer
    ) {
        $this->om = $om;
        $this->roleSerializer = $roleSerializer;
        $this->workspaceSerializer = $workspaceSerializer;

        $this->courseRepo = $om->getRepository('Claroline\CursusBundle\Entity\Course');
        $this->workspaceRepo = $om->getRepository('Claroline\CoreBundle\Entity\Workspace\Workspace');
    }

    /**
     * @param CourseSession $session
     *
     * @return array
     */
    public function serialize(CourseSession $session)
    {
        return [
            'id' => $session->getUuid(),
            'name' => $session->getUuid(),
            'description' => $session->getDescription(),
            'meta' => [
                'sessionStatus' => $session->getSessionStatus(),
                'defaultSession' => $session->isDefaultSession(),
                'creationDate' => $session->getCreationDate(),
                'maxUsers' => $session->getMaxUsers(),
                'displayOrder' => $session->getDisplayOrder(),
            ],
            'registration' => [
                'publicRegistration' => $session->getPublicRegistration(),
                'publicUnregistration' => $session->getPublicUnregistration(),
                'registrationValidation' => $session->getRegistrationValidation(),
                'userValidation' => $session->getUserValidation(),
                'organizationValidation' => $session->getOrganizationValidation(),
            ],
            'workspace' => $session->getWorkspace() ?
                $this->workspaceSerializer->serialize($session->getWorkspace()) :
                null,
            'course' => $session->getCourse(),
            'learnerRole' => $session->getLearnerRole() ?
                $this->roleSerializer->serialize($session->getLearnerRole(), [Options::SERIALIZE_MINIMAL]) :
                null,
            'tutorRole' => $session->getTutorRole() ?
                $this->roleSerializer->serialize($session->getTutorRole(), [Options::SERIALIZE_MINIMAL]) :
                null,
            'startDate' => $session->getStartDate() ?
                DateNormalizer::normalize($session->getStartDate()) :
                null,
            'endDate' => $session->getEndDate() ?
                DateNormalizer::normalize($session->getEndDate()) :
                null,
            'type' => $session->getType(),
            'eventRegistrationType' => $session->getEventRegistrationType(),
            'details' => $session->getDetails(),
        ];
    }

    /**
     * @param array         $data
     * @param CourseSession $session
     *
     * @return CourseSession
     */
    public function deserialize($data, CourseSession $session)
    {
//        $this->sipe('id', 'setUuid', $data, $course);
//        $this->sipe('code', 'setCode', $data, $course);
//        $this->sipe('title', 'setTitle', $data, $course);
//        $this->sipe('description', 'setDescription', $data, $course);
//        $this->sipe('meta.tutorRoleName', 'setTutorRoleName', $data, $course);
//        $this->sipe('meta.learnerRoleName', 'setLearnerRoleName', $data, $course);
//        $this->sipe('meta.icon', 'setIcon', $data, $course);
//        $this->sipe('meta.maxUsers', 'setMaxUsers', $data, $course);
//        $this->sipe('meta.defaultSessionDuration', 'setDefaultSessionDuration', $data, $course);
//        $this->sipe('meta.withSessionEvent', 'setWithSessionEvent', $data, $course);
//        $this->sipe('meta.displayOrder', 'setDisplayOrder', $data, $course);
//        $this->sipe('registration.publicRegistration', 'setPublicRegistration', $data, $course);
//        $this->sipe('registration.publicUnregistration', 'setPublicUnregistration', $data, $course);
//        $this->sipe('registration.registrationValidation', 'setRegistrationValidation', $data, $course);
//        $this->sipe('registration.userValidation', 'setUserValidation', $data, $course);
//        $this->sipe('registration.organizationValidation', 'setOrganizationValidation', $data, $course);
//
        if (isset($data['workspace']['uuid'])) {
            $workspace = $this->workspaceRepo->findOneBy(['uuid' => $data['workspace']['uuid']]);

            if ($workspace) {
                $session->setWorkspace($workspace);
            }
        }
        if (isset($data['course']['id'])) {
            $course = $this->courseRepo->findOneBy(['uuid' => $data['course']['id']]);

            if ($course) {
                $session->setCourse($course);
            }
        }

        return $session;
    }
}
