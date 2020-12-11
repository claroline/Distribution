<?php

namespace Claroline\BookingBundle\Installation\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2020/12/10 07:05:25
 */
class Version20201210070518 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            CREATE TABLE claro_bookingbundle_material_booking (
                id INT AUTO_INCREMENT NOT NULL, 
                material_id INT DEFAULT NULL, 
                start_date DATETIME NOT NULL, 
                end_date DATETIME NOT NULL, 
                uuid VARCHAR(36) NOT NULL, 
                UNIQUE INDEX UNIQ_7D5ED1AAD17F50A6 (uuid), 
                INDEX IDX_7D5ED1AAE308AC6F (material_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET UTF8 COLLATE `UTF8_unicode_ci` ENGINE = InnoDB
        ');
        $this->addSql('
            ALTER TABLE claro_bookingbundle_material_booking 
            ADD CONSTRAINT FK_7D5ED1AAE308AC6F FOREIGN KEY (material_id) 
            REFERENCES claro_bookingbundle_material (id) 
            ON DELETE CASCADE
        ');
        $this->addSql('
            ALTER TABLE claro_bookingbundle_room 
            DROP location_extra
        ');
        $this->addSql('
            ALTER TABLE claro_bookingbundle_room_booking 
            DROP FOREIGN KEY FK_943D1D8554177093
        ');
        $this->addSql('
            ALTER TABLE claro_bookingbundle_room_booking 
            ADD CONSTRAINT FK_943D1D8554177093 FOREIGN KEY (room_id) 
            REFERENCES claro_bookingbundle_room (id) 
            ON DELETE CASCADE
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            DROP TABLE claro_bookingbundle_material_booking
        ');
        $this->addSql('
            ALTER TABLE claro_bookingbundle_room 
            ADD location_extra LONGTEXT CHARACTER SET utf8 DEFAULT NULL COLLATE `utf8_unicode_ci`
        ');
        $this->addSql('
            ALTER TABLE claro_bookingbundle_room_booking 
            DROP FOREIGN KEY FK_943D1D8554177093
        ');
        $this->addSql('
            ALTER TABLE claro_bookingbundle_room_booking 
            ADD CONSTRAINT FK_943D1D8554177093 FOREIGN KEY (room_id) 
            REFERENCES claro_bookingbundle_room (id) 
            ON DELETE SET NULL
        ');
    }
}
