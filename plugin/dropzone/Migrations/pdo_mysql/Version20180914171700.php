<?php

namespace Icap\DropzoneBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2018/09/14 05:17:02
 */
class Version20180914171700 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE icap__dropzonebundle_drop 
            DROP FOREIGN KEY FK_3AD19BA6A76ED395
        ");
        $this->addSql("
            ALTER TABLE icap__dropzonebundle_drop 
            ADD CONSTRAINT FK_3AD19BA6A76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id) 
            ON DELETE CASCADE
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE icap__dropzonebundle_drop 
            DROP FOREIGN KEY FK_3AD19BA6A76ED395
        ");
        $this->addSql("
            ALTER TABLE icap__dropzonebundle_drop 
            ADD CONSTRAINT FK_3AD19BA6A76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id)
        ");
    }
}