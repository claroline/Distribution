<?php

namespace UJM\ExoBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2018/09/14 05:49:00
 */
class Version20180914174858 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_hint 
            DROP FOREIGN KEY FK_B5FFCBE71E27F6BF
        ");
        $this->addSql("
            ALTER TABLE ujm_hint 
            ADD CONSTRAINT FK_B5FFCBE71E27F6BF FOREIGN KEY (question_id) 
            REFERENCES ujm_question (id) 
            ON DELETE CASCADE
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_hint 
            DROP FOREIGN KEY FK_B5FFCBE71E27F6BF
        ");
        $this->addSql("
            ALTER TABLE ujm_hint 
            ADD CONSTRAINT FK_B5FFCBE71E27F6BF FOREIGN KEY (question_id) 
            REFERENCES ujm_question (id)
        ");
    }
}