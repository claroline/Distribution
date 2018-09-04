<?php

namespace Icap\DropzoneBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2018/09/04 05:34:43
 */
class Version20180904173443 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE icap__dropzonebundle_drop
            DROP FOREIGN KEY FK_3AD19BA65342CDF
        ');
        $this->addSql('
            ALTER TABLE icap__dropzonebundle_drop
            ADD CONSTRAINT FK_3AD19BA65342CDF FOREIGN KEY (hidden_directory_id)
            REFERENCES claro_resource_node (id)
            ON DELETE CASCADE
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE icap__dropzonebundle_drop
            DROP FOREIGN KEY FK_3AD19BA65342CDF
        ');
        $this->addSql('
            ALTER TABLE icap__dropzonebundle_drop
            ADD CONSTRAINT FK_3AD19BA65342CDF FOREIGN KEY (hidden_directory_id)
            REFERENCES claro_resource_node (id)
        ');
    }
}
