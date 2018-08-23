<?php

namespace Claroline\ForumBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2018/08/23 02:07:36
 */
class Version20180823140735 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            CREATE TABLE claro_forum_user (
                id INT AUTO_INCREMENT NOT NULL,
                user_id INT DEFAULT NULL,
                forum_id INT DEFAULT NULL,
                access TINYINT(1) NOT NULL,
                banned TINYINT(1) NOT NULL,
                notified TINYINT(1) NOT NULL,
                INDEX IDX_2CFBFDC4A76ED395 (user_id),
                INDEX IDX_2CFBFDC429CCBAD0 (forum_id),
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET UTF8 COLLATE UTF8_unicode_ci ENGINE = InnoDB
        ');
        $this->addSql('
            ALTER TABLE claro_forum_user
            ADD CONSTRAINT FK_2CFBFDC4A76ED395 FOREIGN KEY (user_id)
            REFERENCES claro_user (id)
        ');
        $this->addSql('
            ALTER TABLE claro_forum_user
            ADD CONSTRAINT FK_2CFBFDC429CCBAD0 FOREIGN KEY (forum_id)
            REFERENCES claro_forum (id)
        ');
        $this->addSql('
            ALTER TABLE claro_forum_subject
            DROP FOREIGN KEY FK_273AA20B12469DE2
        ');
        $this->addSql('
            DROP INDEX IDX_273AA20B12469DE2 ON claro_forum_subject
        ');
        $this->addSql('
            ALTER TABLE claro_forum_subject
            ADD poster_id INT DEFAULT NULL,
            ADD sticked TINYINT(1) NOT NULL,
            ADD closed TINYINT(1) NOT NULL,
            ADD flagged TINYINT(1) NOT NULL,
            ADD viewCount INT NOT NULL,
            ADD moderation VARCHAR(255) NOT NULL,
            ADD uuid VARCHAR(36) NOT NULL,
            DROP isSticked,
            DROP isClosed,
            CHANGE category_id forum_id INT DEFAULT NULL
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            DROP TABLE claro_forum_user
        ');
        $this->addSql('
            DROP INDEX UNIQ_F2869DFD17F50A6 ON claro_forum
        ');
        $this->addSql('
            ALTER TABLE claro_forum
            ADD activate_notifications TINYINT(1) NOT NULL,
            DROP validationMode,
            DROP maxComment,
            DROP displayMessages,
            DROP dataListOptions,
            DROP lockDate,
            DROP show_overview,
            DROP description,
            DROP uuid
        ');
        $this->addSql('
            ALTER TABLE claro_forum_message
            DROP FOREIGN KEY FK_6A49AC0E727ACA70
        ');
        $this->addSql('
            DROP INDEX UNIQ_6A49AC0ED17F50A6 ON claro_forum_message
        ');
        $this->addSql('
            DROP INDEX IDX_6A49AC0E727ACA70 ON claro_forum_message
        ');
        $this->addSql('
            ALTER TABLE claro_forum_message
            DROP parent_id,
            DROP uuid,
            DROP moderation,
            DROP flagged,
            DROP first
        ');
        $this->addSql('
            ALTER TABLE claro_forum_subject
            DROP FOREIGN KEY FK_273AA20B29CCBAD0
        ');
        $this->addSql('
            ALTER TABLE claro_forum_subject
            DROP FOREIGN KEY FK_273AA20B5BB66C05
        ');
        $this->addSql('
            DROP INDEX UNIQ_273AA20BD17F50A6 ON claro_forum_subject
        ');
        $this->addSql('
            DROP INDEX IDX_273AA20B29CCBAD0 ON claro_forum_subject
        ');
        $this->addSql('
            DROP INDEX IDX_273AA20B5BB66C05 ON claro_forum_subject
        ');
        $this->addSql('
            ALTER TABLE claro_forum_subject
            ADD category_id INT DEFAULT NULL,
            ADD isSticked TINYINT(1) NOT NULL,
            ADD isClosed TINYINT(1) NOT NULL,
            DROP forum_id,
            DROP poster_id,
            DROP sticked,
            DROP closed,
            DROP flagged,
            DROP viewCount,
            DROP moderation,
            DROP uuid
        ');
        $this->addSql('
            ALTER TABLE claro_forum_subject
            ADD CONSTRAINT FK_273AA20B12469DE2 FOREIGN KEY (category_id)
            REFERENCES claro_forum_category (id)
            ON DELETE CASCADE
        ');
        $this->addSql('
            CREATE INDEX IDX_273AA20B12469DE2 ON claro_forum_subject (category_id)
        ');
    }
}
