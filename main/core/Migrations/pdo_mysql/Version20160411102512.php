<?php

namespace Claroline\CoreBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2016/04/11 10:25:14
 */
class Version20160411102512 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_plugin 
            ADD version VARCHAR(255) NOT NULL, 
            ADD description VARCHAR(255) DEFAULT NULL, 
            ADD origin VARCHAR(255) DEFAULT NULL, 
            ADD isEnabled TINYINT(1) NOT NULL
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_plugin 
            DROP version, 
            DROP description, 
            DROP origin, 
            DROP isEnabled
        ");
    }
}