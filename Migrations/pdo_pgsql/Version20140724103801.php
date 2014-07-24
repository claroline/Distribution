<?php

namespace Inwicast\ClarolinePluginBundle\Migrations\pdo_pgsql;

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
                id SERIAL NOT NULL, 
                code VARCHAR(255) NOT NULL, 
                title VARCHAR(255) NOT NULL, 
                description TEXT NOT NULL, 
                date DATE NOT NULL, 
                image VARCHAR(255) NOT NULL, 
                width INT NOT NULL, 
                height INT NOT NULL, 
                widgetInstance_id INT DEFAULT NULL, 
                resourceNode_id INT DEFAULT NULL, 
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
                id SERIAL NOT NULL, 
                url VARCHAR(255) NOT NULL, 
                resourceNode_id INT DEFAULT NULL, 
                PRIMARY KEY(id)
            )
        ");
        $this->addSql("
            CREATE UNIQUE INDEX UNIQ_10878E9B87FAB32 ON inwicast_plugin_mediacenter (resourceNode_id)
        ");
        $this->addSql("
            CREATE TABLE inwicast_plugin_mediauser (
                id SERIAL NOT NULL, 
                user_id INT DEFAULT NULL, 
                username VARCHAR(255) NOT NULL, 
                resourceNode_id INT DEFAULT NULL, 
                PRIMARY KEY(id)
            )
        ");
        $this->addSql("
            CREATE UNIQUE INDEX UNIQ_DDB60112A76ED395 ON inwicast_plugin_mediauser (user_id)
        ");
        $this->addSql("
            CREATE UNIQUE INDEX UNIQ_DDB60112B87FAB32 ON inwicast_plugin_mediauser (resourceNode_id)
        ");
        $this->addSql("
            ALTER TABLE inwicast_plugin_media 
            ADD CONSTRAINT FK_ED925F02AB7B5A55 FOREIGN KEY (widgetInstance_id) 
            REFERENCES claro_widget_instance (id) 
            ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE
        ");
        $this->addSql("
            ALTER TABLE inwicast_plugin_media 
            ADD CONSTRAINT FK_ED925F02B87FAB32 FOREIGN KEY (resourceNode_id) 
            REFERENCES claro_resource_node (id) 
            ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE
        ");
        $this->addSql("
            ALTER TABLE inwicast_plugin_mediacenter 
            ADD CONSTRAINT FK_10878E9B87FAB32 FOREIGN KEY (resourceNode_id) 
            REFERENCES claro_resource_node (id) 
            ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE
        ");
        $this->addSql("
            ALTER TABLE inwicast_plugin_mediauser 
            ADD CONSTRAINT FK_DDB60112A76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        ");
        $this->addSql("
            ALTER TABLE inwicast_plugin_mediauser 
            ADD CONSTRAINT FK_DDB60112B87FAB32 FOREIGN KEY (resourceNode_id) 
            REFERENCES claro_resource_node (id) 
            ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE
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