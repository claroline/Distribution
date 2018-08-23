<?php

namespace Claroline\ForumBundle\Installation\Updater;

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

        $this->restoreSubjectCategories();
        $this->createForumUsers();
    }

    private function restoreSubjectCategories()
    {
        $sql = "
          SELECT COUNT(object.id) as count
          FROM claro_tagbundle_tagged_object object
          WHERE object.object_class LIKE 'Claroline\ForumBundle\Entity\Subject'
        ";
        $stmt = $this->executeSql($sql);
        $count = $stmt->fetchColumn(0);

        if ((int) $count > 0) {
            $this->log('Already done...');

            return;
        }

        //step 1: restore forum subject
        $this->log('Set subject forums...');

        $sql = '
          UPDATE claro_forum_subject subject
          JOIN claro_forum_subject_temp_new tmp on tmp.id = subject.id
          JOIN claro_forum_category tmp.category_id = category.id
          SET subject.forum_id = category.forum_id
        ';

        //step 2: restore tags from categories
        $this->log('Insert tags...');
        $sql = '
            INSERT INTO claro_tagbundle_tag (tag_name)
            SELECT name FROM claro_forum_category
        ';

        $this->executeSql($sql);

        $this->log('Insert tagged objects...');

        $sql = "
            INSERT INTO claro_tagbundle_tagged_object (tag_id, object_class, object_id, object_name)
            SELECT tag.id, 'Claroline\ForumBundle\Entity\Subject', subject.uuid, subject.title
            FROM claro_forum_category category
            LEFT JOIN claro_forum_subject_temp_new tmp on tmp.category_id = category.id
            LEFT JOIN claro_forum_subject subject on tmp.id = subject.id
            LEFT JOIN claro_tagbundle_tag tag on tag.tag_name = category.name
            LEFT JOIN claro_forum forum on category.forum_id = forum.id
        ";

        $this->executeSql($sql);
    }

    private function executeSql($sql, $force = false)
    {
        $stmt = $this->conn->prepare($sql);

        if (!$force) {
            $stmt->execute();
        } else {
            try {
                $stmt->execute();
            } catch (\Exception $e) {
                $this->log($sql.'; Failed to be executed');
            }
        }

        return $stmt;
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
                JOIN claro_forum_category category ON category.forum_id = forum.id
                JOIN claro_forum_subject_temp_new subject ON subject.category_id = category.id
                JOIN claro_forum_message message ON message.subject_id = subject.id
                JOIN claro_user user on message.user_id = user.id
            ';

            $this->executeSql($sql);
        } else {
            $this->log('Users already loaded...');
        }
    }
}
