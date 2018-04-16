<?php

namespace Claroline\ForumBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2018/04/16 02:17:46
 */
class Version20180416141744 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_forum_message 
            ADD parent_id INT DEFAULT NULL, 
            ADD isVisible TINYINT(1) NOT NULL
        ");
        $this->addSql("
            ALTER TABLE claro_forum_message 
            ADD CONSTRAINT FK_6A49AC0E727ACA70 FOREIGN KEY (parent_id) 
            REFERENCES claro_forum_message (id) 
            ON DELETE CASCADE
        ");
        $this->addSql("
            CREATE INDEX IDX_6A49AC0E727ACA70 ON claro_forum_message (parent_id)
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_forum_message 
            DROP FOREIGN KEY FK_6A49AC0E727ACA70
        ");
        $this->addSql("
            DROP INDEX IDX_6A49AC0E727ACA70 ON claro_forum_message
        ");
        $this->addSql("
            ALTER TABLE claro_forum_message 
            DROP parent_id, 
            DROP isVisible
        ");
    }
}