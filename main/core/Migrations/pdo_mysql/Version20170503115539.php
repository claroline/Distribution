<?php

namespace Claroline\CoreBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2017/05/03 11:55:40
 */
class Version20170503115539 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE claro_menu_action
            ADD `group_name` VARCHAR(255) DEFAULT NULL,
            ADD class VARCHAR(255) DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE claro_theme CHANGE extending_default extending_default TINYINT(1) NOT NULL
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE claro_menu_action
            DROP `group_name`, 
            DROP class
        ');
        $this->addSql("
            ALTER TABLE claro_theme CHANGE extending_default extending_default TINYINT(1) DEFAULT '0' NOT NULL
        ");
    }
}
