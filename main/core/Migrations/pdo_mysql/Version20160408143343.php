<?php

namespace Claroline\CoreBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2016/04/08 02:33:43
 */
class Version20160408143343 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_plugin 
            ADD is_enabled TINYINT(1) NOT NULL, 
            ADD version VARCHAR(255) NOT NULL, 
            ADD description VARCHAR(255) DEFAULT NULL, 
            ADD origin VARCHAR(255) DEFAULT NULL
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_plugin 
            DROP is_enabled, 
            DROP version, 
            DROP description, 
            DROP origin
        ");
    }
}