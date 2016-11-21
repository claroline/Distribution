<?php

namespace UJM\ExoBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2016/11/20 09:52:07
 */
class Version20161120095146 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_interaction_hole 
            DROP `html`
        ");
        $this->addSql("
            ALTER TABLE ujm_coords CHANGE score_coords score DOUBLE PRECISION NOT NULL
        ");
        $this->addSql("UPDATE ujm_choice SET weight=1 WHERE weight IS NULL AND right_response = 1");
        $this->addSql("UPDATE ujm_choice SET weight=-1 WHERE weight IS NULL AND right_response = 0");
        $this->addSql("
            ALTER TABLE ujm_choice 
            CHANGE weight score DOUBLE PRECISION NOT NULL, 
            DROP position_force, 
            CHANGE ordre `order` INT NOT NULL
        ");
        $this->addSql("
            ALTER TABLE ujm_hole 
            DROP position
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_choice 
            CHANGE score weight DOUBLE PRECISION DEFAULT NULL, 
            ADD position_force TINYINT(1) DEFAULT NULL, 
            CHANGE `order` ordre INT NOT NULL
        ");
        $this->addSql("
            ALTER TABLE ujm_coords CHANGE score score_coords DOUBLE PRECISION NOT NULL
        ");
        $this->addSql("
            ALTER TABLE ujm_hole 
            ADD position INT DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE ujm_interaction_hole 
            ADD `html` LONGTEXT NOT NULL COLLATE utf8_unicode_ci
        ");
    }
}
