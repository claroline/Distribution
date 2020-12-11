<?php

namespace Claroline\BookingBundle\Installation\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2020/12/10 09:26:55
 */
class Version20201210092652 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_bookingbundle_material_booking 
            ADD description LONGTEXT DEFAULT NULL
        ");
        $this->addSql("
            ALTER TABLE claro_bookingbundle_room_booking 
            ADD description LONGTEXT DEFAULT NULL
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE claro_bookingbundle_material_booking 
            DROP description
        ");
        $this->addSql("
            ALTER TABLE claro_bookingbundle_room_booking 
            DROP description
        ");
    }
}
