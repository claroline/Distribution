<?php

namespace UJM\ExoBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2016/11/20 01:39:02
 */
class Version20161120133842 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_hint 
            CHANGE `value` data LONGTEXT DEFAULT NULL, 
            ADD resourceNode_id INT DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE ujm_hint 
            ADD CONSTRAINT FK_B5FFCBE7B87FAB32 FOREIGN KEY (resourceNode_id) 
            REFERENCES claro_resource_node (id)
        ");
        $this->addSql("
            CREATE INDEX IDX_B5FFCBE7B87FAB32 ON ujm_hint (resourceNode_id)
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_hint 
            DROP FOREIGN KEY FK_B5FFCBE7B87FAB32
        ");
        $this->addSql("
            DROP INDEX IDX_B5FFCBE7B87FAB32 ON ujm_hint
        ");
        $this->addSql("
            ALTER TABLE ujm_hint 
            CHANGE data `value` VARCHAR(255) NOT NULL COLLATE utf8_unicode_ci,  
            DROP resourceNode_id
        ");
    }
}
