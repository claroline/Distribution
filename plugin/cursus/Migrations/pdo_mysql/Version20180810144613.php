<?php

namespace Claroline\CursusBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2018/08/10 02:46:14
 */
class Version20180810144613 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE claro_cursusbundle_course_session 
            ADD uuid VARCHAR(36) NOT NULL
        ');
        $this->addSql('
            UPDATE claro_cursusbundle_course_session SET uuid = (SELECT UUID())
        ');
        $this->addSql('
            CREATE UNIQUE INDEX UNIQ_C5F56FDED17F50A6 ON claro_cursusbundle_course_session (uuid)
        ');
        $this->addSql('
            ALTER TABLE claro_cursusbundle_session_event_set 
            ADD uuid VARCHAR(36) NOT NULL
        ');
        $this->addSql('
            UPDATE claro_cursusbundle_session_event_set SET uuid = (SELECT UUID())
        ');
        $this->addSql('
            CREATE UNIQUE INDEX UNIQ_C400AB6DD17F50A6 ON claro_cursusbundle_session_event_set (uuid)
        ');
        $this->addSql('
            ALTER TABLE claro_cursusbundle_session_event 
            ADD uuid VARCHAR(36) NOT NULL
        ');
        $this->addSql('
            UPDATE claro_cursusbundle_session_event SET uuid = (SELECT UUID())
        ');
        $this->addSql('
            CREATE UNIQUE INDEX UNIQ_257C3061D17F50A6 ON claro_cursusbundle_session_event (uuid)
        ');
        $this->addSql('
            ALTER TABLE claro_cursusbundle_session_event_comment 
            ADD uuid VARCHAR(36) NOT NULL
        ');
        $this->addSql('
            UPDATE claro_cursusbundle_session_event_comment SET uuid = (SELECT UUID())
        ');
        $this->addSql('
            CREATE UNIQUE INDEX UNIQ_21DFDBA8D17F50A6 ON claro_cursusbundle_session_event_comment (uuid)
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            DROP INDEX UNIQ_C5F56FDED17F50A6 ON claro_cursusbundle_course_session
        ');
        $this->addSql('
            ALTER TABLE claro_cursusbundle_course_session 
            DROP uuid
        ');
        $this->addSql('
            DROP INDEX UNIQ_257C3061D17F50A6 ON claro_cursusbundle_session_event
        ');
        $this->addSql('
            ALTER TABLE claro_cursusbundle_session_event 
            DROP uuid
        ');
        $this->addSql('
            DROP INDEX UNIQ_21DFDBA8D17F50A6 ON claro_cursusbundle_session_event_comment
        ');
        $this->addSql('
            ALTER TABLE claro_cursusbundle_session_event_comment 
            DROP uuid
        ');
        $this->addSql('
            DROP INDEX UNIQ_C400AB6DD17F50A6 ON claro_cursusbundle_session_event_set
        ');
        $this->addSql('
            ALTER TABLE claro_cursusbundle_session_event_set 
            DROP uuid
        ');
    }
}
