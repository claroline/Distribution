<?php

namespace UJM\ExoBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2016/11/20 10:26:01
 */
class Version20161120102539 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_label 
            CHANGE score_right_response score DOUBLE PRECISION NOT NULL, 
            DROP position_force, 
            CHANGE ordre `order` INT NOT NULL
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_label 
            CHANGE score score_right_response DOUBLE PRECISION DEFAULT NULL, 
            ADD position_force TINYINT(1) DEFAULT NULL, 
            CHANGE `order` ordre INT NOT NULL
        ");
    }
}
