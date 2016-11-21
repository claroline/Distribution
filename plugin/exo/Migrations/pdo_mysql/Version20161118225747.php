<?php

namespace UJM\ExoBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2016/11/18 10:58:08
 */
class Version20161118225747 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_picture 
            DROP FOREIGN KEY FK_88AACC8AA76ED395
        ");
        $this->addSql("
            DROP INDEX IDX_88AACC8AA76ED395 ON ujm_picture
        ");
        $this->addSql("
            ALTER TABLE ujm_picture 
            DROP user_id
        ");
        $this->addSql("
            ALTER TABLE ujm_object_question CHANGE ordre `order` INT NOT NULL
        ");
        $this->addSql("
            ALTER TABLE ujm_step_question CHANGE ordre `order` INT NOT NULL
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_object_question CHANGE `order` ordre INT NOT NULL
        ");
        $this->addSql("
            ALTER TABLE ujm_picture 
            ADD user_id INT DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE ujm_picture 
            ADD CONSTRAINT FK_88AACC8AA76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id)
        ");
        $this->addSql("
            CREATE INDEX IDX_88AACC8AA76ED395 ON ujm_picture (user_id)
        ");
        $this->addSql("
            ALTER TABLE ujm_step_question CHANGE `order` ordre INT NOT NULL
        ");
    }
}
