<?php

namespace Claroline\BookingBundle\Installation\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2020/11/10 10:05:16
 */
class Version20201110100432 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            CREATE TABLE claro_bookingbundle_material (
                id INT AUTO_INCREMENT NOT NULL, 
                event_name VARCHAR(255) NOT NULL, 
                capacity INT NOT NULL, 
                uuid VARCHAR(36) NOT NULL, 
                code VARCHAR(255) NOT NULL, 
                description LONGTEXT DEFAULT NULL, 
                poster VARCHAR(255) DEFAULT NULL, 
                thumbnail VARCHAR(255) DEFAULT NULL, 
                UNIQUE INDEX UNIQ_F88E6994D17F50A6 (uuid), 
                UNIQUE INDEX UNIQ_F88E699477153098 (code), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET UTF8 COLLATE `UTF8_unicode_ci` ENGINE = InnoDB
        ');
        $this->addSql('
            CREATE TABLE claro_bookingbundle_room (
                id INT AUTO_INCREMENT NOT NULL, 
                location_id INT DEFAULT NULL, 
                event_name VARCHAR(255) NOT NULL, 
                location_extra LONGTEXT DEFAULT NULL, 
                capacity INT NOT NULL, 
                uuid VARCHAR(36) NOT NULL, 
                code VARCHAR(255) NOT NULL, 
                description LONGTEXT DEFAULT NULL, 
                poster VARCHAR(255) DEFAULT NULL, 
                thumbnail VARCHAR(255) DEFAULT NULL, 
                UNIQUE INDEX UNIQ_2083E969D17F50A6 (uuid), 
                UNIQUE INDEX UNIQ_2083E96977153098 (code), 
                INDEX IDX_2083E96964D218E (location_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET UTF8 COLLATE `UTF8_unicode_ci` ENGINE = InnoDB
        ');
        $this->addSql('
            CREATE TABLE claro_bookingbundle_room_booking (
                id INT AUTO_INCREMENT NOT NULL, 
                room_id INT DEFAULT NULL, 
                start_date DATETIME NOT NULL, 
                end_date DATETIME NOT NULL, 
                uuid VARCHAR(36) NOT NULL, 
                UNIQUE INDEX UNIQ_943D1D85D17F50A6 (uuid), 
                INDEX IDX_943D1D8554177093 (room_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET UTF8 COLLATE `UTF8_unicode_ci` ENGINE = InnoDB
        ');
        $this->addSql('
            ALTER TABLE claro_bookingbundle_room 
            ADD CONSTRAINT FK_2083E96964D218E FOREIGN KEY (location_id) 
            REFERENCES claro__location (id) 
            ON DELETE SET NULL
        ');
        $this->addSql('
            ALTER TABLE claro_bookingbundle_room_booking 
            ADD CONSTRAINT FK_943D1D8554177093 FOREIGN KEY (room_id) 
            REFERENCES claro_bookingbundle_room (id) 
            ON DELETE SET NULL
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE claro_bookingbundle_room_booking 
            DROP FOREIGN KEY FK_943D1D8554177093
        ');
        $this->addSql('
            DROP TABLE claro_bookingbundle_material
        ');
        $this->addSql('
            DROP TABLE claro_bookingbundle_room
        ');
        $this->addSql('
            DROP TABLE claro_bookingbundle_room_booking
        ');
    }
}
