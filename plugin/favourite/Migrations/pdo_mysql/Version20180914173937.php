<?php

namespace HeVinci\FavouriteBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2018/09/14 05:39:39
 */
class Version20180914173937 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE hevinci_favourite 
            DROP FOREIGN KEY FK_55DB0452A76ED395
        ");
        $this->addSql("
            ALTER TABLE hevinci_favourite 
            ADD CONSTRAINT FK_55DB0452A76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id) 
            ON DELETE CASCADE
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE hevinci_favourite 
            DROP FOREIGN KEY FK_55DB0452A76ED395
        ");
        $this->addSql("
            ALTER TABLE hevinci_favourite 
            ADD CONSTRAINT FK_55DB0452A76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id)
        ");
    }
}