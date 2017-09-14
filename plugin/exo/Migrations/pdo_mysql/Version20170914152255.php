<?php

namespace UJM\ExoBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2017/09/14 03:22:56
 */
class Version20170914152255 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_step
            ADD random_tag LONGTEXT NOT NULL COMMENT '(DC2Type:array)'
        ");
        $this->addSql("
            ALTER TABLE ujm_exercise
            ADD random_tag LONGTEXT NOT NULL COMMENT '(DC2Type:array)'
        ");
        $this->addSql('
            UPDATE ujm_step set random_tag="a:0:{}"
        ');
        $this->addSql('
            UPDATE ujm_exercise set random_tag="a:0:{}"
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE ujm_exercise
            DROP random_tag
        ');
        $this->addSql('
            ALTER TABLE ujm_step
            DROP random_tag
        ');
    }
}
