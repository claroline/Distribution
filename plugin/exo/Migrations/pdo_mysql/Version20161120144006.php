<?php

namespace UJM\ExoBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2016/11/20 02:40:28
 */
class Version20161120144006 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_step CHANGE title title VARCHAR(255) DEFAULT NULL, 
            CHANGE value description LONGTEXT DEFAULT NULL, 
            CHANGE ordre `order` INT NOT NULL
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_step CHANGE title title VARCHAR(255) NOT NULL COLLATE utf8_unicode_ci, 
            CHANGE description value TEXT DEFAULT NULL COLLATE utf8_unicode_ci, 
            CHANGE `order` ordre INT NOT NULL
        ");
    }
}
