<?php

namespace Claroline\CoreBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2018/10/03 09:28:52
 */
class Version20181003092851 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE claro_admin_tools 
            ADD uuid VARCHAR(36) NOT NULL
        ');
        $this->addSql('
            UPDATE claro_admin_tools
            SET uuid = (SELECT UUID())
        ');
        $this->addSql('
            CREATE UNIQUE INDEX UNIQ_C10C14ECD17F50A6 ON claro_admin_tools (uuid)
        ');
        $this->addSql('
            ALTER TABLE claro_ordered_tool 
            ADD uuid VARCHAR(36) NOT NULL
        ');
        $this->addSql('
            UPDATE claro_ordered_tool
            SET uuid = (SELECT UUID())
        ');
        $this->addSql('
            CREATE UNIQUE INDEX UNIQ_6CF1320ED17F50A6 ON claro_ordered_tool (uuid)
        ');
        $this->addSql('
            ALTER TABLE claro_tools 
            ADD uuid VARCHAR(36) NOT NULL
        ');
        $this->addSql('
            UPDATE claro_tools
            SET uuid = (SELECT UUID())
        ');
        $this->addSql('
            CREATE UNIQUE INDEX UNIQ_60F90965D17F50A6 ON claro_tools (uuid)
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            DROP INDEX UNIQ_C10C14ECD17F50A6 ON claro_admin_tools
        ');
        $this->addSql('
            ALTER TABLE claro_admin_tools 
            DROP uuid
        ');
        $this->addSql('
            DROP INDEX UNIQ_6CF1320ED17F50A6 ON claro_ordered_tool
        ');
        $this->addSql('
            ALTER TABLE claro_ordered_tool 
            DROP uuid
        ');
        $this->addSql('
            DROP INDEX UNIQ_60F90965D17F50A6 ON claro_tools
        ');
        $this->addSql('
            ALTER TABLE claro_tools 
            DROP uuid
        ');
    }
}
