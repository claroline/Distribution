<?php

namespace Claroline\CoreBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2016/10/05 05:08:40
 */
class Version20161005170840 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE INDEX name_idx ON claro_workspace (name)
        ");
        $this->addSql("
            CREATE INDEX name_idx ON claro__event (name)
        ");
        $this->addSql("
            CREATE INDEX action_idx ON claro_log (action)
        ");
        $this->addSql("
            CREATE INDEX tool_idx ON claro_log (tool_name)
        ");
        $this->addSql("
            CREATE INDEX doer_type_idx ON claro_log (doer_type)
        ");
        $this->addSql("
            CREATE INDEX name_idx ON claro_workspace_tag (name)
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            DROP INDEX name_idx ON claro__event
        ");
        $this->addSql("
            DROP INDEX action_idx ON claro_log
        ");
        $this->addSql("
            DROP INDEX tool_idx ON claro_log
        ");
        $this->addSql("
            DROP INDEX doer_type_idx ON claro_log
        ");
        $this->addSql("
            DROP INDEX name_idx ON claro_workspace
        ");
        $this->addSql("
            DROP INDEX name_idx ON claro_workspace_tag
        ");
    }
}