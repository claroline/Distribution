<?php

namespace UJM\ExoBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2016/11/18 10:06:28
 */
class Version20161118100602 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_exercise 
            DROP doprint, 
            DROP lock_attempt
        ");
        $this->addSql("
            ALTER TABLE ujm_paper 
            DROP archive, 
            DROP date_archive
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_exercise 
            ADD doprint TINYINT(1) DEFAULT NULL, 
            ADD lock_attempt TINYINT(1) DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE ujm_paper 
            ADD archive TINYINT(1) DEFAULT NULL, 
            ADD date_archive DATE DEFAULT NULL
        ");
    }
}