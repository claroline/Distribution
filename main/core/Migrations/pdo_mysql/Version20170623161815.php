<?php

namespace Claroline\CoreBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2017/06/23 04:18:17
 */
class Version20170623161815 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE claro_version (
                session_id VARCHAR(255) NOT NULL, 
                commit VARCHAR(255) NOT NULL, 
                version VARCHAR(255) NOT NULL, 
                branch VARCHAR(255) NOT NULL, 
                is_upgraded TINYINT(1) NOT NULL, 
                date INT DEFAULT NULL, 
                UNIQUE INDEX UNIQ_DF5F6E644ED42EAD (commit), 
                UNIQUE INDEX UNIQ_DF5F6E64BF1CD3C3 (version), 
                PRIMARY KEY(session_id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql("
            DROP INDEX UNIQ_478C5861D17F50A6 ON claro_resource_icon
        ");
        $this->addSql("
            ALTER TABLE claro_resource_icon 
            DROP uuid
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            DROP TABLE claro_version
        ");
        $this->addSql("
            ALTER TABLE claro_resource_icon 
            ADD uuid VARCHAR(36) NOT NULL COLLATE utf8_unicode_ci
        ");
        $this->addSql("
            CREATE UNIQUE INDEX UNIQ_478C5861D17F50A6 ON claro_resource_icon (uuid)
        ");
    }
}