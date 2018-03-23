<?php

namespace Claroline\CoreBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2018/03/23 03:38:39
 */
class Version20180323153837 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE claro_workspace
            ADD file_id INT DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE claro_workspace
            ADD CONSTRAINT FK_D902854593CB796C FOREIGN KEY (file_id)
            REFERENCES claro_public_file (id)
            ON DELETE SET NULL
        ');
        $this->addSql('
            CREATE INDEX IDX_D902854593CB796C ON claro_workspace (file_id)
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE claro_scheduled_task_users
            DROP PRIMARY KEY
        ');
        $this->addSql('
            ALTER TABLE claro_scheduled_task_users
            ADD PRIMARY KEY (scheduledtask_id, user_id)
        ');
        $this->addSql('
            ALTER TABLE claro_workspace
            DROP FOREIGN KEY FK_D902854593CB796C
        ');
    }
}
