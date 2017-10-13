<?php

namespace Claroline\DropZoneBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2017/10/11 11:32:47
 */
class Version20171011113246 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE claro_dropzonebundle_dropzone (
                id INT AUTO_INCREMENT NOT NULL, 
                uuid VARCHAR(36) NOT NULL, 
                resourceNode_id INT DEFAULT NULL, 
                UNIQUE INDEX UNIQ_FB84B2AFD17F50A6 (uuid), 
                UNIQUE INDEX UNIQ_FB84B2AFB87FAB32 (resourceNode_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql("
            ALTER TABLE claro_dropzonebundle_dropzone 
            ADD CONSTRAINT FK_FB84B2AFB87FAB32 FOREIGN KEY (resourceNode_id) 
            REFERENCES claro_resource_node (id) 
            ON DELETE CASCADE
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            DROP TABLE claro_dropzonebundle_dropzone
        ");
    }
}