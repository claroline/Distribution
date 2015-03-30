<?php

namespace Inwicast\ClarolinePluginBundle\Migrations\pdo_sqlite;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2015/03/30 03:25:05
 */
class Version20150330152503 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE inwicast_plugin_mediacenter (
                id INTEGER NOT NULL, 
                url VARCHAR(255) NOT NULL, 
                driver VARCHAR(255) NOT NULL, 
                host VARCHAR(255) NOT NULL, 
                port VARCHAR(255) NOT NULL, 
                dbname VARCHAR(255) NOT NULL, 
                user VARCHAR(255) NOT NULL, 
                password VARCHAR(255) NOT NULL, 
                PRIMARY KEY(id)
            )
        ");
        $this->addSql("
            CREATE TABLE inwicast_plugin_media (
                id INTEGER NOT NULL, 
                widgetinstance_id INTEGER DEFAULT NULL, 
                mediaRef VARCHAR(255) NOT NULL, 
                preview_url VARCHAR(255) DEFAULT NULL, 
                width INTEGER NOT NULL, 
                height INTEGER NOT NULL, 
                PRIMARY KEY(id)
            )
        ");
        $this->addSql("
            CREATE UNIQUE INDEX UNIQ_ED925F022DE7D582 ON inwicast_plugin_media (widgetinstance_id)
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