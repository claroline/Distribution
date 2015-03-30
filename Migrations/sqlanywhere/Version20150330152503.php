<?php

namespace Inwicast\ClarolinePluginBundle\Migrations\sqlanywhere;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2015/03/30 03:25:06
 */
class Version20150330152503 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE inwicast_plugin_mediacenter (
                id INT IDENTITY NOT NULL, 
                url VARCHAR(255) NOT NULL, 
                driver VARCHAR(255) NOT NULL, 
                host VARCHAR(255) NOT NULL, 
                port VARCHAR(255) NOT NULL, 
                dbname VARCHAR(255) NOT NULL, 
                \"user\" VARCHAR(255) NOT NULL, 
                password VARCHAR(255) NOT NULL, 
                PRIMARY KEY (id)
            )
        ");
        $this->addSql("
            CREATE TABLE inwicast_plugin_media (
                id INT IDENTITY NOT NULL, 
                widgetinstance_id INT DEFAULT NULL, 
                mediaRef VARCHAR(255) NOT NULL, 
                preview_url VARCHAR(255) DEFAULT NULL, 
                width INT NOT NULL, 
                height INT NOT NULL, 
                PRIMARY KEY (id)
            )
        ");
        $this->addSql("
            CREATE UNIQUE INDEX UNIQ_ED925F022DE7D582 ON inwicast_plugin_media (widgetinstance_id)
        ");
        $this->addSql("
            ALTER TABLE inwicast_plugin_media 
            ADD CONSTRAINT FK_ED925F022DE7D582 FOREIGN KEY (widgetinstance_id) 
            REFERENCES claro_widget_instance (id) 
            ON DELETE CASCADE
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            DROP TABLE inwicast_plugin_mediacenter
        ");
        $this->addSql("
            DROP TABLE inwicast_plugin_media
        ");
    }
}