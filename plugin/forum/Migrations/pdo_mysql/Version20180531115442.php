<?php

namespace Claroline\ForumBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2018/05/31 11:54:43
 */
class Version20180531115442 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE claro_forum_user (
                id INT AUTO_INCREMENT NOT NULL, 
                user_id INT DEFAULT NULL, 
                forum_id INT DEFAULT NULL, 
                access TINYINT(1) NOT NULL, 
                INDEX IDX_2CFBFDC4A76ED395 (user_id), 
                INDEX IDX_2CFBFDC429CCBAD0 (forum_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET UTF8 COLLATE UTF8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql("
            ALTER TABLE claro_forum_user 
            ADD CONSTRAINT FK_2CFBFDC4A76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id)
        ");
        $this->addSql("
            ALTER TABLE claro_forum_user 
            ADD CONSTRAINT FK_2CFBFDC429CCBAD0 FOREIGN KEY (forum_id) 
            REFERENCES claro_forum (id)
        ");
        $this->addSql("
            ALTER TABLE claro_forum_subject 
            ADD sticked TINYINT(1) NOT NULL, 
            ADD closed TINYINT(1) NOT NULL, 
            DROP isSticked, 
            DROP isClosed
        ");
        $this->addSql("
            ALTER TABLE claro_forum_message CHANGE isvisible visible TINYINT(1) NOT NULL
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            DROP TABLE claro_forum_user
        ");
        $this->addSql("
            ALTER TABLE claro_forum_message CHANGE visible isVisible TINYINT(1) NOT NULL
        ");
        $this->addSql("
            ALTER TABLE claro_forum_subject 
            ADD isSticked TINYINT(1) NOT NULL, 
            ADD isClosed TINYINT(1) NOT NULL, 
            DROP sticked, 
            DROP closed
        ");
    }
}