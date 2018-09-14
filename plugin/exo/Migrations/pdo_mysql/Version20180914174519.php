<?php

namespace UJM\ExoBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2018/09/14 05:45:21
 */
class Version20180914174519 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_question 
            DROP FOREIGN KEY FK_2F60697712469DE2
        ");
        $this->addSql("
            ALTER TABLE ujm_question 
            ADD CONSTRAINT FK_2F60697712469DE2 FOREIGN KEY (category_id) 
            REFERENCES ujm_category (id) 
            ON DELETE CASCADE
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_question 
            DROP FOREIGN KEY FK_2F60697712469DE2
        ");
        $this->addSql("
            ALTER TABLE ujm_question 
            ADD CONSTRAINT FK_2F60697712469DE2 FOREIGN KEY (category_id) 
            REFERENCES ujm_category (id)
        ");
    }
}