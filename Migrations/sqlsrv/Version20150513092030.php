<?php

namespace Innova\PathBundle\Migrations\sqlsrv;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2015/05/13 09:20:32
 */
class Version20150513092030 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE innova_pathtemplate 
            ADD breadcrumbs BIT NOT NULL
        ");
        $this->addSql("
            ALTER TABLE innova_pathtemplate 
            DROP COLUMN description
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE innova_pathtemplate 
            ADD description VARCHAR(MAX)
        ");
        $this->addSql("
            ALTER TABLE innova_pathtemplate 
            DROP COLUMN breadcrumbs
        ");
    }
}