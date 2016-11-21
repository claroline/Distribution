<?php

namespace UJM\ExoBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2016/11/20 10:58:07
 */
class Version20161120105745 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_choice 
            CHANGE `label` data LONGTEXT NOT NULL
        ");
        $this->addSql("
            ALTER TABLE ujm_label CHANGE value data LONGTEXT NOT NULL
        ");
        $this->addSql("
            ALTER TABLE ujm_proposal CHANGE value data LONGTEXT NOT NULL
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_choice 
            CHANGE data `label` LONGTEXT DEFAULT NULL COLLATE utf8_unicode_ci
        ");
        $this->addSql("
            ALTER TABLE ujm_label CHANGE data value LONGTEXT NOT NULL COLLATE utf8_unicode_ci
        ");
        $this->addSql("
            ALTER TABLE ujm_proposal CHANGE data value LONGTEXT NOT NULL COLLATE utf8_unicode_ci
        ");
    }
}
