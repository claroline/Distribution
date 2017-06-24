<?php

namespace Claroline\CoreBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2017/05/31 08:07:44
 */
class Version20170624000000 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE claro_theme 
            ADD uuid VARCHAR(36) NOT NULL
        ');

        // The new column needs to be filled to be able to add the UNIQUE constraint
        $this->addSql('
            UPDATE claro_theme SET uuid = (SELECT UUID())
        ');

        $this->addSql('
            CREATE UNIQUE INDEX UNIQ_384DF525D17F50A5 ON claro_theme (uuid)
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            DROP INDEX UNIQ_384DF525D17F50A5 ON claro_theme
        ');

        $this->addSql('
            ALTER TABLE claro_theme 
            DROP uuid
        ');
    }
}
