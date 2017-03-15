<?php

namespace Innova\PathBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2017/03/02 08:39:39
 */
class Version20170302203935 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE innova_stepcondition
            ADD available_from_date DATETIME DEFAULT NULL,
            ADD available_until_date DATETIME DEFAULT NULL
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE innova_stepcondition
            DROP available_from_date,
            DROP available_until_date
        ');
    }
}
