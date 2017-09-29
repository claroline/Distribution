<?php

namespace Claroline\CoreBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2017/09/29 05:56:43
 */
class Version20170929175642 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE claro_group
            ADD uuid VARCHAR(36) NOT NULL,
            DROP guid
        ');
        $this->addSql('
            UPDATE claro_group
            SET uuid = (SELECT UUID())
         ');
        $this->addSql('
            CREATE UNIQUE INDEX UNIQ_E7C393D7D17F50A6 ON claro_group (uuid)
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            DROP INDEX UNIQ_E7C393D7D17F50A6 ON claro_group
        ');
        $this->addSql('
            ALTER TABLE claro_group
            ADD guid VARCHAR(255) NOT NULL COLLATE utf8_unicode_ci,
            DROP uuid
        ');
    }
}
