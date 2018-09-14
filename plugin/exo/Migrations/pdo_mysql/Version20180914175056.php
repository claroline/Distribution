<?php

namespace UJM\ExoBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2018/09/14 05:50:58
 */
class Version20180914175056 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_word_response 
            DROP FOREIGN KEY FK_4E1930C598DDBDFD
        ");
        $this->addSql("
            ALTER TABLE ujm_word_response 
            ADD CONSTRAINT FK_4E1930C598DDBDFD FOREIGN KEY (interaction_open_id) 
            REFERENCES ujm_interaction_open (id) 
            ON DELETE CASCADE
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_word_response 
            DROP FOREIGN KEY FK_4E1930C598DDBDFD
        ");
        $this->addSql("
            ALTER TABLE ujm_word_response 
            ADD CONSTRAINT FK_4E1930C598DDBDFD FOREIGN KEY (interaction_open_id) 
            REFERENCES ujm_interaction_open (id)
        ");
    }
}