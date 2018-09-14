<?php

namespace Icap\WikiBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2018/09/14 05:56:14
 */
class Version20180914175612 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE icap__wiki_contribution 
            DROP FOREIGN KEY FK_781E6502A76ED395
        ");
        $this->addSql("
            ALTER TABLE icap__wiki_contribution 
            ADD CONSTRAINT FK_781E6502A76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id) 
            ON DELETE CASCADE
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE icap__wiki_contribution 
            DROP FOREIGN KEY FK_781E6502A76ED395
        ");
        $this->addSql("
            ALTER TABLE icap__wiki_contribution 
            ADD CONSTRAINT FK_781E6502A76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id)
        ");
    }
}