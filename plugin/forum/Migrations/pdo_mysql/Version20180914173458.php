<?php

namespace Claroline\ForumBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2018/09/14 05:35:01
 */
class Version20180914173458 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_forum_user 
            DROP FOREIGN KEY FK_2CFBFDC4A76ED395
        ");
        $this->addSql("
            ALTER TABLE claro_forum_user 
            ADD CONSTRAINT FK_2CFBFDC4A76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id) 
            ON DELETE CASCADE
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_forum_user 
            DROP FOREIGN KEY FK_2CFBFDC4A76ED395
        ");
        $this->addSql("
            ALTER TABLE claro_forum_user 
            ADD CONSTRAINT FK_2CFBFDC4A76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id)
        ");
    }
}