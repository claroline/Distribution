<?php

namespace Innova\CollecticielBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2018/09/14 05:32:11
 */
class Version20180914173208 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE innova_collecticielbundle_correction 
            DROP FOREIGN KEY FK_BA9AF20BA76ED395
        ");
        $this->addSql("
            ALTER TABLE innova_collecticielbundle_correction 
            ADD CONSTRAINT FK_BA9AF20BA76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id) 
            ON DELETE CASCADE
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE innova_collecticielbundle_correction 
            DROP FOREIGN KEY FK_BA9AF20BA76ED395
        ");
        $this->addSql("
            ALTER TABLE innova_collecticielbundle_correction 
            ADD CONSTRAINT FK_BA9AF20BA76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id)
        ");
    }
}