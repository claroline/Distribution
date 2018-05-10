<?php

namespace Claroline\CoreBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2018/05/10 09:27:20
 */
class Version20180510092718 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_menu_action 
            CHANGE value mask INT NOT NULL,
            ADD bulk TINYINT(1) NOT NULL,
            DROP async, 
            DROP is_custom, 
            DROP is_form, 
            DROP icon
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_menu_action 
            DROP bulk,
            ADD async TINYINT(1) DEFAULT NULL, 
            ADD is_custom TINYINT(1) NOT NULL, 
            ADD is_form TINYINT(1) NOT NULL, 
            CHANGE mask value VARCHAR(255) DEFAULT NULL COLLATE utf8_unicode_ci, 
            ADD icon VARCHAR(255) DEFAULT NULL COLLATE utf8_unicode_ci
        ");
    }
}