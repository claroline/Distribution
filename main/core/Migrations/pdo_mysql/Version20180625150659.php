<?php

namespace Claroline\CoreBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2018/06/25 03:07:01
 */
class Version20180625150659 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE claro_workspace
            ADD workspaceLang VARCHAR(255) DEFAULT NULL,
            ADD onLoadChangeLang VARCHAR(255) DEFAULT NULL
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_widget_instance
            ADD display VARCHAR(255) NOT NULL COLLATE utf8_unicode_ci,
            ADD availableDisplays LONGTEXT NOT NULL COLLATE utf8_unicode_ci COMMENT '(DC2Type:json_array)'
        ");
    }
}
