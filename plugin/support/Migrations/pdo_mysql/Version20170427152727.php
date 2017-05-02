<?php

namespace FormaLibre\SupportBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2017/04/27 03:27:28
 */
class Version20170427152727 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE formalibre_support_ticket 
            ADD linked_ticket_id INT DEFAULT NULL, 
            ADD forwarded TINYINT(1) DEFAULT '0' NOT NULL, 
            CHANGE num num INT DEFAULT NULL
        ");
        $this->addSql('
            ALTER TABLE formalibre_support_ticket 
            ADD CONSTRAINT FK_59A907AE660288D9 FOREIGN KEY (linked_ticket_id) 
            REFERENCES formalibre_support_ticket (id) 
            ON DELETE SET NULL
        ');
        $this->addSql('
            CREATE UNIQUE INDEX UNIQ_59A907AE660288D9 ON formalibre_support_ticket (linked_ticket_id)
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE formalibre_support_ticket 
            DROP FOREIGN KEY FK_59A907AE660288D9
        ');
        $this->addSql('
            DROP INDEX UNIQ_59A907AE660288D9 ON formalibre_support_ticket
        ');
        $this->addSql('
            ALTER TABLE formalibre_support_ticket 
            DROP linked_ticket_id, 
            DROP forwarded, 
            CHANGE num num INT NOT NULL
        ');
    }
}
