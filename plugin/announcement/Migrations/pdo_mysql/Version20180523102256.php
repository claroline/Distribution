<?php

namespace Claroline\AnnouncementBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2018/05/23 10:22:58
 */
class Version20180523102256 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE claro_announcements_send (
                id INT AUTO_INCREMENT NOT NULL,
                aggregate_id INT NOT NULL,
                data LONGTEXT DEFAULT NULL COMMENT '(DC2Type:json_array)',
                uuid VARCHAR(36) NOT NULL,
                UNIQUE INDEX UNIQ_7C739377D17F50A6 (uuid),
                INDEX IDX_7C739377D0BBCCBE (aggregate_id),
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql('
            ALTER TABLE claro_announcement
            ADD send_id INT NOT NULL
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE claro_announcement
            DROP FOREIGN KEY FK_778754E313933E7B
        ');
        $this->addSql('
            DROP TABLE claro_announcements_send
        ');
        $this->addSql('
            DROP INDEX IDX_778754E313933E7B ON claro_announcement
        ');
        $this->addSql('
            ALTER TABLE claro_announcement
            DROP send_id
        ');
    }
}
