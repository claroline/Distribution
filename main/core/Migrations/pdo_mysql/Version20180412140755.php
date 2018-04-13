<?php

namespace Claroline\CoreBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2018/04/12 02:07:56
 */
class Version20180412140755 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_field_facet 
            ADD hidden TINYINT(1) DEFAULT '0' NOT NULL, 
            ADD is_metadata TINYINT(1) DEFAULT '0' NOT NULL, 
            ADD locked TINYINT(1) DEFAULT '0' NOT NULL, 
            ADD locked_edition TINYINT(1) DEFAULT '0' NOT NULL, 
            ADD help VARCHAR(255) DEFAULT NULL
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE claro_field_facet 
            DROP hidden, 
            DROP is_metadata, 
            DROP locked, 
            DROP locked_edition, 
            DROP help
        ');
    }
}
