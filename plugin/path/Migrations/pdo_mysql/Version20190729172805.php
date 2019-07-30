<?php

namespace Innova\PathBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2019/07/29 05:28:06
 */
class Version20190729172805 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE innova_path 
            ADD score_total DOUBLE PRECISION DEFAULT '100' NOT NULL, 
            ADD success_score DOUBLE PRECISION DEFAULT NULL, 
            ADD show_score TINYINT(1) NOT NULL
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE innova_path 
            DROP score_total, 
            DROP success_score, 
            DROP show_score
        ');
    }
}
