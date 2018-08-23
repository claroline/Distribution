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
        $this->restoreForeignKeys();
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

    //constraints from migrations. Put them back if they weren't here yet
    private function restoreForeignKeys()
    {
        $this->executeSql('
            ALTER TABLE claro_forum_subject
            ADD CONSTRAINT FK_273AA20B29CCBAD0 FOREIGN KEY (forum_id)
            REFERENCES claro_forum (id)
            ON DELETE CASCADE
        ', true);

        $this->executeSql('
            ALTER TABLE claro_forum_subject
            ADD CONSTRAINT FK_273AA20B5BB66C05 FOREIGN KEY (poster_id)
            REFERENCES claro_public_file (id)
            ON DELETE SET NULL
        ', true);
        $this->executeSql('
            CREATE UNIQUE INDEX UNIQ_273AA20BD17F50A6 ON claro_forum_subject (uuid)
        ', true);
        $this->executeSql('
            CREATE INDEX IDX_273AA20B29CCBAD0 ON claro_forum_subject (forum_id)
        ', true);
        $this->executeSql('
            CREATE INDEX IDX_273AA20B5BB66C05 ON claro_forum_subject (poster_id)
        ', true);
        $this->executeSql("
            ALTER TABLE claro_forum
            ADD validationMode VARCHAR(255) NOT NULL,
            ADD maxComment INT NOT NULL,
            ADD displayMessages INT NOT NULL,
            ADD dataListOptions VARCHAR(255) NOT NULL,
            ADD lockDate DATETIME DEFAULT NULL,
            ADD show_overview TINYINT(1) DEFAULT '1' NOT NULL,
            ADD description LONGTEXT DEFAULT NULL,
            ADD uuid VARCHAR(36) NOT NULL,
            DROP activate_notifications
        ", true);
        $this->executeSql('
            CREATE UNIQUE INDEX UNIQ_F2869DFD17F50A6 ON claro_forum (uuid)
        ', true);
        $this->executeSql('
            ALTER TABLE claro_forum_message
            ADD parent_id INT DEFAULT NULL,
            ADD uuid VARCHAR(36) NOT NULL,
            ADD moderation VARCHAR(255) NOT NULL,
            ADD flagged TINYINT(1) NOT NULL,
            ADD first TINYINT(1) NOT NULL
        ', true);
        $this->executeSql('
            ALTER TABLE claro_forum_message
            ADD CONSTRAINT FK_6A49AC0E727ACA70 FOREIGN KEY (parent_id)
            REFERENCES claro_forum_message (id)
            ON DELETE CASCADE
        ', true);
        $this->executeSql('
            CREATE UNIQUE INDEX UNIQ_6A49AC0ED17F50A6 ON claro_forum_message (uuid)
        ', true);
        $this->executeSql('
            CREATE INDEX IDX_6A49AC0E727ACA70 ON claro_forum_message (parent_id)
        ', true);
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
