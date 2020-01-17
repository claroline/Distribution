<?php

namespace Icap\Lessonbundle\Testing;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Resource\ResourceType;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Icap\LessonBundle\Entity\Chapter;
use Icap\LessonBundle\Entity\Lesson;

class Persister
{
    /** @var ObjectManager */
    private $om;
    /** @var Role */
    private $userRole;
    /** @var LessonType */
    private $lessonType;

    public function __construct(ObjectManager $om)
    {
        $this->om = $om;
    }

    public function user($username)
    {
        $user = new User();
        $user->setFirstName($username);
        $user->setLastName($username);
        $user->setUsername($username);
        $user->setPassword($username);
        $user->setEmail($username.'@email.com');
        $this->om->persist($user);
        if (!$this->userRole) {
            $this->userRole = $this->om->getRepository(Role::class)->findOneByTranslationKey('user');
        }
        $user->addRole($this->userRole);
        $workspace = new Workspace();
        $workspace->setName($username);
        $workspace->setCreator($user);
        $workspace->setCode($username);
        $workspace->setGuid($username);
        $this->om->persist($workspace);
        $user->setPersonalWorkspace($workspace);

        $this->om->flush();

        return $user;
    }

    public function lesson($title, User $creator)
    {
        $lesson = new Lesson();
        if (!$this->lessonType) {
            $this->lessonType = $this->om->getRepository(ResourceType::class)->findOneByName('icap_lesson');
        }

        $node = new ResourceNode();
        $node->setName($title);
        $node->setCreator($creator);
        $node->setResourceType($this->lessonType);
        $node->setWorkspace($creator->getPersonalWorkspace());
        $node->setGuid(time());

        $lesson->setResourceNode($node);

        $this->om->persist($lesson);
        $this->om->persist($node);
        $this->om->flush();

        return $lesson;
    }

    public function chapter($title, $text, $lesson, $root)
    {
        $chapter = new Chapter();
        $chapter->setTitle($title);
        $chapter->setText($text);
        $chapter->setLesson($lesson);

        $this->om->persist($chapter);
        $this->om->flush();

        return $chapter;
    }
}
