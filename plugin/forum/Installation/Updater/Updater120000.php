<?php

namespace Claroline\ForumBundle\Installation\Updater;

use Claroline\CoreBundle\Event\GenericDataEvent;
use Claroline\ForumBundle\Entity\Forum;
use Claroline\ForumBundle\Entity\Message;
use Claroline\ForumBundle\Entity\Subject;
use Claroline\ForumBundle\Entity\Validation\User;
use Claroline\InstallationBundle\Updater\Updater;
use Doctrine\DBAL\Connection;

class Updater120000 extends Updater
{
    private $container;
    /** @var Connection */
    private $conn;
    private $om;

    public function __construct($container)
    {
        $this->container = $container;
        $this->conn = $container->get('doctrine.dbal.default_connection');
        $this->om = $container->get('claroline.persistence.object_manager');
    }

    public function preUpdate()
    {
        try {
            $this->log('backing up the forum subjects...');
            $this->conn->query('CREATE TABLE claro_forum_subject_temp_new  AS (SELECT * FROM claro_forum_subject)');
        } catch (\Exception $e) {
            $this->log('Coulnt backup forum subjects');
        }
    }

    public function postUpdate()
    {
        $this->log('restoring the categories as tag...');

        $sql = 'SELECT * FROM claro_forum_subject_temp_new ';
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        foreach ($stmt->fetchAll() as $rowSubject) {
            $this->log('Restoring category as tag for subject '.$rowSubject['title'].'...');
            $this->restoreSubjectCategory($rowSubject);
        }

        $this->createForumUsers();
    }

    private function restoreSubjectCategory(array $subject)
    {
        $currentSubject = $this->om->getRepository(Subject::class)->find($subject['id']);

        $event = new GenericDataEvent([
            'class' => Subject::class,
            'ids' => [$currentSubject->getUuid()],
        ]);
        $this->container->get('event_dispatcher')->dispatch('claroline_retrieve_used_tags_by_class_and_ids', $event);

        if (count($event->getResponse()) > 0) {
            return;
        }

        //step 1: restore forum subject

        //step 2: restore tags from categories

/*
        $sql = 'SELECT * FROM claro_forum_category where id =  '.$subject['category_id'];
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $category = $stmt->fetch();
        $forum = $this->om->getRepository(Forum::class)->find($category['forum_id']);

        $currentSubject->setForum($forum);

        if ('' === trim($currentSubject->getContent())) {
            //restore subject first message
            $messages = $this->om->getRepository(Message::class)
              ->findBy(['subject' => $currentSubject], ['id' => 'ASC']);

            if (isset($messages[0])) {
                $firstMessage = $messages[0];
                $currentSubject->setContent($firstMessage->getContent());
                $this->om->remove($firstMessage);
            }
        }

        $this->om->persist($currentSubject);

        $event = new GenericDataEvent([
            'tags' => [$category['name']],
            'data' => [
                [
                    'class' => 'Claroline\ForumBundle\Entity\Subject',
                    'id' => $currentSubject->getUuid(),
                    'name' => $currentSubject->getTitle(),
                ],
            ],
            'replace' => true,
        ]);

        $this->container->get('event_dispatcher')->dispatch('claroline_tag_multiple_data', $event);
        */
    }

    private function createForumUsers()
    {
        $users = $this->om->getRepository(User::class)->findAll();

        if (0 === count($users)) {
            $this->log('Build forum users...');

            $sql = '
                INSERT INTO claro_forum_user (user_id, forum_id)
                SELECT DISTINCT user.id, forum.id
                FROM claro_forum forum
                LEFT JOIN claro_forum_message message ON message.forum_id = forum.id
                LEFT JOIN claro_user user on message.creator_id = user.id
            ';

            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
        }
    }
}
