<?php

namespace Claroline\DropZoneBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2017/10/25 11:18:31
 */
class Version20171025111829 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE claro_dropzonebundle_dropzone (
                id INT AUTO_INCREMENT NOT NULL, 
                edition_state SMALLINT NOT NULL, 
                instruction LONGTEXT DEFAULT NULL, 
                correction_instruction LONGTEXT DEFAULT NULL, 
                success_message LONGTEXT DEFAULT NULL, 
                fail_message LONGTEXT DEFAULT NULL, 
                workspace_resource_enabled TINYINT(1) NOT NULL, 
                upload_enabled TINYINT(1) NOT NULL, 
                url_enabled TINYINT(1) NOT NULL, 
                rich_text_enabled TINYINT(1) NOT NULL, 
                peer_review TINYINT(1) NOT NULL, 
                expected_correction_total SMALLINT NOT NULL, 
                display_notation_to_learners TINYINT(1) NOT NULL, 
                display_notation_message_to_learners TINYINT(1) NOT NULL, 
                score_to_pass DOUBLE PRECISION NOT NULL, 
                manual_planning TINYINT(1) NOT NULL, 
                manual_state VARCHAR(255) NOT NULL, 
                drop_start_date DATETIME DEFAULT NULL, 
                drop_end_date DATETIME DEFAULT NULL, 
                review_start_date DATETIME DEFAULT NULL, 
                review_end_date DATETIME DEFAULT NULL, 
                comment_in_correction_enabled TINYINT(1) NOT NULL, 
                comment_in_correction_forced TINYINT(1) NOT NULL, 
                display_corrections_to_learners TINYINT(1) NOT NULL, 
                correction_denial_enabled TINYINT(1) NOT NULL, 
                criteria_enabled TINYINT(1) NOT NULL, 
                criteria_total SMALLINT NOT NULL, 
                auto_close_drops_at_drop_end_date TINYINT(1) NOT NULL, 
                auto_close_state VARCHAR(255) NOT NULL, 
                notify_on_drop TINYINT(1) NOT NULL, 
                uuid VARCHAR(36) NOT NULL, 
                resourceNode_id INT DEFAULT NULL, 
                UNIQUE INDEX UNIQ_FB84B2AFD17F50A6 (uuid), 
                UNIQUE INDEX UNIQ_FB84B2AFB87FAB32 (resourceNode_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql("
            ALTER TABLE claro_dropzonebundle_dropzone 
            ADD CONSTRAINT FK_FB84B2AFB87FAB32 FOREIGN KEY (resourceNode_id) 
            REFERENCES claro_resource_node (id) 
            ON DELETE CASCADE
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            DROP TABLE claro_dropzonebundle_dropzone
        ");
    }
}