<?php

namespace Claroline\CoreBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2018/08/01 03:21:27
 */
class Version20180801152126 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_widget_container_config 
            ADD widget_container_id INT DEFAULT NULL, 
            ADD position INT DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE claro_widget_container_config 
            ADD CONSTRAINT FK_9523B282581122C3 FOREIGN KEY (widget_container_id) 
            REFERENCES claro_widget_container (id) 
            ON DELETE CASCADE
        ");
        $this->addSql("
            CREATE INDEX IDX_9523B282581122C3 ON claro_widget_container_config (widget_container_id)
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_widget_container_config 
            DROP FOREIGN KEY FK_9523B282581122C3
        ");
        $this->addSql("
            DROP INDEX IDX_9523B282581122C3 ON claro_widget_container_config
        ");
        $this->addSql("
            ALTER TABLE claro_widget_container_config 
            DROP widget_container_id, 
            DROP position
        ");
    }
}