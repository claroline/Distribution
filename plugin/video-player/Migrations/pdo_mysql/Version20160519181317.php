<?php

namespace Claroline\VideoPlayerBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2016/05/19 06:13:18
 */
class Version20160519181317 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE claro_video_track (
                id INT AUTO_INCREMENT NOT NULL, 
                video_id INT DEFAULT NULL, 
                hash_name VARCHAR(255) NOT NULL, 
                lang VARCHAR(255) DEFAULT NULL, 
                kind VARCHAR(255) NOT NULL, 
                is_default VARCHAR(255) NOT NULL, 
                trackFile_id INT DEFAULT NULL, 
                resourceNode_id INT DEFAULT NULL, 
                UNIQUE INDEX UNIQ_D25DC065E1F029B6 (hash_name), 
                INDEX IDX_D25DC06529C1004E (video_id), 
                INDEX IDX_D25DC065ED87669A (trackFile_id), 
                UNIQUE INDEX UNIQ_D25DC065B87FAB32 (resourceNode_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql("
            ALTER TABLE claro_video_track 
            ADD CONSTRAINT FK_D25DC06529C1004E FOREIGN KEY (video_id) 
            REFERENCES claro_file (id) 
            ON DELETE CASCADE
        ");
        $this->addSql("
            ALTER TABLE claro_video_track 
            ADD CONSTRAINT FK_D25DC065ED87669A FOREIGN KEY (trackFile_id) 
            REFERENCES claro_file (id) 
            ON DELETE CASCADE
        ");
        $this->addSql("
            ALTER TABLE claro_video_track 
            ADD CONSTRAINT FK_D25DC065B87FAB32 FOREIGN KEY (resourceNode_id) 
            REFERENCES claro_resource_node (id) 
            ON DELETE CASCADE
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            DROP TABLE claro_video_track
        ");
    }
}