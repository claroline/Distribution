<?php

namespace Claroline\OpenBadgeBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2019/08/08 04:44:53
 */
class Version20190808164452 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE claro__open_badge_rule (
                id INT AUTO_INCREMENT NOT NULL, 
                action VARCHAR(255) NOT NULL, 
                data LONGTEXT NOT NULL COMMENT '(DC2Type:json_array)', 
                uuid VARCHAR(36) NOT NULL, 
                UNIQUE INDEX UNIQ_DE554AC7D17F50A6 (uuid), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET UTF8 COLLATE UTF8_unicode_ci ENGINE = InnoDB
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            DROP TABLE claro__open_badge_rule
        ');
    }
}
