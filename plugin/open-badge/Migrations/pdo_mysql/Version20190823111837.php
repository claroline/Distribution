<?php

namespace Claroline\OpenBadgeBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2019/08/23 11:18:38
 */
class Version20190823111837 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE claro__open_badge_rule
            ADD node_id INT DEFAULT NULL,
            ADD workspace_id INT DEFAULT NULL,
            ADD user_id INT DEFAULT NULL,
            ADD group_id INT DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE claro__open_badge_rule
            ADD CONSTRAINT FK_DE554AC7460D9FD7 FOREIGN KEY (node_id)
            REFERENCES claro_resource_node (id)
        ');
        $this->addSql('
            ALTER TABLE claro__open_badge_rule
            ADD CONSTRAINT FK_DE554AC782D40A1F FOREIGN KEY (workspace_id)
            REFERENCES claro_workspace (id)
        ');
        $this->addSql('
            ALTER TABLE claro__open_badge_rule
            ADD CONSTRAINT FK_DE554AC7A76ED395 FOREIGN KEY (user_id)
            REFERENCES claro_user (id)
        ');
        $this->addSql('
            ALTER TABLE claro__open_badge_rule
            ADD CONSTRAINT FK_DE554AC7FE54D947 FOREIGN KEY (group_id)
            REFERENCES claro_group (id)
        ');
        $this->addSql('
            CREATE INDEX IDX_DE554AC7460D9FD7 ON claro__open_badge_rule (node_id)
        ');
        $this->addSql('
            CREATE INDEX IDX_DE554AC782D40A1F ON claro__open_badge_rule (workspace_id)
        ');
        $this->addSql('
            CREATE INDEX IDX_DE554AC7A76ED395 ON claro__open_badge_rule (user_id)
        ');
        $this->addSql('
            CREATE INDEX IDX_DE554AC7FE54D947 ON claro__open_badge_rule (group_id)
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE claro__open_badge_rule
            DROP FOREIGN KEY FK_DE554AC7460D9FD7
        ');
        $this->addSql('
            ALTER TABLE claro__open_badge_rule
            DROP FOREIGN KEY FK_DE554AC782D40A1F
        ');
        $this->addSql('
            ALTER TABLE claro__open_badge_rule
            DROP FOREIGN KEY FK_DE554AC7A76ED395
        ');
        $this->addSql('
            ALTER TABLE claro__open_badge_rule
            DROP FOREIGN KEY FK_DE554AC7FE54D947
        ');
        $this->addSql('
            DROP INDEX IDX_DE554AC7460D9FD7 ON claro__open_badge_rule
        ');
        $this->addSql('
            DROP INDEX IDX_DE554AC782D40A1F ON claro__open_badge_rule
        ');
        $this->addSql('
            DROP INDEX IDX_DE554AC7A76ED395 ON claro__open_badge_rule
        ');
        $this->addSql('
            DROP INDEX IDX_DE554AC7FE54D947 ON claro__open_badge_rule
        ');
        $this->addSql('
            ALTER TABLE claro__open_badge_rule
            DROP node_id,
            DROP workspace_id,
            DROP user_id,
            DROP group_id
        ');
    }
}
