<?php

namespace Claroline\CoreBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2018/12/06 02:54:05
 */
class Version20181206145403 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_user 
            ADD theme_id INT DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE claro_user 
            ADD CONSTRAINT FK_EB8D285259027487 FOREIGN KEY (theme_id) 
            REFERENCES claro_theme (id)
        ");
        $this->addSql("
            CREATE INDEX IDX_EB8D285259027487 ON claro_user (theme_id)
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_user 
            DROP FOREIGN KEY FK_EB8D285259027487
        ");
        $this->addSql("
            DROP INDEX IDX_EB8D285259027487 ON claro_user
        ");
        $this->addSql("
            ALTER TABLE claro_user 
            DROP theme_id
        ");
    }
}