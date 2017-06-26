<?php

namespace Claroline\CoreBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2017/06/26 11:11:29
 */
class Version20170626111128 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE claro_version (
                id VARCHAR(255) NOT NULL, 
                commit VARCHAR(255) NOT NULL, 
                version VARCHAR(255) NOT NULL, 
                branch VARCHAR(255) NOT NULL, 
                is_upgraded TINYINT(1) NOT NULL, 
                date INT DEFAULT NULL, 
                UNIQUE INDEX UNIQ_DF5F6E644ED42EAD (commit), 
                UNIQUE INDEX UNIQ_DF5F6E64BF1CD3C3 (version), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql("
            CREATE TABLE claro_updater_executed (
                id VARCHAR(255) NOT NULL, 
                version_id VARCHAR(255) DEFAULT NULL, 
                bundle VARCHAR(255) NOT NULL, 
                INDEX IDX_7C1EE2674BBC2705 (version_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql("
            ALTER TABLE claro_updater_executed 
            ADD CONSTRAINT FK_7C1EE2674BBC2705 FOREIGN KEY (version_id) 
            REFERENCES claro_version (id) 
            ON DELETE SET NULL
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_updater_executed 
            DROP FOREIGN KEY FK_7C1EE2674BBC2705
        ");
        $this->addSql("
            DROP TABLE claro_version
        ");
        $this->addSql("
            DROP TABLE claro_updater_executed
        ");
    }
}