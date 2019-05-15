<?php

namespace Claroline\AudioPlayerBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2019/05/15 12:19:06
 */
class Version20190515121905 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            CREATE TABLE claro_audio_section_comment (
                id INT AUTO_INCREMENT NOT NULL, 
                node_id INT NOT NULL, 
                user_id INT DEFAULT NULL, 
                content LONGTEXT DEFAULT NULL, 
                creation_date DATETIME NOT NULL, 
                edition_date DATETIME DEFAULT NULL, 
                section_start DOUBLE PRECISION NOT NULL, 
                section_end DOUBLE PRECISION NOT NULL, 
                color VARCHAR(255) DEFAULT NULL, 
                uuid VARCHAR(36) NOT NULL, 
                UNIQUE INDEX UNIQ_7A6BD3FDD17F50A6 (uuid), 
                INDEX IDX_7A6BD3FD460D9FD7 (node_id), 
                INDEX IDX_7A6BD3FDA76ED395 (user_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET UTF8 COLLATE UTF8_unicode_ci ENGINE = InnoDB
        ');
        $this->addSql('
            CREATE TABLE claro_audio_params (
                id INT AUTO_INCREMENT NOT NULL, 
                node_id INT NOT NULL, 
                comments_allowed TINYINT(1) NOT NULL, 
                rate_control TINYINT(1) NOT NULL, 
                uuid VARCHAR(36) NOT NULL, 
                UNIQUE INDEX UNIQ_B7FF82AAD17F50A6 (uuid), 
                INDEX IDX_B7FF82AA460D9FD7 (node_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET UTF8 COLLATE UTF8_unicode_ci ENGINE = InnoDB
        ');
        $this->addSql('
            ALTER TABLE claro_audio_section_comment 
            ADD CONSTRAINT FK_7A6BD3FD460D9FD7 FOREIGN KEY (node_id) 
            REFERENCES claro_resource_node (id) 
            ON DELETE CASCADE
        ');
        $this->addSql('
            ALTER TABLE claro_audio_section_comment 
            ADD CONSTRAINT FK_7A6BD3FDA76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id) 
            ON DELETE SET NULL
        ');
        $this->addSql('
            ALTER TABLE claro_audio_params 
            ADD CONSTRAINT FK_B7FF82AA460D9FD7 FOREIGN KEY (node_id) 
            REFERENCES claro_resource_node (id) 
            ON DELETE CASCADE
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            DROP TABLE claro_audio_section_comment
        ');
        $this->addSql('
            DROP TABLE claro_audio_params
        ');
    }
}
