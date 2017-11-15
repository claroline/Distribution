<?php

namespace Claroline\DropZoneBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2017/11/15 04:28:09
 */
class Version20171115162808 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE claro_dropzonebundle_tool_document (
                id INT AUTO_INCREMENT NOT NULL, 
                document_id INT NOT NULL, 
                tool_id INT NOT NULL, 
                tool_data LONGTEXT DEFAULT NULL COMMENT '(DC2Type:json_array)', 
                uuid VARCHAR(36) NOT NULL, 
                UNIQUE INDEX UNIQ_762E507AD17F50A6 (uuid), 
                INDEX IDX_762E507AC33F7837 (document_id), 
                INDEX IDX_762E507A8F7B22CC (tool_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql('
            ALTER TABLE claro_dropzonebundle_tool_document 
            ADD CONSTRAINT FK_762E507AC33F7837 FOREIGN KEY (document_id) 
            REFERENCES claro_dropzonebundle_document (id) 
            ON DELETE CASCADE
        ');
        $this->addSql('
            ALTER TABLE claro_dropzonebundle_tool_document 
            ADD CONSTRAINT FK_762E507A8F7B22CC FOREIGN KEY (tool_id) 
            REFERENCES claro_dropzonebundle_tool (id) 
            ON DELETE CASCADE
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            DROP TABLE claro_dropzonebundle_tool_document
        ');
    }
}
