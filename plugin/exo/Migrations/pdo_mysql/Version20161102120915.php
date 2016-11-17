<?php

namespace UJM\ExoBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2016/11/02 12:09:41
 */
class Version20161102120915 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_category 
            ADD uuid VARCHAR(36) NOT NULL
        ");

        // The new column needs to be filled to be able to add the UNIQUE constraint
        $this->addSql("
            UPDATE ujm_category SET uuid = (SELECT UUID())
        ");

        $this->addSql("
            CREATE UNIQUE INDEX UNIQ_9FDB39F8D17F50A6 ON ujm_category (uuid)
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            DROP INDEX UNIQ_9FDB39F8D17F50A6 ON ujm_category
        ");
        $this->addSql("
            ALTER TABLE ujm_category 
            DROP uuid
        ");
    }
}
