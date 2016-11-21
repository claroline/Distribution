<?php

namespace UJM\ExoBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2016/11/20 10:40:20
 */
class Version20161120103958 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            UPDATE ujm_choice SET right_response=0 WHERE right_response IS NULL
        ");
        $this->addSql("
            ALTER TABLE ujm_choice 
            CHANGE right_response expected TINYINT(1) NOT NULL 
        ");
        $this->addSql("
            ALTER TABLE ujm_proposal 
            DROP position_force, 
            CHANGE ordre `order` INT NOT NULL
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_choice 
            CHANGE expected right_response TINYINT(1) DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE ujm_proposal 
            ADD position_force TINYINT(1) DEFAULT NULL, 
            CHANGE `order` ordre INT NOT NULL
        ");
    }
}
