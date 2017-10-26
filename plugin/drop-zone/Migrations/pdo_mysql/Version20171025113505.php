<?php

namespace Claroline\DropZoneBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2017/10/25 11:35:06
 */
class Version20171025113505 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE claro_dropzonebundle_criterion (
                id INT AUTO_INCREMENT NOT NULL, 
                dropzone_id INT NOT NULL, 
                instruction LONGTEXT NOT NULL, 
                uuid VARCHAR(36) NOT NULL, 
                UNIQUE INDEX UNIQ_1DD9F2E2D17F50A6 (uuid), 
                INDEX IDX_1DD9F2E254FC3EC3 (dropzone_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql("
            ALTER TABLE claro_dropzonebundle_criterion 
            ADD CONSTRAINT FK_1DD9F2E254FC3EC3 FOREIGN KEY (dropzone_id) 
            REFERENCES claro_dropzonebundle_dropzone (id) 
            ON DELETE CASCADE
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            DROP TABLE claro_dropzonebundle_criterion
        ");
    }
}