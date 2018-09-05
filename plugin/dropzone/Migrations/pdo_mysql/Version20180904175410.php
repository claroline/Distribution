<?php

namespace Icap\DropzoneBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2018/09/04 05:54:11
 */
class Version20180904175410 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE icap__dropzonebundle_document
            DROP FOREIGN KEY FK_744084244D224760
        ');
        $this->addSql('
            ALTER TABLE icap__dropzonebundle_document
            ADD CONSTRAINT FK_744084244D224760 FOREIGN KEY (drop_id)
            REFERENCES icap__dropzonebundle_drop (id)
            ON DELETE CASCADE
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE icap__dropzonebundle_document
            DROP FOREIGN KEY FK_744084244D224760
        ');
        $this->addSql('
            ALTER TABLE icap__dropzonebundle_document
            ADD CONSTRAINT FK_744084244D224760 FOREIGN KEY (drop_id)
            REFERENCES icap__dropzonebundle_drop (id)
        ');
    }
}
