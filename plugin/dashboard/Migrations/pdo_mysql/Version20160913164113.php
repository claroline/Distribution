<?php

namespace Claroline\DashboardBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2016/09/13 04:41:18
 */
class Version20160913164113 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE claro_dashboard (
                id INT AUTO_INCREMENT NOT NULL, 
                creator_id INT DEFAULT NULL, 
                title VARCHAR(50) NOT NULL, 
                creation_date DATETIME NOT NULL, 
                modification_date DATETIME NOT NULL, 
                INDEX IDX_8027AA461220EA6 (creator_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql("
            CREATE TABLE dashboard_workspaces (
                dashboard_id INT NOT NULL, 
                workspace_id INT NOT NULL, 
                INDEX IDX_5B14A735B9D04D2B (dashboard_id), 
                INDEX IDX_5B14A73582D40A1F (workspace_id), 
                PRIMARY KEY(dashboard_id, workspace_id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql("
            ALTER TABLE claro_dashboard 
            ADD CONSTRAINT FK_8027AA461220EA6 FOREIGN KEY (creator_id) 
            REFERENCES claro_user (id)
        ");
        $this->addSql("
            ALTER TABLE dashboard_workspaces 
            ADD CONSTRAINT FK_5B14A735B9D04D2B FOREIGN KEY (dashboard_id) 
            REFERENCES claro_dashboard (id)
        ");
        $this->addSql("
            ALTER TABLE dashboard_workspaces 
            ADD CONSTRAINT FK_5B14A73582D40A1F FOREIGN KEY (workspace_id) 
            REFERENCES claro_workspace (id)
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE dashboard_workspaces 
            DROP FOREIGN KEY FK_5B14A735B9D04D2B
        ");
        $this->addSql("
            DROP TABLE claro_dashboard
        ");
        $this->addSql("
            DROP TABLE dashboard_workspaces
        ");
    }
}