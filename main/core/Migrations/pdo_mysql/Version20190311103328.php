<?php

namespace Claroline\CoreBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2019/03/11 10:33:33
 */
class Version20190311103328 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            CREATE TABLE claro_database_backup (
                id INT AUTO_INCREMENT NOT NULL,
                name VARCHAR(255) DEFAULT NULL,
                type VARCHAR(255) NOT NULL,
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET UTF8 COLLATE UTF8_unicode_ci ENGINE = InnoDB
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            DROP TABLE claro_database_backup
        ');
    }
}
