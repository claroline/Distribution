<?php

namespace UJM\ExoBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2016/11/20 04:02:25
 */
class Version20161120160203 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_picture CHANGE `label` title VARCHAR(255) NOT NULL
        ");
        $this->addSql("
            ALTER TABLE ujm_choice CHANGE data data LONGTEXT DEFAULT NULL, 
            CHANGE `order` entity_order INT NOT NULL
        ");
        $this->addSql("
            ALTER TABLE ujm_label CHANGE data data LONGTEXT DEFAULT NULL, 
            CHANGE `order` entity_order INT NOT NULL
        ");
        $this->addSql("
            ALTER TABLE ujm_proposal CHANGE data data LONGTEXT DEFAULT NULL, 
            CHANGE `order` entity_order INT NOT NULL
        ");
        $this->addSql("
            ALTER TABLE ujm_step CHANGE `order` entity_order INT NOT NULL
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_choice CHANGE data data LONGTEXT NOT NULL COLLATE utf8_unicode_ci, 
            CHANGE entity_order `order` INT NOT NULL
        ");
        $this->addSql("
            ALTER TABLE ujm_label CHANGE data data LONGTEXT NOT NULL COLLATE utf8_unicode_ci, 
            CHANGE entity_order `order` INT NOT NULL
        ");
        $this->addSql("
            ALTER TABLE ujm_picture CHANGE title `label` VARCHAR(255) NOT NULL COLLATE utf8_unicode_ci
        ");
        $this->addSql("
            ALTER TABLE ujm_proposal CHANGE data data LONGTEXT NOT NULL COLLATE utf8_unicode_ci, 
            CHANGE entity_order `order` INT NOT NULL
        ");
        $this->addSql("
            ALTER TABLE ujm_step CHANGE entity_order `order` INT NOT NULL
        ");
    }
}
