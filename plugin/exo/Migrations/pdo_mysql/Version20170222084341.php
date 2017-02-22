<?php

namespace UJM\ExoBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2017/02/22 08:43:42
 */
class Version20170222084341 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            CREATE TABLE ujm_content_video (
                id INT AUTO_INCREMENT NOT NULL, 
                title VARCHAR(255) NOT NULL, 
                url VARCHAR(255) NOT NULL, 
                type VARCHAR(255) NOT NULL, 
                width INT DEFAULT NULL, 
                height INT DEFAULT NULL, 
                duration INT DEFAULT NULL, 
                uuid VARCHAR(36) NOT NULL, 
                UNIQUE INDEX UNIQ_C3D86411D17F50A6 (uuid), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ');
        $this->addSql('
            CREATE TABLE ujm_content_audio (
                id INT AUTO_INCREMENT NOT NULL, 
                title VARCHAR(255) NOT NULL, 
                url VARCHAR(255) NOT NULL, 
                type VARCHAR(255) NOT NULL, 
                duration INT DEFAULT NULL, 
                uuid VARCHAR(36) NOT NULL, 
                UNIQUE INDEX UNIQ_A76288A8D17F50A6 (uuid), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ');
        $this->addSql('
            CREATE TABLE ujm_item_text_content (
                id INT AUTO_INCREMENT NOT NULL, 
                question_id INT DEFAULT NULL, 
                text_content LONGTEXT NOT NULL, 
                UNIQUE INDEX UNIQ_7EDCF9B11E27F6BF (question_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ');
        $this->addSql('
            CREATE TABLE ujm_item_audio_content (
                id INT AUTO_INCREMENT NOT NULL, 
                audio_id INT DEFAULT NULL, 
                question_id INT DEFAULT NULL, 
                INDEX IDX_64DC34F83A3123C7 (audio_id), 
                UNIQUE INDEX UNIQ_64DC34F81E27F6BF (question_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ');
        $this->addSql('
            CREATE TABLE ujm_item_image_content (
                id INT AUTO_INCREMENT NOT NULL, 
                image_id INT DEFAULT NULL, 
                question_id INT DEFAULT NULL, 
                INDEX IDX_CE7B6AF83DA5256D (image_id), 
                UNIQUE INDEX UNIQ_CE7B6AF81E27F6BF (question_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ');
        $this->addSql('
            CREATE TABLE ujm_item_video_content (
                id INT AUTO_INCREMENT NOT NULL, 
                video_id INT DEFAULT NULL, 
                question_id INT DEFAULT NULL, 
                INDEX IDX_BE86D48929C1004E (video_id), 
                UNIQUE INDEX UNIQ_BE86D4891E27F6BF (question_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ');
        $this->addSql('
            ALTER TABLE ujm_item_text_content 
            ADD CONSTRAINT FK_7EDCF9B11E27F6BF FOREIGN KEY (question_id) 
            REFERENCES ujm_question (id)
        ');
        $this->addSql('
            ALTER TABLE ujm_item_audio_content 
            ADD CONSTRAINT FK_64DC34F83A3123C7 FOREIGN KEY (audio_id) 
            REFERENCES ujm_content_audio (id)
        ');
        $this->addSql('
            ALTER TABLE ujm_item_audio_content 
            ADD CONSTRAINT FK_64DC34F81E27F6BF FOREIGN KEY (question_id) 
            REFERENCES ujm_question (id)
        ');
        $this->addSql('
            ALTER TABLE ujm_item_image_content 
            ADD CONSTRAINT FK_CE7B6AF83DA5256D FOREIGN KEY (image_id) 
            REFERENCES ujm_picture (id)
        ');
        $this->addSql('
            ALTER TABLE ujm_item_image_content 
            ADD CONSTRAINT FK_CE7B6AF81E27F6BF FOREIGN KEY (question_id) 
            REFERENCES ujm_question (id)
        ');
        $this->addSql('
            ALTER TABLE ujm_item_video_content 
            ADD CONSTRAINT FK_BE86D48929C1004E FOREIGN KEY (video_id) 
            REFERENCES ujm_content_video (id)
        ');
        $this->addSql('
            ALTER TABLE ujm_item_video_content 
            ADD CONSTRAINT FK_BE86D4891E27F6BF FOREIGN KEY (question_id) 
            REFERENCES ujm_question (id)
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE ujm_item_video_content 
            DROP FOREIGN KEY FK_BE86D48929C1004E
        ');
        $this->addSql('
            ALTER TABLE ujm_item_audio_content 
            DROP FOREIGN KEY FK_64DC34F83A3123C7
        ');
        $this->addSql('
            DROP TABLE ujm_content_video
        ');
        $this->addSql('
            DROP TABLE ujm_content_audio
        ');
        $this->addSql('
            DROP TABLE ujm_item_text_content
        ');
        $this->addSql('
            DROP TABLE ujm_item_audio_content
        ');
        $this->addSql('
            DROP TABLE ujm_item_image_content
        ');
        $this->addSql('
            DROP TABLE ujm_item_video_content
        ');
    }
}
