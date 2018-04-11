<?php

namespace Claroline\ForumBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2018/04/11 05:08:45
 */
class Version20180411170844 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_forum_comment 
            ADD isVisible TINYINT(1) NOT NULL
        ");
        $this->addSql("
            ALTER TABLE claro_forum_message 
            ADD isVisible TINYINT(1) NOT NULL
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_forum_comment 
            DROP isVisible
        ");
        $this->addSql("
            ALTER TABLE claro_forum_message 
            DROP isVisible
        ");
    }
}