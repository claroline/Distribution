<?php

namespace Claroline\CursusBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2017/06/02 09:11:27
 */
class Version20170602091125 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            CREATE TABLE claro_cursusbundle_session_event_group (
                id INT AUTO_INCREMENT NOT NULL, 
                session_id INT DEFAULT NULL, 
                group_name VARCHAR(255) NOT NULL, 
                group_limit INT NOT NULL, 
                INDEX IDX_9A1E570F613FECDF (session_id), 
                UNIQUE INDEX event_group_unique_name_session (group_name, session_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ');
        $this->addSql('
            ALTER TABLE claro_cursusbundle_session_event_group 
            ADD CONSTRAINT FK_9A1E570F613FECDF FOREIGN KEY (session_id) 
            REFERENCES claro_cursusbundle_course_session (id) 
            ON DELETE CASCADE
        ');
        $this->addSql('
            ALTER TABLE claro_cursusbundle_session_event 
            ADD event_group INT DEFAULT NULL, 
            ADD event_type INT DEFAULT 0 NOT NULL
        ');
        $this->addSql('
            ALTER TABLE claro_cursusbundle_session_event 
            ADD CONSTRAINT FK_257C30612CDBF5E9 FOREIGN KEY (event_group) 
            REFERENCES claro_cursusbundle_session_event_group (id) 
            ON DELETE SET NULL
        ');
        $this->addSql('
            CREATE INDEX IDX_257C30612CDBF5E9 ON claro_cursusbundle_session_event (event_group)
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE claro_cursusbundle_session_event 
            DROP FOREIGN KEY FK_257C30612CDBF5E9
        ');
        $this->addSql('
            DROP TABLE claro_cursusbundle_session_event_group
        ');
        $this->addSql('
            DROP INDEX IDX_257C30612CDBF5E9 ON claro_cursusbundle_session_event
        ');
        $this->addSql('
            ALTER TABLE claro_cursusbundle_session_event 
            DROP event_group, 
            DROP event_type
        ');
    }
}
