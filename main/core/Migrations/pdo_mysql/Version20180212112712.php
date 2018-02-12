<?php

namespace Claroline\CoreBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2018/02/12 11:27:13
 */
class Version20180212112712 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_user 
            ADD main_organization_id INT DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE claro_user 
            ADD CONSTRAINT FK_EB8D2852A44F071B FOREIGN KEY (main_organization_id) 
            REFERENCES claro__organization (id) 
            ON DELETE SET NULL
        ");
        $this->addSql("
            CREATE INDEX IDX_EB8D2852A44F071B ON claro_user (main_organization_id)
        ");
        $this->addSql("
            ALTER TABLE claro__organization 
            ADD vat VARCHAR(255) NOT NULL, 
            ADD type VARCHAR(255) NOT NULL
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro__organization 
            DROP vat, 
            DROP type
        ");
        $this->addSql("
            ALTER TABLE claro_user 
            DROP FOREIGN KEY FK_EB8D2852A44F071B
        ");
        $this->addSql("
            DROP INDEX IDX_EB8D2852A44F071B ON claro_user
        ");
        $this->addSql("
            ALTER TABLE claro_user 
            DROP main_organization_id
        ");
    }
}