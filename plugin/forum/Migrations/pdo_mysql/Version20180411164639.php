<?php

namespace Claroline\ForumBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2018/04/11 04:46:40
 */
class Version20180411164639 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE claro_forum_comment (
                id INT AUTO_INCREMENT NOT NULL, 
                message_id INT DEFAULT NULL, 
                user_id INT DEFAULT NULL, 
                uuid VARCHAR(36) NOT NULL, 
                content LONGTEXT NOT NULL, 
                created DATETIME NOT NULL, 
                updated DATETIME NOT NULL, 
                author VARCHAR(255) DEFAULT NULL, 
                UNIQUE INDEX UNIQ_4880CE1DD17F50A6 (uuid), 
                INDEX IDX_4880CE1D537A1329 (message_id), 
                INDEX IDX_4880CE1DA76ED395 (user_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql("
            ALTER TABLE claro_forum_comment 
            ADD CONSTRAINT FK_4880CE1D537A1329 FOREIGN KEY (message_id) 
            REFERENCES claro_forum_message (id) 
            ON DELETE CASCADE
        ");
        $this->addSql("
            ALTER TABLE claro_forum_comment 
            ADD CONSTRAINT FK_4880CE1DA76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id)
        ");
        $this->addSql("
            ALTER TABLE claro_forum_subject 
            DROP FOREIGN KEY FK_273AA20B12469DE2
        ");
        $this->addSql("
            DROP INDEX IDX_273AA20B12469DE2 ON claro_forum_subject
        ");
        $this->addSql("
            ALTER TABLE claro_forum_subject 
            ADD viewCount INT NOT NULL, 
            ADD uuid VARCHAR(36) NOT NULL, 
            CHANGE category_id forum_id INT DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE claro_forum_subject 
            ADD CONSTRAINT FK_273AA20B29CCBAD0 FOREIGN KEY (forum_id) 
            REFERENCES claro_forum (id) 
            ON DELETE CASCADE
        ");
        $this->addSql("
            CREATE UNIQUE INDEX UNIQ_273AA20BD17F50A6 ON claro_forum_subject (uuid)
        ");
        $this->addSql("
            CREATE INDEX IDX_273AA20B29CCBAD0 ON claro_forum_subject (forum_id)
        ");
        $this->addSql("
            ALTER TABLE claro_forum 
            ADD validationMode INT NOT NULL, 
            ADD maxComment INT NOT NULL, 
            ADD uuid VARCHAR(36) NOT NULL, 
            DROP activate_notifications
        ");
        $this->addSql("
            CREATE UNIQUE INDEX UNIQ_F2869DFD17F50A6 ON claro_forum (uuid)
        ");
        $this->addSql("
            ALTER TABLE claro_forum_message 
            ADD uuid VARCHAR(36) NOT NULL
        ");
        $this->addSql("
            CREATE UNIQUE INDEX UNIQ_6A49AC0ED17F50A6 ON claro_forum_message (uuid)
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            DROP TABLE claro_forum_comment
        ");
        $this->addSql("
            DROP INDEX UNIQ_F2869DFD17F50A6 ON claro_forum
        ");
        $this->addSql("
            ALTER TABLE claro_forum 
            ADD activate_notifications TINYINT(1) NOT NULL, 
            DROP validationMode, 
            DROP maxComment, 
            DROP uuid
        ");
        $this->addSql("
            DROP INDEX UNIQ_6A49AC0ED17F50A6 ON claro_forum_message
        ");
        $this->addSql("
            ALTER TABLE claro_forum_message 
            DROP uuid
        ");
        $this->addSql("
            ALTER TABLE claro_forum_subject 
            DROP FOREIGN KEY FK_273AA20B29CCBAD0
        ");
        $this->addSql("
            DROP INDEX UNIQ_273AA20BD17F50A6 ON claro_forum_subject
        ");
        $this->addSql("
            DROP INDEX IDX_273AA20B29CCBAD0 ON claro_forum_subject
        ");
        $this->addSql("
            ALTER TABLE claro_forum_subject 
            DROP viewCount, 
            DROP uuid, 
            CHANGE forum_id category_id INT DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE claro_forum_subject 
            ADD CONSTRAINT FK_273AA20B12469DE2 FOREIGN KEY (category_id) 
            REFERENCES claro_forum_category (id) 
            ON DELETE CASCADE
        ");
        $this->addSql("
            CREATE INDEX IDX_273AA20B12469DE2 ON claro_forum_subject (category_id)
        ");
    }
}