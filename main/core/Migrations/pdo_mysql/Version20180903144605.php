<?php

namespace Claroline\CoreBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2018/09/03 02:46:06
 */
class Version20180903144605 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE claro_workspace
            DROP FOREIGN KEY FK_D9028545FDFF2E92
        ');
        $this->addSql('
            DROP INDEX IDX_D9028545FDFF2E92 ON claro_workspace
        ');
        $this->addSql('
            ALTER TABLE claro_workspace
            ADD thumbnail VARCHAR(255) DEFAULT NULL,
            DROP thumbnail_id
        ');
        $this->addSql('
            ALTER TABLE claro_resource_node
            DROP FOREIGN KEY FK_A76799FFFDFF2E92
        ');
        $this->addSql('
            DROP INDEX UNIQ_A76799FFFDFF2E92 ON claro_resource_node
        ');
        $this->addSql('
            ALTER TABLE claro_resource_node
            ADD thumbnail VARCHAR(255) DEFAULT NULL,
            DROP thumbnail_id
        ');
        $this->addSql('
            ALTER TABLE claro_resource_node
            DROP FOREIGN KEY FK_A76799FF54B9D732
        ');
        $this->addSql('
            DROP INDEX IDX_A76799FF54B9D732 ON claro_resource_node
        ');
        $this->addSql('
            ALTER TABLE claro_resource_node
            DROP icon_id
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE claro_resource_node
            ADD thumbnail_id INT DEFAULT NULL,
            DROP thumbnail
        ');
        $this->addSql('
            ALTER TABLE claro_resource_node
            ADD CONSTRAINT FK_A76799FFFDFF2E92 FOREIGN KEY (thumbnail_id)
            REFERENCES claro_resource_thumbnail (id)
            ON DELETE SET NULL
        ');
        $this->addSql('
            CREATE UNIQUE INDEX UNIQ_A76799FFFDFF2E92 ON claro_resource_node (thumbnail_id)
        ');
        $this->addSql('
            ALTER TABLE claro_workspace
            ADD thumbnail_id INT DEFAULT NULL,
            DROP thumbnail
        ');
        $this->addSql('
            ALTER TABLE claro_workspace
            ADD CONSTRAINT FK_D9028545FDFF2E92 FOREIGN KEY (thumbnail_id)
            REFERENCES claro_public_file (id)
            ON DELETE SET NULL
        ');
        $this->addSql('
            CREATE INDEX IDX_D9028545FDFF2E92 ON claro_workspace (thumbnail_id)
        ');
        $this->addSql('
            ALTER TABLE claro_resource_node
            ADD icon_id INT DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE claro_resource_node
            ADD CONSTRAINT FK_A76799FF54B9D732 FOREIGN KEY (icon_id)
            REFERENCES claro_resource_icon (id)
            ON DELETE SET NULL
        ');
        $this->addSql('
            CREATE INDEX IDX_A76799FF54B9D732 ON claro_resource_node (icon_id)
        ');
    }
}
