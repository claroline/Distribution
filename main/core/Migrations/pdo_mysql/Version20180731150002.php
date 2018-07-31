<?php

namespace Claroline\CoreBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2018/07/31 03:00:03
 */
class Version20180731150002 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE claro_widget_container_config (
                id INT AUTO_INCREMENT NOT NULL, 
                widget_name VARCHAR(255) DEFAULT NULL, 
                layout LONGTEXT DEFAULT NULL COMMENT '(DC2Type:json_array)', 
                color VARCHAR(255) DEFAULT NULL, 
                backgroundType VARCHAR(255) NOT NULL, 
                background VARCHAR(255) DEFAULT NULL, 
                uuid VARCHAR(36) NOT NULL, 
                UNIQUE INDEX UNIQ_9523B282D17F50A6 (uuid), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET UTF8 COLLATE UTF8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql("
            ALTER TABLE claro_home_tab 
            DROP name, 
            DROP icon, 
            DROP longTitle, 
            DROP centerTitle
        ");
        $this->addSql("
            ALTER TABLE claro_home_tab_config 
            DROP FOREIGN KEY FK_F530F6BE82D40A1F
        ");
        $this->addSql("
            ALTER TABLE claro_home_tab_config 
            DROP FOREIGN KEY FK_F530F6BEA76ED395
        ");
        $this->addSql("
            DROP INDEX home_tab_config_unique_home_tab_user_workspace_type ON claro_home_tab_config
        ");
        $this->addSql("
            DROP INDEX IDX_F530F6BEA76ED395 ON claro_home_tab_config
        ");
        $this->addSql("
            DROP INDEX IDX_F530F6BE82D40A1F ON claro_home_tab_config
        ");
        $this->addSql("
            ALTER TABLE claro_home_tab_config 
            ADD name VARCHAR(255) DEFAULT NULL, 
            ADD longTitle LONGTEXT NOT NULL, 
            ADD centerTitle TINYINT(1) NOT NULL, 
            ADD icon VARCHAR(255) DEFAULT NULL, 
            DROP user_id, 
            DROP workspace_id
        ");
        $this->addSql("
            ALTER TABLE claro_home_tab_roles 
            DROP FOREIGN KEY FK_B81359F3CCE862F
        ");
        $this->addSql("
            DROP INDEX IDX_B81359F3CCE862F ON claro_home_tab_roles
        ");
        $this->addSql("
            ALTER TABLE claro_home_tab_roles 
            DROP PRIMARY KEY
        ");
        $this->addSql("
            ALTER TABLE claro_home_tab_roles CHANGE hometab_id hometabconfig_id INT NOT NULL
        ");
        $this->addSql("
            ALTER TABLE claro_home_tab_roles 
            ADD CONSTRAINT FK_B81359F339727CCF FOREIGN KEY (hometabconfig_id) 
            REFERENCES claro_home_tab_config (id) 
            ON DELETE CASCADE
        ");
        $this->addSql("
            CREATE INDEX IDX_B81359F339727CCF ON claro_home_tab_roles (hometabconfig_id)
        ");
        $this->addSql("
            ALTER TABLE claro_home_tab_roles 
            ADD PRIMARY KEY (hometabconfig_id, role_id)
        ");
        $this->addSql("
            ALTER TABLE claro_widget_container 
            DROP widget_name, 
            DROP color, 
            DROP backgroundType, 
            DROP background, 
            DROP layout, 
            CHANGE position homeTab_id INT DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE claro_widget_container 
            ADD CONSTRAINT FK_3B06DD75B628319 FOREIGN KEY (homeTab_id) 
            REFERENCES claro_home_tab (id)
        ");
        $this->addSql("
            CREATE INDEX IDX_3B06DD75B628319 ON claro_widget_container (homeTab_id)
        ");
        $this->addSql("
            ALTER TABLE claro_widget_home_tab_config 
            DROP FOREIGN KEY FK_D48CC23E7D08FA9E
        ");
        $this->addSql("
            DROP INDEX IDX_D48CC23E7D08FA9E ON claro_widget_home_tab_config
        ");
        $this->addSql("
            ALTER TABLE claro_widget_home_tab_config 
            DROP home_tab_id
        ");
        $this->addSql("
            ALTER TABLE claro_widget_instance 
            DROP widget_name, 
            DROP widget_position
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            DROP TABLE claro_widget_container_config
        ");
        $this->addSql("
            ALTER TABLE claro_home_tab 
            ADD name VARCHAR(255) DEFAULT NULL COLLATE utf8_unicode_ci, 
            ADD icon VARCHAR(255) DEFAULT NULL COLLATE utf8_unicode_ci, 
            ADD longTitle LONGTEXT NOT NULL COLLATE utf8_unicode_ci, 
            ADD centerTitle TINYINT(1) NOT NULL
        ");
        $this->addSql("
            ALTER TABLE claro_home_tab_config 
            ADD user_id INT DEFAULT NULL, 
            ADD workspace_id INT DEFAULT NULL, 
            DROP name, 
            DROP longTitle, 
            DROP centerTitle, 
            DROP icon
        ");
        $this->addSql("
            ALTER TABLE claro_home_tab_config 
            ADD CONSTRAINT FK_F530F6BE82D40A1F FOREIGN KEY (workspace_id) 
            REFERENCES claro_workspace (id) 
            ON DELETE CASCADE
        ");
        $this->addSql("
            ALTER TABLE claro_home_tab_config 
            ADD CONSTRAINT FK_F530F6BEA76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id) 
            ON DELETE CASCADE
        ");
        $this->addSql("
            CREATE UNIQUE INDEX home_tab_config_unique_home_tab_user_workspace_type ON claro_home_tab_config (
                home_tab_id, user_id, workspace_id, 
                type
            )
        ");
        $this->addSql("
            CREATE INDEX IDX_F530F6BEA76ED395 ON claro_home_tab_config (user_id)
        ");
        $this->addSql("
            CREATE INDEX IDX_F530F6BE82D40A1F ON claro_home_tab_config (workspace_id)
        ");
        $this->addSql("
            ALTER TABLE claro_home_tab_roles 
            DROP FOREIGN KEY FK_B81359F339727CCF
        ");
        $this->addSql("
            DROP INDEX IDX_B81359F339727CCF ON claro_home_tab_roles
        ");
        $this->addSql("
            ALTER TABLE claro_home_tab_roles 
            DROP PRIMARY KEY
        ");
        $this->addSql("
            ALTER TABLE claro_home_tab_roles CHANGE hometabconfig_id hometab_id INT NOT NULL
        ");
        $this->addSql("
            ALTER TABLE claro_home_tab_roles 
            ADD CONSTRAINT FK_B81359F3CCE862F FOREIGN KEY (hometab_id) 
            REFERENCES claro_home_tab (id) 
            ON DELETE CASCADE
        ");
        $this->addSql("
            CREATE INDEX IDX_B81359F3CCE862F ON claro_home_tab_roles (hometab_id)
        ");
        $this->addSql("
            ALTER TABLE claro_home_tab_roles 
            ADD PRIMARY KEY (hometab_id, role_id)
        ");
        $this->addSql("
            ALTER TABLE claro_widget_container 
            DROP FOREIGN KEY FK_3B06DD75B628319
        ");
        $this->addSql("
            DROP INDEX IDX_3B06DD75B628319 ON claro_widget_container
        ");
        $this->addSql("
            ALTER TABLE claro_widget_container 
            ADD widget_name VARCHAR(255) DEFAULT NULL COLLATE utf8_unicode_ci, 
            ADD color VARCHAR(255) DEFAULT NULL COLLATE utf8_unicode_ci, 
            ADD backgroundType VARCHAR(255) NOT NULL COLLATE utf8_unicode_ci, 
            ADD background VARCHAR(255) DEFAULT NULL COLLATE utf8_unicode_ci, 
            ADD layout LONGTEXT DEFAULT NULL COLLATE utf8_unicode_ci COMMENT '(DC2Type:json_array)', 
            CHANGE hometab_id position INT DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE claro_widget_home_tab_config 
            ADD home_tab_id INT NOT NULL
        ");
        $this->addSql("
            ALTER TABLE claro_widget_home_tab_config 
            ADD CONSTRAINT FK_D48CC23E7D08FA9E FOREIGN KEY (home_tab_id) 
            REFERENCES claro_home_tab (id) 
            ON DELETE CASCADE
        ");
        $this->addSql("
            CREATE INDEX IDX_D48CC23E7D08FA9E ON claro_widget_home_tab_config (home_tab_id)
        ");
        $this->addSql("
            ALTER TABLE claro_widget_instance 
            ADD widget_name VARCHAR(255) DEFAULT NULL COLLATE utf8_unicode_ci, 
            ADD widget_position INT NOT NULL
        ");
    }
}