<?php

namespace UJM\ExoBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2016/11/18 07:18:31
 */
class Version20161118191810 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE ujm_answer_hints (
                answer_id INT NOT NULL, 
                hint_id INT NOT NULL, 
                INDEX IDX_70DF26E3AA334807 (answer_id), 
                UNIQUE INDEX UNIQ_70DF26E3519161AB (hint_id), 
                PRIMARY KEY(answer_id, hint_id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql("
            ALTER TABLE ujm_answer_hints 
            ADD CONSTRAINT FK_70DF26E3AA334807 FOREIGN KEY (answer_id) 
            REFERENCES ujm_response (id)
        ");
        $this->addSql("
            ALTER TABLE ujm_answer_hints 
            ADD CONSTRAINT FK_70DF26E3519161AB FOREIGN KEY (hint_id) 
            REFERENCES ujm_hint (id)
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            DROP TABLE ujm_answer_hints
        ");
    }
}
