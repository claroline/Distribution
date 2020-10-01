<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CursusBundle\Manager;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Manager\RoleManager;
use Claroline\CoreBundle\Manager\Template\TemplateManager;
use Claroline\CursusBundle\Entity\Course;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class CourseManager
{
    /** @var TokenStorageInterface */
    private $tokenStorage;
    /** @var EventDispatcherInterface */
    private $eventDispatcher;
    /** @var ObjectManager */
    private $om;
    /** @var TemplateManager */
    private $templateManager;
    /** @var RoleManager */
    private $roleManager;
    /** @var SessionManager */
    private $sessionManager;

    public function __construct(
        TokenStorageInterface $tokenStorage,
        EventDispatcherInterface $eventDispatcher,
        ObjectManager $om,
        TemplateManager $templateManager,
        RoleManager $roleManager,
        SessionManager $sessionManager
    ) {
        $this->eventDispatcher = $eventDispatcher;
        $this->om = $om;
        $this->roleManager = $roleManager;
        $this->tokenStorage = $tokenStorage;
        $this->templateManager = $templateManager;
        $this->sessionManager = $sessionManager;
    }

    public function generateFromTemplate(Course $course, string $basePath, string $locale)
    {
        $placeholders = [
            'course_name' => $course->getName(),
            'course_code' => $course->getCode(),
            'course_description' => $course->getDescription(),
            'course_poster_url' => $basePath.'/'.$course->getPoster(),
            'course_default_duration' => $course->getDefaultSessionDuration(),
            'course_public_registration' => $course->getPublicRegistration(),
            'course_max_users' => $course->getMaxUsers(),
        ];

        $content = $this->templateManager->getTemplate('training_course', $placeholders, $locale);

        // append all available sessions to the export
        foreach ($course->getSessions() as $session) {
            if (!$session->isTerminated()) {
                $content .= "<div style='page-break-before: always'>{$this->sessionManager->generateFromTemplate($session, $basePath, $locale)}</div>";
            }
        }

        return $content;
    }

    /**
     * Registers an user to default session of a course if allowed.
     */
    public function registerUserToCourse(Course $course, User $user, bool $skipValidation = false)
    {

    }
}
