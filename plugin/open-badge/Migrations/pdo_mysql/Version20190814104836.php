<?php

namespace Claroline\OpenBadgeBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2019/08/14 10:48:37
 */
class Version20190814104836 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro__open_badge_rule 
            ADD badge_id INT DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE claro__open_badge_rule 
            ADD CONSTRAINT FK_DE554AC7F7A2C2FC FOREIGN KEY (badge_id) 
            REFERENCES claro__open_badge_badge_class (id)
        ");
        $this->addSql("
            CREATE INDEX IDX_DE554AC7F7A2C2FC ON claro__open_badge_rule (badge_id)
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro__open_badge_rule 
            DROP FOREIGN KEY FK_DE554AC7F7A2C2FC
        ");
        $this->addSql("
            DROP INDEX IDX_DE554AC7F7A2C2FC ON claro__open_badge_rule
        ");
        $this->addSql("
            ALTER TABLE claro__open_badge_rule 
            DROP badge_id
        ");
    }
}