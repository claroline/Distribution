<?php

namespace Claroline\DashboardBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2018/09/14 05:52:39
 */
class Version20180914175237 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_dashboard 
            DROP FOREIGN KEY FK_8027AA461220EA6
        ");
        $this->addSql("
            ALTER TABLE claro_dashboard 
            ADD CONSTRAINT FK_8027AA461220EA6 FOREIGN KEY (creator_id) 
            REFERENCES claro_user (id) 
            ON DELETE CASCADE
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_dashboard 
            DROP FOREIGN KEY FK_8027AA461220EA6
        ");
        $this->addSql("
            ALTER TABLE claro_dashboard 
            ADD CONSTRAINT FK_8027AA461220EA6 FOREIGN KEY (creator_id) 
            REFERENCES claro_user (id)
        ");
    }
}