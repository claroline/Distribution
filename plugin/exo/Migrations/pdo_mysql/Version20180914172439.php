<?php

namespace UJM\ExoBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2018/09/14 05:24:40
 */
class Version20180914172439 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_paper 
            DROP FOREIGN KEY FK_82972E4BA76ED395
        ");
        $this->addSql("
            ALTER TABLE ujm_paper 
            ADD CONSTRAINT FK_82972E4BA76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id) 
            ON DELETE CASCADE
        ");
        $this->addSql("
            ALTER TABLE ujm_interaction_hole 
            DROP originalText
        ");
        $this->addSql("
            ALTER TABLE ujm_step CHANGE pick pick LONGTEXT NOT NULL
        ");
        $this->addSql("
            ALTER TABLE ujm_hole 
            DROP position
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_hole 
            ADD position INT DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE ujm_interaction_hole 
            ADD originalText TEXT DEFAULT NULL COLLATE utf8_unicode_ci
        ");
        $this->addSql("
            ALTER TABLE ujm_paper 
            DROP FOREIGN KEY FK_82972E4BA76ED395
        ");
        $this->addSql("
            ALTER TABLE ujm_paper 
            ADD CONSTRAINT FK_82972E4BA76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id)
        ");
        $this->addSql("
            ALTER TABLE ujm_step CHANGE pick pick INT NOT NULL
        ");
    }
}