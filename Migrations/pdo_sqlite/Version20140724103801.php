<?php

namespace Inwicast\ClarolinePluginBundle\Migrations\pdo_sqlite;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2014/07/24 10:38:02
 */
class Version20140724103801 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE inwicast_plugin_media (
                id INTEGER NOT NULL, 
                code VARCHAR(255) NOT NULL, 
                title VARCHAR(255) NOT NULL, 
                description CLOB NOT NULL, 
                date DATE NOT NULL, 
                image VARCHAR(255) NOT NULL, 
                width INTEGER NOT NULL, 
                height INTEGER NOT NULL, 
                widgetInstance_id INTEGER DEFAULT NULL, 
                resourceNode_id INTEGER DEFAULT NULL, 
                PRIMARY KEY(id)
            )
        ");
        $this->addSql("
            CREATE INDEX IDX_ED925F02AB7B5A55 ON inwicast_plugin_media (widgetInstance_id)
        ");
        $this->addSql("
            CREATE UNIQUE INDEX UNIQ_ED925F02B87FAB32 ON inwicast_plugin_media (resourceNode_id)
        ");
        $this->addSql("
            CREATE TABLE inwicast_plugin_mediacenter (
                id INTEGER NOT NULL, 
                url VARCHAR(255) NOT NULL, 
                resourceNode_id INTEGER DEFAULT NULL, 
                PRIMARY KEY(id)
            )
        ");
        $this->addSql("
            CREATE UNIQUE INDEX UNIQ_10878E9B87FAB32 ON inwicast_plugin_mediacenter (resourceNode_id)
        ");
        $this->addSql("
            CREATE TABLE inwicast_plugin_mediauser (
                id INTEGER NOT NULL, 
                user_id INTEGER DEFAULT NULL, 
                username VARCHAR(255) NOT NULL, 
                resourceNode_id INTEGER DEFAULT NULL, 
                PRIMARY KEY(id)
            )
        ");
        $this->addSql("
            CREATE UNIQUE INDEX UNIQ_DDB60112A76ED395 ON inwicast_plugin_mediauser (user_id)
        ");
        $this->addSql("
            CREATE UNIQUE INDEX UNIQ_DDB60112B87FAB32 ON inwicast_plugin_mediauser (resourceNode_id)
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            DROP TABLE inwicast_plugin_media
        ");
        $this->addSql("
            DROP TABLE inwicast_plugin_mediacenter
        ");
        $this->addSql("
            DROP TABLE inwicast_plugin_mediauser
        ");
    }
}