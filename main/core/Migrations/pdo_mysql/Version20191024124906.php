<?php

namespace Claroline\CoreBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2019/10/24 12:49:07
 */
class Version20191024124906 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE claro_resource_node 
            ADD keywords LONGTEXT DEFAULT NULL
        ');
        $this->addSql('
            ALTER TABLE claro_workspace 
            ADD keywords LONGTEXT DEFAULT NULL
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE claro_resource_node 
            DROP keywords
        ');
        $this->addSql('
            ALTER TABLE claro_workspace 
            DROP keywords
        ');
    }
}
