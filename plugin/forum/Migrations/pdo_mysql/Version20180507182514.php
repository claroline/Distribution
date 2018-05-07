<?php

namespace Claroline\ForumBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2018/05/07 06:25:15
 */
class Version20180507182514 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_forum_subject 
            ADD poster_id INT DEFAULT NULL, 
            ADD content LONGTEXT NOT NULL
        ");
        $this->addSql("
            ALTER TABLE claro_forum_subject 
            ADD CONSTRAINT FK_273AA20B5BB66C05 FOREIGN KEY (poster_id) 
            REFERENCES claro_public_file (id) 
            ON DELETE SET NULL
        ");
        $this->addSql("
            CREATE INDEX IDX_273AA20B5BB66C05 ON claro_forum_subject (poster_id)
        ");
        $this->addSql("
            ALTER TABLE claro_forum 
            ADD displayMessages INT NOT NULL, 
            ADD dataListOptions LONGTEXT NOT NULL COMMENT '(DC2Type:json_array)', 
            ADD lockDate DATETIME DEFAULT NULL
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_forum 
            DROP displayMessages, 
            DROP dataListOptions, 
            DROP lockDate
        ");
        $this->addSql("
            ALTER TABLE claro_forum_subject 
            DROP FOREIGN KEY FK_273AA20B5BB66C05
        ");
        $this->addSql("
            DROP INDEX IDX_273AA20B5BB66C05 ON claro_forum_subject
        ");
        $this->addSql("
            ALTER TABLE claro_forum_subject 
            DROP poster_id, 
            DROP content
        ");
    }
}