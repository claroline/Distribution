<?php

namespace Inwicast\ClarolinePluginBundle\Migrations\pdo_sqlsrv;

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
                id INT IDENTITY NOT NULL, 
                url NVARCHAR(255) NOT NULL, 
                driver NVARCHAR(255) NOT NULL, 
                host NVARCHAR(255) NOT NULL, 
                port NVARCHAR(255) NOT NULL, 
                dbname NVARCHAR(255) NOT NULL, 
                [user] NVARCHAR(255) NOT NULL, 
                password NVARCHAR(255) NOT NULL, 
                PRIMARY KEY (id)
            )
        ");
        $this->addSql("
            CREATE TABLE inwicast_plugin_media (
                id INT IDENTITY NOT NULL, 
                widgetinstance_id INT, 
                mediaRef NVARCHAR(255) NOT NULL, 
                preview_url NVARCHAR(255), 
                width INT NOT NULL, 
                height INT NOT NULL, 
                PRIMARY KEY (id)
            )
        ");
        $this->addSql("
            CREATE UNIQUE INDEX UNIQ_ED925F022DE7D582 ON inwicast_plugin_media (widgetinstance_id) 
            WHERE widgetinstance_id IS NOT NULL
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