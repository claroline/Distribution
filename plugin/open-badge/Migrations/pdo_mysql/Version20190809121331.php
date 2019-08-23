<?php

namespace Claroline\OpenBadgeBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2019/08/09 12:13:32
 */
class Version20190809121331 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE claro__open_badge_badge_class CHANGE issuer_id issuer_id INT DEFAULT NULL,
            CHANGE workspace_id workspace_id INT DEFAULT NULL,
            CHANGE enabled enabled TINYINT(1) DEFAULT NULL,
            CHANGE durationValidation durationValidation INT DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE claro__open_badge_evidence CHANGE assertion_id assertion_id INT DEFAULT NULL,
            CHANGE genre genre VARCHAR(255) DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE claro__open_badge_rule
            ADD badge_id INT DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE claro__open_badge_rule
            ADD CONSTRAINT FK_DE554AC7F7A2C2FC FOREIGN KEY (badge_id)
            REFERENCES claro__open_badge_badge_class (id)
        ');
        $this->addSql('
            CREATE INDEX IDX_DE554AC7F7A2C2FC ON claro__open_badge_rule (badge_id)
        ');
        $this->addSql('
            ALTER TABLE claro__open_badge_signed_badge CHANGE cryptographicKey_id cryptographicKey_id INT DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE claro__open_badge_revocation_list CHANGE issuer_id issuer_id INT DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE claro__open_badge_assertion CHANGE recipient_id recipient_id INT DEFAULT NULL,
            CHANGE badge_id badge_id INT DEFAULT NULL,
            CHANGE verification_id verification_id INT DEFAULT NULL,
            CHANGE evidences_id evidences_id INT DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE claro__open_badge_endorsement CHANGE issuer_id issuer_id INT DEFAULT NULL,
            CHANGE verification_id verification_id INT DEFAULT NULL
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE claro__open_badge_assertion CHANGE recipient_id recipient_id INT DEFAULT NULL,
            CHANGE badge_id badge_id INT DEFAULT NULL,
            CHANGE verification_id verification_id INT DEFAULT NULL,
            CHANGE evidences_id evidences_id INT DEFAULT NULL
        ');
        $this->addSql("
            ALTER TABLE claro__open_badge_badge_class CHANGE issuer_id issuer_id INT DEFAULT NULL,
            CHANGE workspace_id workspace_id INT DEFAULT NULL,
            CHANGE enabled enabled TINYINT(1) DEFAULT 'NULL',
            CHANGE durationValidation durationValidation INT DEFAULT NULL
        ");
        $this->addSql('
            ALTER TABLE claro__open_badge_endorsement CHANGE issuer_id issuer_id INT DEFAULT NULL,
            CHANGE verification_id verification_id INT DEFAULT NULL
        ');
        $this->addSql("
            ALTER TABLE claro__open_badge_evidence CHANGE assertion_id assertion_id INT DEFAULT NULL,
            CHANGE genre genre VARCHAR(255) DEFAULT 'NULL' COLLATE utf8_unicode_ci
        ");
        $this->addSql('
            ALTER TABLE claro__open_badge_revocation_list CHANGE issuer_id issuer_id INT DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE claro__open_badge_rule
            DROP FOREIGN KEY FK_DE554AC7F7A2C2FC
        ');
        $this->addSql('
            DROP INDEX IDX_DE554AC7F7A2C2FC ON claro__open_badge_rule
        ');
        $this->addSql('
            ALTER TABLE claro__open_badge_rule
            DROP badge_id
        ');
        $this->addSql('
            ALTER TABLE claro__open_badge_signed_badge CHANGE cryptographicKey_id cryptographicKey_id INT DEFAULT NULL
        ');
    }
}
