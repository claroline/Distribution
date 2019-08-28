<?php

namespace Claroline\OpenBadgeBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2019/08/28 10:48:39
 */
class Version20190828104837 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE evidence_resourceuserevaluation (
                evidence_id INT NOT NULL, 
                resourceuserevaluation_id INT NOT NULL, 
                INDEX IDX_380539E2B528FC11 (evidence_id), 
                INDEX IDX_380539E2C97AFA95 (resourceuserevaluation_id), 
                PRIMARY KEY(
                    evidence_id, resourceuserevaluation_id
                )
            ) DEFAULT CHARACTER SET UTF8 COLLATE UTF8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql("
            ALTER TABLE evidence_resourceuserevaluation 
            ADD CONSTRAINT FK_380539E2B528FC11 FOREIGN KEY (evidence_id) 
            REFERENCES claro__open_badge_evidence (id) 
            ON DELETE CASCADE
        ");
        $this->addSql("
            ALTER TABLE evidence_resourceuserevaluation 
            ADD CONSTRAINT FK_380539E2C97AFA95 FOREIGN KEY (resourceuserevaluation_id) 
            REFERENCES claro_resource_user_evaluation (id) 
            ON DELETE CASCADE
        ");
        $this->addSql("
            ALTER TABLE claro__open_badge_badge_class CHANGE issuer_id issuer_id INT DEFAULT NULL, 
            CHANGE workspace_id workspace_id INT DEFAULT NULL, 
            CHANGE enabled enabled TINYINT(1) DEFAULT NULL, 
            CHANGE durationValidation durationValidation INT DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE claro__open_badge_evidence CHANGE assertion_id assertion_id INT DEFAULT NULL, 
            CHANGE genre genre VARCHAR(255) DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE claro__open_badge_rule CHANGE badge_id badge_id INT DEFAULT NULL, 
            CHANGE node_id node_id INT DEFAULT NULL, 
            CHANGE workspace_id workspace_id INT DEFAULT NULL, 
            CHANGE role_id role_id INT DEFAULT NULL, 
            CHANGE group_id group_id INT DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE claro__open_badge_signed_badge CHANGE cryptographicKey_id cryptographicKey_id INT DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE claro__open_badge_revocation_list CHANGE issuer_id issuer_id INT DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE claro__open_badge_assertion CHANGE recipient_id recipient_id INT DEFAULT NULL, 
            CHANGE badge_id badge_id INT DEFAULT NULL, 
            CHANGE verification_id verification_id INT DEFAULT NULL, 
            CHANGE evidences_id evidences_id INT DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE claro__open_badge_endorsement CHANGE issuer_id issuer_id INT DEFAULT NULL, 
            CHANGE verification_id verification_id INT DEFAULT NULL
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            DROP TABLE evidence_resourceuserevaluation
        ");
        $this->addSql("
            ALTER TABLE claro__open_badge_assertion CHANGE recipient_id recipient_id INT DEFAULT NULL, 
            CHANGE badge_id badge_id INT DEFAULT NULL, 
            CHANGE verification_id verification_id INT DEFAULT NULL, 
            CHANGE evidences_id evidences_id INT DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE claro__open_badge_badge_class CHANGE issuer_id issuer_id INT DEFAULT NULL, 
            CHANGE workspace_id workspace_id INT DEFAULT NULL, 
            CHANGE enabled enabled TINYINT(1) DEFAULT 'NULL', 
            CHANGE durationValidation durationValidation INT DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE claro__open_badge_endorsement CHANGE issuer_id issuer_id INT DEFAULT NULL, 
            CHANGE verification_id verification_id INT DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE claro__open_badge_evidence CHANGE assertion_id assertion_id INT DEFAULT NULL, 
            CHANGE genre genre VARCHAR(255) DEFAULT 'NULL' COLLATE utf8_unicode_ci
        ");
        $this->addSql("
            ALTER TABLE claro__open_badge_revocation_list CHANGE issuer_id issuer_id INT DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE claro__open_badge_rule CHANGE badge_id badge_id INT DEFAULT NULL, 
            CHANGE node_id node_id INT DEFAULT NULL, 
            CHANGE workspace_id workspace_id INT DEFAULT NULL, 
            CHANGE role_id role_id INT DEFAULT NULL, 
            CHANGE group_id group_id INT DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE claro__open_badge_signed_badge CHANGE cryptographicKey_id cryptographicKey_id INT DEFAULT NULL
        ");
    }
}