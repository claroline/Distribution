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

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\Workspace\WorkspaceSerializer;
use Claroline\CoreBundle\Repository\WorkspaceRepository;
use Claroline\CursusBundle\Entity\Course;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.cursus.course")
 * @DI\Tag("claroline.serializer")
 */
class CourseSerializer
{
    use SerializerTrait;

    /** @var ObjectManager */
    private $om;
    /** @var WorkspaceSerializer */
    private $workspaceSerializer;

    /** @var WorkspaceRepository */
    private $workspaceRepo;

    /**
     * CourseSerializer constructor.
     *
     * @DI\InjectParams({
     *     "om"                  = @DI\Inject("claroline.persistence.object_manager"),
     *     "workspaceSerializer" = @DI\Inject("claroline.serializer.workspace")
     * })
     *
     * @param ObjectManager       $om
     * @param WorkspaceSerializer $workspaceSerializer
     */
    public function __construct(ObjectManager $om, WorkspaceSerializer $workspaceSerializer)
    {
        $this->om = $om;
        $this->workspaceSerializer = $workspaceSerializer;

        $this->workspaceRepo = $om->getRepository('Claroline\CoreBundle\Entity\Workspace\Workspace');
    }

    /**
     * @param Course $course
     *
     * @return array
     */
    public function serialize(Course $course)
    {
        return [
            'id' => $course->getUuid(),
            'code' => $course->getCode(),
            'title' => $course->getTitle(),
            'description' => $course->getDescription(),
            'meta' => [
                'tutorRoleName' => $course->getTutorRoleName(),
                'learnerRoleName' => $course->getLearnerRoleName(),
                'icon' => $course->getIcon(),
                'maxUsers' => $course->getMaxUsers(),
                'defaultSessionDuration' => $course->getDefaultSessionDuration(),
                'withSessionEvent' => $course->getWithSessionEvent(),
                'displayOrder' => $course->getDisplayOrder(),
            ],
            'registration' => [
                'publicRegistration' => $course->getPublicRegistration(),
                'publicUnregistration' => $course->getPublicUnregistration(),
                'registrationValidation' => $course->getRegistrationValidation(),
                'userValidation' => $course->getUserValidation(),
                'organizationValidation' => $course->getOrganizationValidation(),
            ],
            'workspaceModel' => $course->getWorkspaceModel() ?
                $this->workspaceSerializer->serialize($course->getWorkspaceModel()) :
                null,
            'workspace' => $course->getWorkspace() ?
                $this->workspaceSerializer->serialize($course->getWorkspace()) :
                null,
        ];
    }

    /**
     * @param array  $data
     * @param Course $course
     *
     * @return Course
     */
    public function deserialize($data, Course $course)
    {
        $this->sipe('id', 'setUuid', $data, $course);
        $this->sipe('code', 'setCode', $data, $course);
        $this->sipe('title', 'setTitle', $data, $course);
        $this->sipe('description', 'setDescription', $data, $course);
        $this->sipe('meta.tutorRoleName', 'setTutorRoleName', $data, $course);
        $this->sipe('meta.learnerRoleName', 'setLearnerRoleName', $data, $course);
        $this->sipe('meta.icon', 'setIcon', $data, $course);
        $this->sipe('meta.maxUsers', 'setMaxUsers', $data, $course);
        $this->sipe('meta.defaultSessionDuration', 'setDefaultSessionDuration', $data, $course);
        $this->sipe('meta.withSessionEvent', 'setWithSessionEvent', $data, $course);
        $this->sipe('meta.displayOrder', 'setDisplayOrder', $data, $course);
        $this->sipe('registration.publicRegistration', 'setPublicRegistration', $data, $course);
        $this->sipe('registration.publicUnregistration', 'setPublicUnregistration', $data, $course);
        $this->sipe('registration.registrationValidation', 'setRegistrationValidation', $data, $course);
        $this->sipe('registration.userValidation', 'setUserValidation', $data, $course);
        $this->sipe('registration.organizationValidation', 'setOrganizationValidation', $data, $course);

        if (isset($data['workspace']['uuid'])) {
            $workspace = $this->workspaceRepo->findOneBy(['uuid' => $data['workspace']['uuid']]);

            if ($workspace) {
                $course->setWorkspace($workspace);
            }
        }
        if (isset($data['workspaceModel']['uuid'])) {
            $workspace = $this->workspaceRepo->findOneBy(['uuid' => $data['workspaceModel']['uuid']]);

            if ($workspace) {
                $course->setWorkspaceModel($workspace);
            }
        }

        return $course;
    }
}
